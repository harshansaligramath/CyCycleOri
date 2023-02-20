const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    image:{
        type:String,
    },
    isAvailable:{
        type:Number,
        default:1
    }
})

module.exports = mongoose.model('Banner',bannerSchema)
