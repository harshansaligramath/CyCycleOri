const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    isAvailable:{
        type:Number,
        default:1
    },

})

module.exports = mongoose.model('Offer',offerSchema)