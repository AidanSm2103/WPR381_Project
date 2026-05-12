const express = require('express');
const router = express.Router();

// Import the event controller
const eventController = require('../Controllers/eventController');

// Route to display all events on the home page
router.get('/', eventController.getAllEvents);

module.exports = router;