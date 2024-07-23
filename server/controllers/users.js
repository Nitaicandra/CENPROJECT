require("dotenv").config();
const bcrypt = require('bcrypt');

const SmartyStreetsSDK = require('smartystreets-javascript-sdk');
const SmartyStreetsCore = SmartyStreetsSDK.core;
const Lookup = SmartyStreetsSDK.usStreet.Lookup;
let credentials = new SmartyStreetsCore.StaticCredentials(process.env.SMARTY_KEY, process.env.SMARTY_TOKEN);
let client = SmartyStreetsCore.buildClient.usStreet(credentials);

const usersRouter = require('express').Router();
const Business = require('../models/business');
const Customer = require('../models/customer');
const Authentication = require('../models/authentication');


async function createAuth(accType, username, password) {
  // creates new authentication credentials for a user 
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const auth = new Authentication({
    username,
    passwordHash,
    accType
  });

  const login = await auth.save();
  return login;
}

async function validateAddress(street, city, state, zipCode) {
  // validates an input address using Smarty API
  // returns an object with a valid address if successful, or en empty one otherwise.
  let lookup = new Lookup();
  lookup.street = street;
  lookup.city = city;
  lookup.state = state;
  lookup.zipCode = zipCode;

  try {
    const results = await client.send(lookup);
    const lookupResult = results.lookups[0];

    if (lookupResult.result.length === 0) {
      console.log('invalid address');
      return {};
    }

    // Further check if other components besides street are a match
    // This is because the API may auto correct / approximate the input address to a different location
    const validatedAddr = lookupResult.result[0]
    const components = validatedAddr.components;
    if (components.zipCode !== zipCode || components.cityName.toLowerCase() !== city.toLowerCase() || components.state !== state) {
      console.log('invalid zipcode, city, and/or state');
      return {};
    }

    return {
      street: validatedAddr.deliveryLine1,
      city: validatedAddr.components.cityName,
      state: validatedAddr.components.state,
      zipCode: validatedAddr.components.zipCode,
      latitude: validatedAddr.metadata.latitude,
      longitude: validatedAddr.metadata.longitude
    };

  } catch (error) {
    console.log(error.message)
  }
}

usersRouter.post('/businesses', async (request, response) => {
  // Post a new business user account
  const { username, password } = request.body;
  if (!password || !username) {
    return response.status(400).json({ error: 'a username and password are required' });
  }

  const { businessName, address, zipCode, city, state, email, phoneNumber, availability } = request.body;
  if (!businessName || !address || !zipCode || !city || !state || !email || !phoneNumber || !availability) {
    return response.status(400).json({ error: 'missing field(s) when creating a business account' });
  }

  const validAddress = await validateAddress(address, city, state, zipCode);

  if (Object.keys(validAddress).length === 0) {
    return response.status(400).json({ error: 'invalid address' });
  }

  const type = 'business'
  const login = await createAuth(type, username, password);

  avStr = JSON.stringify(availability)

  const user = new Business({
    businessName,
    address: validAddress.street,
    zipCode: validAddress.zipCode,
    city: validAddress.city,
    state: validAddress.state,
    location: {
      type: 'Point',
      coordinates: [validAddress.longitude, validAddress.latitude]
    },
    email,
    phoneNumber,
    availability: avStr,
    avgRating: undefined,
    login: login._id
  })

  await user.save()
  response.status(201).json(login);
});

usersRouter.post('/customers', async (request, response) => {
  // Post a new customer user account
  const { username, password } = request.body;
  if (!password || !username) {
    return response.status(400).json({ error: 'a username and password are required' });
  }

  const { firstName, lastName, address, zipCode, city, state, email, phoneNumber } = request.body;
  if (!firstName || !lastName || !address || !zipCode || !city || !state || !email || !phoneNumber) {
    return response.status(400).json({ error: 'missing field(s) when creating a customer account' });
  }

  const validAddress = await validateAddress(address, city, state, zipCode);

  if (Object.keys(validAddress).length === 0) {
    return response.status(400).json({ error: 'invalid address' });
  }

  const type = 'customer'
  const login = await createAuth(type, username, password);

  const user = new Customer({
    firstName,
    lastName,
    address: validAddress.street,
    zipCode: validAddress.zipCode,
    city: validAddress.city,
    state: validAddress.state,
    location: {
      type: 'Point',
      coordinates: [validAddress.longitude, validAddress.latitude]
    },
    email,
    phoneNumber,
    login: login._id
  })

  await user.save()
  response.status(201).json(login);
});

usersRouter.get('/', async (request, response) => {
  // Get all logins
  const logins = await Authentication.find({});
  response.json(logins);
});

usersRouter.get('/businesses', async (request, response) => {
  // Get all business accounts
  const providers = await Business.find({});
  response.json(providers);
});

usersRouter.get('/customers', async (request, response) => {
  // Get all customer accounts
  const providers = await Customer.find({});
  response.json(providers);
});

module.exports = usersRouter;