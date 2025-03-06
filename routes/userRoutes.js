const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Set up storage engine for image upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// @route GET /details
// @desc Get current user details
// @access Private (requires token)
router.get('/me', authenticateToken, async (req, res) => {
    console.log('req.user', req.user);
    try {
        // Get user ID from the token payload
        const userId = req.user.id; // Based on your jwt.sign({ id: user._id }) in auth routes
        
        // Find user by ID and exclude password
        const user = await User.findById(userId)
            .select('-password')
            .populate('bookings.carId', 'make model year'); // Optional: populate car details

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route PUT /edit
// @desc Edit user profile
// @access Private (requires token)
router.put('/edit', authenticateToken, async (req, res) => {
    try {
        // Get user ID from the token payload
        const userId = req.user.id;
        const { name, password, email, location } = req.body;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (location) user.location = location;
        if (email) user.email = email;

        // Update password if provided (with hashing)
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Handle image upload if included
        upload(req, res, async (uploadErr) => {
            if (uploadErr) {
                return res.status(400).json({ message: uploadErr });
            }

            // If a file was uploaded, update the image path
            if (req.file) {
                user.image = `/uploads/${req.file.filename}`;
            }

            // Save the updated user
            try {
                const updatedUser = await user.save();
                
                // Return user details without password
                const userResponse = {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    image: updatedUser.image,
                    location: updatedUser.location
                };

                res.json(userResponse);
            } catch (saveError) {
                res.status(500).json({ message: 'Error updating user', error: saveError.message });
            }
        });
    } catch (error) {
        console.error('Error in user edit:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;