const Booking = require('../../models/booking');
const Event = require("../../models/event")
const {bookingTransformer, eventTransformer} = require('../../helpers')



module.exports = {

    bookings: async (id,req) => {
        if(!req.isAuth){
            throw new Error("Unauthenticated!")
        }
        try{
            const bookings = await Booking.find();
            return bookings.map( booking =>{
                return bookingTransformer(booking);
            })
        }catch(err){
            throw err
        }
    },
    bookEvent: async (id,req) => {
        if(!req.isAuth){
            throw new Error("Unauthenticated!")
        }
        const bookedEvent = await Event.findOne({_id: id.eventId});
        const booking = new Booking({
            user: req.userId,
            event: bookedEvent
        })
        const result = await booking.save();
        return bookingTransformer(result);  
    },
    cancelBooking: async(id,req)=>{
        if(!req.isAuth){
            throw new Error("Unauthenticated!")
        }
        try{
            // I populated the event property of booking because i need rich data to return event
            const booking = await Booking.findById(id.bookingId).populate('event')
            const event = eventTransformer(booking.event )
            const cancelled = await Booking.deleteOne({_id: id.bookingId});
            return event
        }catch(err){throw err}

    }
}