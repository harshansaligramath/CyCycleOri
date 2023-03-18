// const mongoose = require('mongoose')

// const offerSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     // discount:{
//     //     type:Number,
//     //     required:true
//     // },%
//     //discount
//     max:{
//         type:Number,
//         required:true
//     },
//     //amt
//     min:{
//         type:Number,
//         required:true
//     },
//     isAvailable:{
//         type:Number,
//         default:1
//     },

// })

// module.exports = mongoose.model('Offer',offerSchema)

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
    max:{
        type:Number,
        required:true
    },
    min:{
        type:Number,
        required:true
    },
    isAvailable:{
        type:Number,
        default:1
    },

})

module.exports = mongoose.model('Offer',offerSchema)