const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const resolver = require('./graphql/resolvers/index')
const schema = require('./graphql/schema/index')
const isAuth = require("./middleware/auth")

const app = express()


app.use(bodyParser.json())
app.use(isAuth)
app.use('/grapghql', graphqlHttp({
    schema:schema ,
    rootValue: resolver,
    graphiql : true
    })
);


mongoose.connect(`mongodb+srv://furkandemirturk:f4xu76NmhPQrVY6p@cluster0-zezow.mongodb.net/event-app?retryWrites=true&w=majority` )

.then(()=>{
    console.log("Database connected to server")
    app.listen(3000)  
    console.log("App is listening on 3000")  
})
.catch(err=>{
    console.log(err)
})
