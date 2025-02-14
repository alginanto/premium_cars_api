const express = require('express');
const Car = require('../models/cars');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get All Cars
router.get('/', authenticateToken, async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// all cars with pagination
router.get('/allcars', authenticateToken, async (req, res) => {
    try {
      // Get page from query parameter or default to 1
      const page = parseInt(req.query.page) || 1;
      const limit = 2; // Items per page
      const skip = (page - 1) * limit;
  
      // Get total count of cars
      const totalCars = await Car.countDocuments();
      
      // Get cars for current page
      const cars = await Car.find()
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 }); // Optional: sort by newest first
  
      res.json({
        cars,
        currentPage: page,
        totalPages: Math.ceil(totalCars / limit),
        totalCars,
        carsPerPage: limit
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Get Car by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
