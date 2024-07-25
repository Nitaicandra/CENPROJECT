const reviewsRouter = require('express').Router();
const Business = require('../models/business');
const Customer = require('../models/customer');
const Service = require('../models/service');
const Booking = require('../models/booking');
const Review = require('../models/review');
const Auth = require('../models/authentication');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
}

reviewsRouter.post('/:bookingId', async (request, response) => {
    // Allows logged-in customer to leave a review about bookingId
    // booking must be in the past (already fullfilled)
    // customer can only leave 1 review per booking
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: 'user is not logged in' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const user = await Auth.findById(decodedToken.id);
    if (user.accType !== 'customer') {
        return response.status(403).json({ error: 'not a customer account' });
    }

    const customer = await Customer.findOne({ "login": { _id: decodedToken.id } });
    if (!customer) {
        return response.status(404).json({ error: 'no customer account attached to this user' });
    }

    const bookingId = request.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return response.status(404).json({ error: `no booking found with id ${bookingId}`});
    }

    if (booking.review){
        return response.status(400).json({ error: `booking already has a review`});
    }

    if (booking.customer._id !== customer._id){
        return response.status(403).json({ error: `cannot leave a review for someone else's booking`});
    }

    let today = new Date();
    today = today.toISOString().split('T')[0];

    if(booking.date >= today){
        return response.status(400).json({ error: `cannot leave a review for an upcoming booking`});
    }

    const {rating, review} = request.body;
    if (rating < 0 || rating > 5){
        return response.status(400).json({ error: `invalid rating`});
    }

    const business = await Business.findById(booking.provider._id);

    const r = new Review({
        provider: business._id,
        customer: customer._id,
        review,
        rating
    });

    const savedReview = await r.save();
    business.reviews = await business.reviews.concat(savedReview._id);
    customer.reviews = await customer.reviews.concat(savedReview._id);
    booking.review = await savedReview._id;

    business.save();
    customer.save();
    booking.save();

    response.status(201).json(savedReview);
})

//reviewsRouter.post('/reply/reviewId', async (request, response) => {})

//reviewsRouter.get('/businessId', async (request, response) => {})

module.exports = reviewsRouter;