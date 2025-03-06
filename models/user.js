const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  location: String,
  image: { 
    type: String,  // For storing the URL or file path to the image
    default: '/default-profile.jpg',  // Optional default image path
    uploadDate: { type: Date, default: Date.now }
  },
  bookings: [{
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    startDate: Date,
    endDate: Date,
    status: String
  }]
});

module.exports = mongoose.model('User', userSchema);
