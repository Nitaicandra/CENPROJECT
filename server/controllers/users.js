const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const Business = require('../models/business');
const Customer = require('../models/customer');
const Authentication = require('../models/authentication')

async function createAuth (accType, username, password){
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

usersRouter.post('/businesses', async (request, response) => {
    // Post a new business user account

    const { username, password, businessName, address, zipCode, city, state, email, phoneNumber, availability } = request.body;
    
    // checks for missing fields
    if (!businessName || !address || !zipCode || !city || !state || !email || !phoneNumber || !availability) {
      return response.status(400).json({ error: 'missing field(s) when creating a business account' });
    }

    // checks for existing username / email
    const existingUser = await Authentication.findOne({ username });
    if (existingUser) {
      return response.status(400).json({ error: 'username already exists, please select another' });
    }
    const existingEmail = await Business.findOne({ email });
    if (existingEmail) {
      return response.status(400).json({ error: 'email is associated with existing account, please select another' });
    }

    const type = 'business'
    const login = await createAuth(type, username, password);

    avStr = JSON.stringify(availability)

    const user = new Business({
      businessName, 
      address,
      zipCode,
      city,
      state, 
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

  const { username, password, firstName, lastName, address, zipCode, city, state, email, phoneNumber } = request.body;

  // checks for missing fields
  if ( !firstName || !lastName || !address || !zipCode || !city || !state || !email || !phoneNumber) {
    return response.status(400).json({ error: 'missing field(s) when creating a customer account' });
  }

  // checks for existing username / email
  const existingUser = await Authentication.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'username already exists, please select another' });
  }
  const existingEmail = await Customer.findOne({ email });
  if (existingEmail) {
    return response.status(400).json({ error: 'email is associated with existing account, please select another' });
  }

  const type = 'customer'
  const login = await createAuth(type, username, password);

  const user = new Customer({
    firstName, 
    lastName,
    address,
    zipCode,
    city,
    state, 
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