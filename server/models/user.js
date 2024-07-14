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
  }
})

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
  login : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Authentication',
    required: true,
  }
})

const authSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  accType: {
    type: String, 
    required: true,
    enum: ['admin', 'customer', 'business'],
  },
})

customerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

businessSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

authSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('Customer', customerSchema, 'users')
module.exports = mongoose.model('Business', businessSchema, 'users')
module.exports = mongoose.model('Authentication', authSchema, 'users')

