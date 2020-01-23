
const Event = require('./models/event')
const User = require('./models/user')
const {dateTransformer} = require("./date")

const user = async (userId) => {
    try{
        const user = await User.findById(userId)
    return {
        ...user._doc, 
        _id:user.id,
        createdEvents: events.bind(this,user._doc.createdEvents) // this action will be called just when i need this information
    };
    }
    catch{
        throw new Error('user is could not find')
    }
    
}
//I need to refactor the data when i take data from the mongoDB 
const eventTransformer = (event) =>{
    return {
        ...event._doc,
        _id: event.id,
        date: dateTransformer(event.date),
        creator: user.bind(this,event.creator)
    }
}

// this async fetchSingleEvent function will work exactly same principle with events function but it will fetch just one event
const fetchSingleEvent = async (eventId) =>{
    try{
        const event = await Event.findById(eventId);
        return eventTransformer(event);
    }catch(err){
        throw err
    }
}
const bookingTransformer = (booking) =>{
    return {
        ...booking._doc, 
        _id: booking.id , 
        user: user.bind(this, booking._doc.user),
        event: fetchSingleEvent.bind(this, booking._doc.event),
        createdAt: dateTransformer(booking._doc.createdAt),
        updatedAt: dateTransformer(booking._doc.updatedAt)
    }
}



//in this way i do not need to use mongoose populate method and i can send request as much as i want this give more flexibilty
// take array of event ids and create from them array of event objects
const events =  async (eventIds) => {
    try {
        const events = await  Event.find({_id: { $in: eventIds}}) 
        return events.map( event =>{

            return eventTransformer(event)
        })
          
    } 
    catch(err) {
        throw new Error ('events are could not find')
    }

}



exports.user = user;
exports.events = events;
exports.fetchSingleEvent = fetchSingleEvent;
exports.bookingTransformer = bookingTransformer;
exports.eventTransformer = eventTransformer;