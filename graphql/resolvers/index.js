const bcrypt = require('bcryptjs')
const Event = require('../../models/event')
const User = require('../../models/user')

//in this way i do not need to use mongoose populate method and i can send request as much as i want this give more flexibilty
// take array of event ids and create from them array of event objects
const events =  async eventIds => {
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
         
    }
}