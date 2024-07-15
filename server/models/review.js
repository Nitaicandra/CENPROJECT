const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
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
    review: {type: String},
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
  }, { timestamps: true } )

module.exports = mongoose.model('Review', reviewSchema, 'reviews')