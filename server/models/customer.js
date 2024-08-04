const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: {type: String, required: true},
    zipCode: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    login : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Authentication',
      required: true,
    },
    bookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    }],
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reviews',
    }]
})

customerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      if (returnedObject._id) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
      }
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Customer', customerSchema, 'customers')
