const bcrypt = require('bcryptjs')
const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

//in this way i do not need to use mongoose populate method and i can send request as much as i want this give more flexibilty
// take array of event ids and create from them array of event objects
const events =  async (eventIds) => {
    try {
        const events = await  Event.find({_id: { $in: eventIds}}) 
        return events.map( event =>{

            return{
                ...event._doc,
                _id: event.id,
                date: (event._doc.date.toISOString()), //date is stored in a date object in mongodb that's why i need to change it
                // this wont create infinite loop because this part of code wont executed as long as I dont request that
                creator: user.bind(this,event.creator)
            }
        })
          
    } 
    catch(err) {
        throw new Error ('events are could not find')
    }

}
// this async fetchSingleEvent function will work exactly same principle with events function but it will fetch just one event
    const fetchSingleEvent = async (eventId) =>{
        try{
            const event = await Event.findById(eventId);
            return { 
                ...event._doc, 
                _id : event.id,
                creator: user.bind(this, event.creator)
            }
        }catch(err){
            throw err
        }
    }

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
module.exports = {
    events: async () => {    
        try{
            const events = await Event.find()
            return events.map(event=>{
                    return {
                        ...event._doc, 
                        _id : event.id,
                        date : event._doc.date.toISOString(),
                        creator : user.bind(this, event._doc.creator) // this action will be called just when i need this information
                    }
                })
        }
        catch (err){
            throw new Error(`${err}`)
        }
    },
    bookings: async () => {
        try{
            const bookings = await Booking.find();
            return bookings.map( booking =>{
                return { 
                    ...booking._doc, 
                    _id : booking.id, 
                    user: user.bind(this, booking._doc.user),
                    event: fetchSingleEvent.bind(this,booking._doc.event),
                    createdAt : new Date(booking._doc.createdAt).toISOString(),
                    updatedAt : new Date(booking._doc.updatedAt).toISOString() 
                }
            })
        }catch(err){
            throw err
        }
    },
    createEvent: async (eventInfos) => {  
        console.log('inf unction')
        const event = new Event({
            title: eventInfos.eventInput.title,
            description: eventInfos.eventInput.description,
            price: +eventInfos.eventInput.price,
            date: new Date(eventInfos.eventInput.date),
            creator: '5e20a1c7896d900c6e5427dc'
        });
        let createdEvent
        try{
        const result = await  event.save()
            createdEvent = {
                ...result._doc, 
                _id : result.id, 
                date : result._doc.date.toISOString(),
                creator: user.bind(this, result._doc.creator)
            }
            const userResult = await User.findById('5e20a1c7896d900c6e5427dc')
            if(!userResult) {throw new Error('user not exists ')}
            userResult.createdEvents.push(event)
            await userResult.save()

            
            return createdEvent
        }
        catch(err){
            throw err
        }
        },
    createUser: async (userInfos) =>{
        try{
         const user =  await User.findOne({email: userInfos.userInput.email})
            if(user){
                throw new Error('this email is already taken')
            }
            const hashedPassword = await bcrypt.hash(userInfos.userInput.password,12)

            const userSchema = new User({
                email: userInfos.userInput.email,
                password : hashedPassword
            })
            const result = await userSchema.save();
            return { 
                ...result._doc ,password: null, _id: result.id
            }
        }
        catch (err){
            throw new Error(err);
        }
         
    },
    bookEvent: async (id) => {
        const bookedEvent = await Event.findOne({_id: id.eventId});
        const booking = new Booking({
            user: '5e20a1c7896d900c6e5427dc',
            event: bookedEvent
        })
        const result = await booking.save();
        return {
            ...result._doc, 
            _id: result.id , 
            user: user.bind(this, booking._doc.user),
            event: fetchSingleEvent.bind(this,booking._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.createdAt).toISOString()
        }
    },
    cancelBooking: async(id)=>{
        try{
            // I populated the event property of booking because i need rich data to return event
            const booking = await Booking.findById(id.bookingId).populate('event')
            const event = { ...booking.event._doc, 
                _id: booking.event.id, 
                creator: user.bind(this,booking.event.creator)
            };
            const cancelled = await Booking.deleteOne({_id: id.bookingId});
            return event
        }catch(err){throw err}

    }
}