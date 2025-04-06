const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Route
router.post('/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body); // Log the incoming request

    const { username, gmail, password, role, adminKey } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ gmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check for admin key if role is admin
    if (role === 'admin') {
      console.log('Admin registration requested'); // Log for debugging

      if (adminKey !== 'admin@2024') {
        console.log('Invalid admin key'); // Log if admin key is incorrect
        return res.status(400).json({ message: 'Invalid admin key' });
      } else {
        console.log('Admin key validated'); // Log if admin key is valid
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      gmail,
      password: hashedPassword,
      role
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error('Error registering user:', error);  // Log any errors
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { gmail, password } = req.body;

    const user = await User.findOne({ gmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
