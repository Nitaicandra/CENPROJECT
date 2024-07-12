const mongoose = require('mongoose')
const express = require('express');

const app = express();
const cors = require('cors');
const url = process.env.MONGODB_URI

const usersRouter = require('./controllers/users');

console.log('connecting to', url)

mongoose.connect(url, {
})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.use('/api/users', usersRouter);

module.exports = app;