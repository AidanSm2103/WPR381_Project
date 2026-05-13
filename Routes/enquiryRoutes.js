const express = require('express');
const router = express.Router();
const enquiryController = require('../Controllers/enquiryController');
const { ensureAuthenticated, ensureAdmin } = require('../Middleware/authMiddleware');

// --- PUBLIC ROUTES ---
router.get('/contact', enquiryController.getContactPage);
router.post('/contact', enquiryController.submitEnquiry);

// --- ADMIN ROUTES ---
router.get('/admin/enquiries', ensureAuthenticated, ensureAdmin, enquiryController.getAdminEnquiries);

module.exports = router;