const Event = require('../Models/Event');

// Display all events (for both users and admins)
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.render('index', { events });
    } catch (err) {
        res.status(500).send('Error fetching events');
    }
};

// Logic to create a new event
exports.createEvent = async (req, res) => {
    try {
        const { Title, Description, Date, Venue, Category, Capacity, Price } = req.body;
        
        const newEvent = new Event({
            Title,
            Description,
            Date,
            Venue,
            Category,
            Capacity,
            Price
        });

        await newEvent.save();
        res.redirect('/admin/events');
    } catch (err) {
        res.status(500).send('Error creating event');
    }
};

// Get all events for the admin management table
exports.getAdminEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.render('Admin/events', { events });
    } catch (err) {
        res.status(500).send('Error loading admin dashboard');
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/admin/events');
    } catch (err) {
        res.status(500).send('Error deleting event');
    }
};

// Update an event
exports.updateEvent = async (req, res) => {
    try {
        const { Title, Description, Date, Venue, Category, Capacity, Price } = req.body;
        await Event.findByIdAndUpdate(req.params.id, {
            Title,
            Description,
            Date,
            Venue,
            Category,
            Capacity,
            Price
        });
        res.redirect('/admin/events');
    } catch (err) {
        res.status(500).send('Error updating event');
    }
};