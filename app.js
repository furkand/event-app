const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const resolver = require('./graphql/resolvers/index')
const schema = require('./graphql/schema/index')

const app = express()


app.use(bodyParser.json())
app.use('/grapghql', graphqlHttp({
    schema:schema ,
    rootValue: resolver,
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
