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
    date: {type: Date, required: true},
    weekDay: {type: Date, required: true},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    status: {
        type: String, 
        enum: ['completed', 'cancelled', 'active'],
        default: 'active'
    },
    discount: {type: Number, min: 0, max: 100, default: 0}
  }, { timestamps: true } )

module.exports = mongoose.model('Booking', bookingSchema, 'bookings')