const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/event-details/:id', eventController.getEventDetails);

module.exports = router;