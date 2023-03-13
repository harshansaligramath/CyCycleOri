const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
 

  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },
 
  zip: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  
});

module.exports = mongoose.model("Orders", orderSchema);
