const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  accType: {
    type: String, 
    required: true,
    enum: ['admin', 'customer', 'business'],
  },
})

authSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('Authentication', authSchema, 'logins')

