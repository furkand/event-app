const Event = require("../../models/event");
const {eventTransformer,user} =  require("../../helpers");
const User = require("../../models/user");


module.exports = {
    events: async () => {    
        try{
            const events = await Event.find()
            return events.map(event=>{
                    return eventTransformer(event)
                })
        }
        catch (err){
            throw new Error(`${err}`)
        }
    },
    createEvent: async (eventInfos,req) => {  
        if(!req.isAuth){
            throw new Error("Unauthenticated!")
        }

        const event = new Event({
            title: eventInfos.eventInput.title,
            description: eventInfos.eventInput.description,
            price: +eventInfos.eventInput.price,
            date: new Date(eventInfos.eventInput.date),
            creator: req.userId
        });
        let createdEvent
        try{
        const result = await  event.save()
            createdEvent = eventTransformer(result)
            const userResult = await User.findById(req.userId)
            if(!userResult) {throw new Error('user not exists ')}
            userResult.createdEvents.push(event)
            await userResult.save()

            
            return createdEvent
        }
        catch(err){
            throw err
        }
        }
}