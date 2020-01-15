const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const {buildSchema} = require('graphql')
const mongoose = require('mongoose')
const Event = require('./models/event')
const User = require('./models/user')
const bcrypt = require('bcryptjs')

const app = express()


app.use(bodyParser.json())
app.use('/grapghql', graphqlHttp({
    schema: buildSchema(`
    #how my event schema will looks like eventually
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: String!
    }
    type User {
        _id : ID!
        email: String!
        password: String
        createdEvents: [Event]
    }
    input UserInput {
        email: String!
        password: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String! 
        creator: ID!
    }
    type RootQuery {
        events : [Event!]! #return array of Event objects
    }
    type RootMutation {
        createEvent(eventInput: EventInput) : Event
        createUser(userInput : UserInput ) : User
    }
        schema {
            query: RootQuery
            mutation:  RootMutation
        }
    `),
    rootValue: {
        events: ()=> { 
            
            const events = Event.find() 
            return events.then((events)=> {
                return events
                
            })
            .catch(err=>{
                throw err 
            })
        }
        ,
        createEvent: (eventInfos) => {
             return User.findById(eventInfos.eventInput.creator).then( user=>{
                if(!user){throw new Error('There is no user that have this user id')}
                const event = new Event({
                    title: eventInfos.eventInput.title,
                    description: eventInfos.eventInput.description,
                    price: eventInfos.eventInput.price,
                    date: eventInfos.eventInput.date,
                    creator : eventInfos.eventInput.creator
                });
                let createdEvent
                return event.save()
                .then((result)=>{
                    createdEvent = result
                    return User.findById(eventInfos.eventInput.creator)
                }
                ).then(user=>{
                    user.createdEvents.push(createdEvent);
                    return user.save(); 
                })
                .then(user=> { 
                    console.log(user.createdEvents) 
                    return createdEvent
                })
                .catch(err => {
                    console.log(err)
                    throw err;
                }); 
            })
            
   

        },
        createUser: (userInfos) =>{
            return User.findOne({email: userInfos.userInput.email}).then( user =>{
                if (user){
                    throw new Error('This email is already taken')
                }else{
                      //we want express graph ql to wait us because it is async function
           return bcrypt
           .hash(userInfos.userInput.password,12)
           .then(hashedPassword => {
               const user = new User({
                   email: userInfos.userInput.email,
                   password: hashedPassword
               });
               console.log('user: ' + user)
               return user.save()
           })
           .then(result=>{
               return result
           })
           .catch(err=>{ throw err})
                }
            })
                
        }
    },
    graphiql : true
    })
);


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-zezow.mongodb.net/event-app?retryWrites=true&w=majority` , { useNewUrlParser: true })

.then(()=>{
    console.log("Database connected to server")
    app.listen(3000)  
    console.log("App is listening on 3000")  
})
.catch(err=>{
    console.log(err)
})
