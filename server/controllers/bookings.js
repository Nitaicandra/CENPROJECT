const bookingsRouter = require('express').Router();
const Business = require('../models/business');
const Customer = require('../models/customer');
const Service = require('../models/service');
const Booking = require('../models/booking');
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
    for (obj of businessHours) {
        if (weekday in obj) {
            let availability = obj[weekday][0];
            if (startTime >= availability.start && endTime <= availability.end) {
                valid = true
                break;
            }
        }
    }

    return valid;
}

const isAvailable = (date, startTime, endTime, bookings) => {
    let available = true;
    if (bookings.length === 0) { return available; }

    const bookingsOnDate = bookings.filter(booking => booking.date === date);
    if (bookingsOnDate.length === 0) { return available; }

    for (const booking of bookingsOnDate) {
        if (endTime >= booking.startTime && startTime <= booking.endTime) {
            available = false;
            break;
        }
    }

    return available;
}

bookingsRouter.post('/book-service/:serviceId', async (request, response) => {
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
    if (user.accType !== 'customer') {
        return response.status(403).json({ error: 'not a customer account' });
    }

    const customer = await Customer.findOne({ "login": { _id: decodedToken.id } }).populate('bookings');
    if (!customer) {
        return response.status(404).json({ error: 'no customer account attached to this user' });
    }

    const serviceId = request.params.serviceId;
    const service = await Service.findById(serviceId).populate('provider')
    if (!service) {
        return response.status(404).json({ error: `no service found with id ${serviceId}` });
    }

    const business = await Business.findById(service.provider._id).populate('bookings');
    if (!business) {
        return response.status(404).json({ error: `no business found with id ${service.provider._id}` });
    }

    const { date, weekDay, startTime, endTime } = request.body;

    const businessHours = JSON.parse(business.availability);
    if (!isWithinBusinessHours(weekDay, startTime, endTime, businessHours)) {
        return response.status(400).json({ error: `cannot book outside of business hours` });
    }

    if (!isAvailable(date, startTime, endTime, customer.bookings)) {
        return response.status(400).json({ error: `customer already has a conflicting booking` });
    }

    if (!isAvailable(date, startTime, endTime, business.bookings)) {
        return response.status(400).json({ error: `business is unavailable at requested times` });
    }

    const booking = new Booking({
        provider: business._id,
        customer: customer._id,
        service: service._id,
        date,
        weekDay,
        startTime,
        endTime,
        price: service.price
    });

    const savedBooking = await booking.save();
    customer.bookings = customer.bookings.concat(savedBooking._id);
    business.bookings = business.bookings.concat(savedBooking._id);
    await business.save();
    await customer.save();

    response.status(201).json(savedBooking);
})

bookingsRouter.delete('/:bookingId', async (request, response) => {
    // Allows a business to delete a booking
    // Can only delete bookings in the future (same day and prior is not allowed)
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: 'user is not logged in' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const user = await Auth.findById(decodedToken.id);
    if (user.accType !== 'business') {
        return response.status(403).json({ error: 'not a business account' });
    }

    const business = await Business.findOne({ "login": { _id: decodedToken.id } });
    if (!business) {
        return response.status(404).json({ error: 'no business account attached to this user' });
    }

    const bookingId = request.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return response.status(404).json({ error: `no booking found with id ${bookingId}` });
    }

    if (business._id.toString() !== booking.provider._id.toString()){
        return response.status(403).json({ error: 'user is unauthorized to delete this booking' });
    }

    let today = new Date();
    today = today.toISOString().split('T')[0];

    if (business.date <= today){
        return response.status(403).json({ error: 'cannot delete past nor same-day bookings' });
    }
    
    await booking.deleteOne();
   
    await Business.updateOne(
        { _id: business._id },
        { $pull: { bookings: bookingId } }
    );

    await Customer.updateOne(
        { _id: booking.customer._id },
        { $pull: { bookings: bookingId } }
    );

    response.status(200).json();
})

bookingsRouter.get('/future', async (request, response) => {
    // Get all upcoming bookings of the logged-in user
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: 'user is not logged in' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const user = await Auth.findById(decodedToken.id);
    let account

    if (user.accType !== 'business' && user.accType !== 'customer') {
        return response.status(403).json({ error: 'not a customer nor business account' });
    }

    if (user.accType === 'business') {
        account = await Business.findOne({ "login": { _id: decodedToken.id } }).populate('bookings');
    } else {
        account = await Customer.findOne({ "login": { _id: decodedToken.id } }).populate('bookings');
    }

    let today = new Date();
    today = today.toISOString().split('T')[0];

    let upcomingBookings = [];
    for (const booking of account.bookings) {
        if (booking.date >= today) { upcomingBookings.push(booking) }
    }

    response.status(200).json(upcomingBookings);
})

bookingsRouter.get('/past', async (request, response) => {
    // Get all past bookings of the logged-in user
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: 'user is not logged in' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const user = await Auth.findById(decodedToken.id);
    let account

    if (user.accType !== 'business' && user.accType !== 'customer') {
        return response.status(403).json({ error: 'not a customer nor business account' });
    }

    if (user.accType === 'business') {
        account = await Business.findOne({ "login": { _id: decodedToken.id } }).populate('bookings');
    } else {
        account = await Customer.findOne({ "login": { _id: decodedToken.id } }).populate('bookings');
    }

    let today = new Date();
    today = today.toISOString().split('T')[0];

    let upcomingBookings = [];
    for (const booking of account.bookings) {
        if (booking.date < today) { upcomingBookings.push(booking) }
    }

    response.status(200).json(upcomingBookings);
})

module.exports = bookingsRouter;