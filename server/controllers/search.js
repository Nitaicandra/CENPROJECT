const jwt = require('jsonwebtoken')
require("dotenv").config();

const searchRouter = require('express').Router()
const Service = require('../models/service')
const Customer = require('../models/customer')
const Auth = require('../models/authentication')
const { getTokenFrom } = require('./utils/helpers')

const apiKey = process.env.GEOCODING_KEY;


function extractDist(d){
    // Reads a string that contains a value in miles and parses it to a float
    d = d.replace(/,/g, '') // handles strings with thousands of miles
    
    const match = d.match(/[\d.]+/);
    if (match) {
        return parseFloat(match[0]);
    }

    return null
}

async function getDistances(customer, services){
    const origin = `${customer.location.coordinates[1]},${customer.location.coordinates[0]}`;
    let destinations = [];

    for (let service of services){
        const dest = `${service.provider.location.coordinates[1]},${service.provider.location.coordinates[0]}`;
        destinations.push(dest);
    }

    const destinationsStr = destinations.join('|');
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destinationsStr)}&units=imperial&key=${apiKey}`

    const request = await fetch(url);
    const data = await request.json();

    let distances = [];

    for(let i = 0; i < services.length; i++){
        let d = data.rows[0].elements[i].distance.text;
        d = extractDist(d);
        distances.push(d);
    }

    return distances;

}

searchRouter.get('/', async (request, response) => {
    // Search by a query parameter
    // Returns all services offered by businesses within 10 miles of the logged-in customer
    // Distance is an approximated value
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

    const customer = await Customer.findOne({ "login": { _id: decodedToken.id } });
    if (!customer) {
        return response.status(404).json({ error: 'no customer account attached to this user' });
    }

    let query = request.query.query;
    const regex = new RegExp(query, 'i'); //case-insensitive, includes partial matches

    let services = await Service.find({
        serviceName: regex,
    }).populate('provider');

    const distances = await getDistances(customer, services);

    let results = []
    for(let i = 0; i < services.length; i++){
        let d = distances[i]
        if (d > 10 || !d){
            continue;
        }

        results.push(
            {
                serviceId: services[i]._id,
                serviceName: services[i].serviceName,
                description: services[i].description,
                price: services[i].price,
                businessId: services[i].provider._id,
                businessName: services[i].provider.businessName,
                avgRating: services[i].provider.avgRating,
                distance: d
            }
        );
        d++;
    }

    response.status(200).json(results);
})

module.exports = searchRouter;