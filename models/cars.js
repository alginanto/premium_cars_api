const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: String,
  brand: String,
  model: String,
  year: Number,
  specifications: {
    power: String,
    maxSpeed: String,
    acceleration: String,
    engineCapacity: String
  },
  price: {
    rental: Number,
    purchase: Number
  },
  description: String,
  images: [String],
  availability: Boolean
});

module.exports = mongoose.model('Car', carSchema);
