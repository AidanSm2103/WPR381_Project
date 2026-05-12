const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// GET routes to render the EJS pages
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// POST routes for form submissions 
// FIX: Updated to match the exact export names from authController.js
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;