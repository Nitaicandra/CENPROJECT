const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
    },
    serviceName: {type: String, required: true},
    description: {type: String, required: true},
    price: {
        type: mongoose.Types.Decimal128,
        required: true,
        min: 0,
        get: v => v.toString(),
        set: v => mongoose.Types.Decimal128.fromString(v)
    },
  })

module.exports = mongoose.model('Service', serviceSchema, 'services')