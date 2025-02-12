const express = require('express');
const User = require('../models/user');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Create Booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.bookings.push({
      carId: req.body.carId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: 'pending'
    });
    await user.save();
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
