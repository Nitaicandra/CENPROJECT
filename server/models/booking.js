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
    date: {type: String, required: true},
    weekDay: {type: String, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    status: {
        type: String, 
        enum: ['completed', 'cancelled', 'active'],
        default: 'active'
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true,
        min: 0,
        get: v => v.toString(),
        set: v => mongoose.Types.Decimal128.fromString(v)
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    },
    discount: {type: Number, min: 0, max: 100, default: 0}
  }, { timestamps: true } )

module.exports = mongoose.model('Booking', bookingSchema, 'bookings')