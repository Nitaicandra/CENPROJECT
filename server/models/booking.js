const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    time: {type: Date, required: true},
    status: {
        type: String, 
        enum: ['completed', 'cancelled', 'active'],
        default: 'active'
    }
  }, { timestamps: true } )

module.exports = mongoose.model('Booking', bookingSchema, 'bookings')