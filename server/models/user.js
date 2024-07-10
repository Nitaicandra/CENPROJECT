const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userType: {
        type: String, 
        required: true,
        enum: ['admin', 'customer', 'business'],
        default: 'customer',
    },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);