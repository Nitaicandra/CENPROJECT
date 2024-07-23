const bookingsRouter = require('express').Router();
const Business = require('../models/business');
const Customer = require('../models/customer');
const Service = require('../models/service');
const Auth = require('../models/authentication');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
}

const isWithinBusinessHours = (weekday, startTime, endTime, businessHours) => {
    let valid = false;
    for (obj of businessHours){
        if(weekday in obj){
            let availability = obj[weekday][0];
            if (startTime >= availability.start && endTime <= availability.end){
                valid = true
                break;
            }
        }
    }

    return valid;
}

const isAvailable = (date, startTime, endTime, bookings) => {
    let available = true;
    if (bookings.length === 0){ return available; }

    const bookingsOnDate = bookings.filter(booking => booking.date === date);
    if (bookingsOnDate.length === 0){ return available; }

    for (const booking of bookingsOnDate){
        if (endTime >= booking.startTime && startTime <= booking.endTime){
            available = false;
            break;
        }
    }
    
    return available;
}

bookingsRouter.post('/book-service/:serviceId', async(request, response) => {
    // Creates a booking with a provider for a service
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: 'user is not logged in' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const user = await Auth.findById(decodedToken.id)
    if (user.accType !== 'customer'){
        return response.status(403).json({ error: 'not a customer account' });
    }

    const customer = await Customer.findOne({"login": {_id: decodedToken.id}});
    if (!customer){
        return response.status(404).json({ error: 'no customer account attached to this user' });
    }

    const serviceId = request.params.serviceId;
    const service = await Service.findById(serviceId).populate('provider')
    if (!service){
        return response.status(404).json({ error: `no service found with id ${serviceId}` });
    }

    // Retrieve booking time from request
    const { date, weekday, startTime, endTime } = request.body;

    // Check if the desired time is within business hours
    const businessHours = JSON.parse(service.provider.availability);
    if (!isWithinBusinessHours(weekday, startTime, endTime, businessHours)){
        return response.status(400).json({ error: `cannot book outside of business hours` });
    }

    // Check if desired time is available for booking 
    if (!isAvailable(date, startTime, endTime, customer.bookings)){
        return response.status(400).json({ error: `customer already has a conflicting booking` });
    }

    if (!isAvailable(date, startTime, endTime, service.provider.bookings)){
        return response.status(400).json({ error: `business is unavailable at requested times` });
    }

    // create booking
    
    // add the booking to customer
    // add the booking to business

    response.status(200).json();
})
bookingsRouter.get('/', async(request, response) => {})

module.exports = bookingsRouter;