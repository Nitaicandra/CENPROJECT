const mongoose = require('mongoose')

const businessSchema = new mongoose.Schema({
    businessName: { type: String, required: true, unique: true },
    address: {type: String, required: true},
    zipCode: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    availability: [{ type: String, required: true }],
    avgRating: {
      type: Number,
      min: 0,
      max: 5
    },
    login: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Authentication',
      required: true,
    },
    services: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    }],
    bookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    }],
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reviews',
    }]
})

  businessSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Business', businessSchema, 'businesses')