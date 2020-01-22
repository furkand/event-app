const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    token: {
        type:String,
        required: true
    },
     email: {
         type: String,
         required: true
     },
     password: {
         type: String,
         required: true
     },
     createdEvents: [
         {
            // This is not mean that we add objects to created events. We add multiple IDs
             type: Schema.Types.ObjectId, 
             // this is allows me to set up a relation 
             ref:'Event' // model namfe 

        }
     ]
})

module.exports = mongoose.model('User', userSchema) 