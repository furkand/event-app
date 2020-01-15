const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const {buildSchema} = require('graphql')

const app = express()

app.use(bodyParser.json())
app.use('/grapghql', graphqlHttp({
    schema: buildSchema(`
    type RootQuery {
        events : [String!]!

    }

    type RootMutation {
        createEvent(name: String) : String
    }
        schema {
            query: RootQuery
            mutation:  RootMutation
        }
    `),
    rootValue: {
        events: ()=> { 
            return ['Eat', 'Code', 'Repeat']; 
        }
        ,
        createEvent: (eventInfos) => {
            const eventName = eventInfos.name
            return eventName;
        }
    },
    graphiql : true
    })
);
app.listen(3000)