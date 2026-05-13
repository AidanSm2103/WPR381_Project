const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const { ensureAuthenticated, ensureAdmin } = require('../Middleware/authMiddleware');

// --- USER PORTAL ROUTES ---
router.get('/dashboard', ensureAuthenticated, bookingController.getUserDashboard);

// Fulfills Requirement: Secure ticket booking with validation 
router.post('/book-ticket', ensureAuthenticated, bookingController.bookTicket);

// --- ADMIN PORTAL ROUTES ---
router.get('/analytics', ensureAuthenticated, ensureAdmin, bookingController.getAdminAnalytics);

module.exports = router;