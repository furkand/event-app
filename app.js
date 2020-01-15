const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const {buildSchema} = require('graphql')
const mongoose = require('mongoose')
const Event = require('./models/event')

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
    }


    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type RootQuery {
        events : [Event!]! #return array of Event objects
    }
    type RootMutation {
        createEvent(eventInput: EventInput) : Event
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
         
        const event = new Event({
            title: eventInfos.eventInput.title,
            description: eventInfos.eventInput.description,
            price: eventInfos.eventInput.price,
            date: eventInfos.eventInput.date
        });
        return event.save()
        .then(result=> { 
            console.log('result: ' + result) 
            return {...result._doc} //leave out all the meta data 
        })
        .catch(err => {
            console.log(err)
            throw err;
        }); 

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
