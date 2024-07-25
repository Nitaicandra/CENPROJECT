const reviewsRouter = require('express').Router();
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

reviewsRouter.post('/businessId', async (request, response) => {})

reviewsRouter.post('/reply/reviewId', async (request, response) => {})

reviewsRouter.get('/businessId', async (request, response) => {})

module.exports = reviewsRouter;