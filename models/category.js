const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Number,
        default:1
    },
    is_verified: {
        type: Number,
        required: true,
        default:1
    },
    is_admin: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Category',categorySchema)