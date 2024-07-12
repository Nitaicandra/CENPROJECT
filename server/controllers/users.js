const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/providers', async (request, response) => {
    // Post a new provider user account
    const { username, password } = request.body;
    const type = "provider"

    console.log("username is " + username)
    console.log("password is " + password)
  
    if (!password || !username) {
      return response.status(400).json({ error: 'a password and username are required' });
    }
  
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
  
    const user = new User({
      username,
      passwordHash,
      type
    });
  
    const savedUser = await user.save();
    response.status(201).json(savedUser);
});
  
  usersRouter.get('/', async (request, response) => {
    // Get all users
    const users = await User.find({});
    response.json(users);
  });
  
  module.exports = usersRouter;