const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date, 
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }


});
//my collection name will be this
module.exports =  mongoose.model('Event', eventSchema)