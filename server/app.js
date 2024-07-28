const mongoose = require('mongoose')
const express = require('express');

const app = express();
const cors = require('cors');
const url = process.env.MONGODB_URI

const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const servicesRouter = require('./controllers/services');
const bookingsRouter = require('./controllers/bookings');
const reviewsRouter = require('./controllers/reviews');

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
app.use('/api/login', loginRouter);
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);

module.exports = app;