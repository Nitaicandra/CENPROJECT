const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
    customer: { type: Schema.Types.ObjectID, ref: "User", required: true },
    service: { type: Schema.Types.ObjectID, ref: "Service", required: true },
    rating: { type: Number, min: 0, max: 5, required: true},
    description: { type: String },
});

module.exports = mongoose.model("Review", reviewSchema);