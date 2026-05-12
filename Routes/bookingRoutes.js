const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const { ensureAuthenticated, ensureAdmin } = require('../Middleware/authMiddleware');

// User routes
router.get('/dashboard', ensureAuthenticated, bookingController.getUserDashboard);
router.post('/book-ticket', ensureAuthenticated, bookingController.bookTicket);
router.get('/bookings', ensureAuthenticated, bookingController.getUserDashboard);

// Admin analytics route
router.get('/admin/analytics', ensureAuthenticated, ensureAdmin, bookingController.getAdminAnalytics);

module.exports = router;