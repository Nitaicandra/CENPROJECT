const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    login : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Authentication',
      required: true,
    }
})

adminSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      if (returnedObject._id) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
      }
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Admin', adminSchema, 'admins')
