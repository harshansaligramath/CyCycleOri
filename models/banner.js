const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

    name:{
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
   
    image:{
        type:Array,
    },
    isAvailable:{
        type:Number,
        default:1
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Banner',bannerSchema)
