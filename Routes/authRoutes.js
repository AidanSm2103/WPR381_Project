const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// --- PUBLIC ROUTES (No security middleware allowed here!) ---

// Render the pages
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// Handle the form submissions
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);


// --- PROTECTED ROUTES ---
router.get('/dashboard', authController.getDashboard);
router.get('/logout', authController.logoutUser);

module.exports = router;