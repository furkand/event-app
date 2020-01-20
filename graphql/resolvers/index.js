const userResolver = require('./user')
const bookingResolver = require('./bookings')
const eventResolver = require('./events')

const rootResolver = {
    ...bookingResolver,
    ...userResolver,
    ...eventResolver

}
module.exports = rootResolver;