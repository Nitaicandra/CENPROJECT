const reviewsRouter = require('express').Router();
const Business = require('../models/business');
const Customer = require('../models/customer');
const Service = require('../models/service');
const Booking = require('../models/booking');
const Review = require('../models/review');
const Auth = require('../models/authentication');
const jwt = require('jsonwebtoken');

const { getTokenFrom }  = require('./utils/helpers');

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
        return response.status(404).json({ error: `no booking found with id ${bookingId}` });
    }

    if (booking.review) {
        return response.status(400).json({ error: `booking already has a review` });
    }

    if (booking.customer._id.toString() !== customer._id.toString()) {
        return response.status(403).json({ error: `cannot leave a review for someone else's booking` });
    }

    let today = new Date();
    today = today.toISOString().split('T')[0];

    if (booking.date >= today) {
        return response.status(400).json({ error: `cannot leave a review for an upcoming booking` });
    }

    const { rating, review } = request.body;
    if (rating < 0 || rating > 5) {
        return response.status(400).json({ error: `invalid rating` });
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

reviewsRouter.put('/reply/:reviewId', async (request, response) => {
    // Allows a business to reply to a review left by a customer for a service
    // business can only reply once per booking
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

    const reviewId = request.params.reviewId;
    const review = await Review.findById(reviewId);
    if (!review) {
        return response.status(404).json({ error: `no review found with id ${reviewId}` });
    }

    if (review.provider._id.toString() !== business._id.toString()) {
        return response.status(403).json({ error: 'cannot reply to a review for another business' });
    }

    if (review.reply) {
        return response.status(400).json({ error: 'review already has a reply' });
    }

    const {reply} = request.body;
    if(!reply){
        return response.status(400).json({ error: 'no reply was sent in request' });
    }
  
    review.reply = reply;
    const updatedReview = await review.save();

    response.status(200).json(updatedReview);
})

reviewsRouter.get('/business', async (request, response) => {
    // Gets all reviews left for logged-in business
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

    const business = await Business.findOne({ "login": { _id: decodedToken.id } }).populate('reviews');
    if (!business) {
        return response.status(404).json({ error: 'no business account attached to this user' });
    }

    response.status(200).json(business.reviews);
})

reviewsRouter.get('/rating/:businessId', async (request, response) => {
    // Calculates and returns the current rating of a business from their customer reviews
    // Response object contaisn the calcuated avg rating and count of reviews
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: 'user is not logged in' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const businessId = request.params.businessId;

    const business = await Business.findById(businessId).populate('reviews');
    if (!business) {
        return response.status(404).json({ error: `no business found with id ${businessId}` });
    }

    let totalRating = 0;
    let reviewCount = business.reviews.length;

    business.reviews.forEach(review => {
        totalRating += review.rating;
    });

    let averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    const res = {
        averageRating,
        reviewCount
    }

    response.status(200).json(res);
})

module.exports = reviewsRouter;