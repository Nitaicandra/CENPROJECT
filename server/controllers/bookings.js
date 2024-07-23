const bookingsRouter = require('express').Router();
const Business = require('../models/business');
const Customer = require('../models/customer');
const Service = require('../models/service');
const Auth = require('../models/authentication');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null
}

bookingsRouter.post('/', async(request, response) => {})
bookingsRouter.get('/', async(request, response) => {})

module.exports = bookingsRouterRouter;