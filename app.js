const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
const resolver = require('./graphql/resolvers/index')
const schema = require('./graphql/schema/index')
const isAuth = require("./middleware/auth")

const app = express()

const PORT = process.env.PORT  || 5000

app.use(bodyParser.json())
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
    if(req.method === "OPTIONS"){
        return res.sendStatus(200);
    }
    next()
})
app.use(isAuth)
app.use('/graphql', graphqlHttp({
    schema:schema ,
    rootValue: resolver,
    graphiql : true
    })
);


mongoose.connect(`mongodb+srv://furkandemirturk:f4xu76NmhPQrVY6p@cluster0-zezow.mongodb.net/event-app?retryWrites=true&w=majority` )

.then(()=>{
    console.log("Database connected to server")
    app.listen(PORT)  
    console.log("App is listening on " + PORT)  
})
.catch(err=>{
    console.log(err)
})
