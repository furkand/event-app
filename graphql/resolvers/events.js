const Event = require("../../models/event")
const {eventTransformer} =  require("./helpers")


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
    createEvent: async (eventInfos) => {  
        const event = new Event({
            title: eventInfos.eventInput.title,
            description: eventInfos.eventInput.description,
            price: +eventInfos.eventInput.price,
            date: new Date(eventInfos.eventInput.date),
            creator: '5e25cdfc8e06fc5a8d39fdd7'
        });
        let createdEvent
        try{
        const result = await  event.save()
            createdEvent = eventTransformer(result)
            const userResult = await User.findById('5e25cdfc8e06fc5a8d39fdd7')
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