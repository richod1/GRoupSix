const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Encrypt the password
  const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();

  try {
    // Create a new user
    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
    });

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username' });
    }

    // Decrypt the stored password
    const decryptedBytes = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // Compare passwords
    if (password !== decryptedPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate an access token
    const accessToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SEC);

    res.status(200).json({ message: 'Login successful', accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
