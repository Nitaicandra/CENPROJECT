const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema ({
    customer: { type: Schema.Types.ObjectID, ref: "User", required: true },
    service: { type: Schema.Types.ObjectID, ref: "Service", required: true },
    time: {type: Date, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);