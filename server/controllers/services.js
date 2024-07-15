const servicesRouter = require('express').Router();
const Business = require('../models/business');
const Auth = require('../models/authentication');
const Service = require('../models/service');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null
}

servicesRouter.post('/', async(request, response) => {
    // Creates a new service for the logged in user iff the user is a business
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: 'user is not logged in' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const user = await Auth.findById(decodedToken.id)
    if (user.accType !== 'business'){
        return response.status(403).json({ error: 'not a business account' });
    }

    const business = await Business.findOne({"login": {_id: decodedToken.id}});
    if (!business){
        return response.status(403).json({ error: 'no business account attached to this user' });
    }
    
    const {serviceName, description, price} = request.body
    const service = new Service({
        provider: business._id,
        serviceName,
        description, 
        price
    })

    await service.save();
    response.status(201).json(service);
})

module.exports = servicesRouter;

