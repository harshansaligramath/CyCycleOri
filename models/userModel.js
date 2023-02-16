const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
   
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Number,
        required: true
    },
    is_verified: {
        type: Number,
        required: true,
        default:1
    },
    status: {
        type: String,
        required: true,
        default:0
    }



});

module.exports = mongoose.model('user', userSchema)