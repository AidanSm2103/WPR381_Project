const express = require('express');
const router = express.Router();
const enquiryController = require('../Controllers/enquiryController');
const eventController = require('../Controllers/eventController');
const bookingController = require('../Controllers/bookingController');
const { ensureAuthenticated, ensureAdmin } = require('../Middleware/authMiddleware');


router.use(ensureAuthenticated, ensureAdmin);
router.get('/create-event', (req, res) => res.render('Admin/create-event'));
router.post('/create-event', eventController.createEvent);
router.get('/manage-events', eventController.getAdminEvents);
router.get('/edit-event/:id', eventController.getEditEventPage);
router.post('/edit-event/:id', eventController.updateEvent);
router.post('/delete-event/:id', eventController.deleteEvent);
router.get('/enquiries', enquiryController.getAdminEnquiries);
router.post('/enquiries/resolve/:id', enquiryController.resolveEnquiry);
router.get('/analytics', bookingController.getAdminAnalytics);

module.exports = router;