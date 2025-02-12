const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  location: String,
  bookings: [{
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    startDate: Date,
    endDate: Date,
    status: String
  }]
});

module.exports = mongoose.model('User', userSchema);
