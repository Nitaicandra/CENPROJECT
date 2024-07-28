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
        return response.status(404).json({ error: 'no business account attached to this user' });
    }

    const {serviceName, description, price} = request.body
    const service = new Service({
        provider: business._id,
        serviceName,
        description, 
        price
    })

    const savedService = await service.save();
    business.services = business.services.concat(savedService._id)
    await business.save()

    response.status(201).json(service);
})

servicesRouter.get('/from/:businessId', async(request, response) => {
    // Returns all services created by a business iff the requester is logged in with a valid token
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: 'user is not logged in' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const businessId = request.params.businessId;
    const business = await Business.findById(businessId).populate('services');
    if (!business){
        return response.status(404).json({ error: `no business found with id ${businessId}` });
    }

    response.status(200).json(business.services)
})

servicesRouter.get('/:serviceId', async(request, response) => {
    // Returns a specific service iff the requester is logged in with a valid token
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: 'user is not logged in' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' });
    }

    const serviceId = request.params.serviceId;
    const service = await Service.findById(serviceId).populate('provider')
    if (!service){
        return response.status(404).json({ error: `no service found with id ${serviceId}` });
    }

    response.status(200).json(service)
})

module.exports = servicesRouter;

