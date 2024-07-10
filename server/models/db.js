const Booking = require("./booking.js");
const Review = require("./review.js");
const Service = require("./service.js");
const User = require("./user.js");

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
console.log('Connecting to', process.env.MONGODB_URI);

mongoose.connect(url, {})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

async function bookingCreate(customer, service, time) {
  const booking = new Booking({
    customer: customer,
    service: service,
    time: time
  });

  await booking.save();
}

async function reviewCreate(customer, service, rating, description) {
  const review = new Review({
    customer: customer,
    service: service,
    rating: rating,
    description: description
  });

  await review.save();
}

async function serviceCreate(provider, title, description, price) {
  const service = new Service({
    provider: provider,
    title: title,
    description: description,
    price: price
  });

  await service.save();
}

async function userCreate(email, username, password, firstName, lastName, phoneNumber) {
  const user = new User({ 
    email: email, 
    username: username, 
    password: password, 
    firstName: firstName, 
    lastName: lastName, 
    phoneNumber: phoneNumber
  });

  await user.save();
}