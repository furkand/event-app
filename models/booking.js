const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    event : {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{timestamps : true} // it add created add, updated at automatically  
)

module.exports = mongoose.model('Booking' , bookingSchema)