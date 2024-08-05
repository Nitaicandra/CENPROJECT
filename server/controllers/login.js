const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const Auth = require('../models/authentication')
require("dotenv").config();
const secret = process.env.SECRET

loginRouter.post('/', async (request, response) => {
    // Handles token authentication 
    const { username, password } = request.body;
    const user = await Auth.findOne({ username });
    
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)
  
    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }
  
    const userForToken = {
      username: user.username,
      id: user._id,
      type: user.accType
    }
  
    const token = jwt.sign(userForToken, secret);
  
    response
      .status(200)
      .send({ token, username: user.username, id: user._id, type: user.accType })
})
  
module.exports = loginRouter