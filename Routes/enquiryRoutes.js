const express = require('express');
const router = express.Router();
const enquiryController = require('../Controllers/enquiryController');
const { ensureAuthenticated, ensureAdmin } = require('../Middleware/authMiddleware');

// Public route to submit the form
router.post('/contact', enquiryController.submitEnquiry);

// Admin routes for management
router.get('/admin/enquiries', ensureAuthenticated, ensureAdmin, enquiryController.getAdminEnquiries);
router.post('/admin/enquiries/resolve/:id', ensureAuthenticated, ensureAdmin, enquiryController.resolveEnquiry);

module.exports = router;