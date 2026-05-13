const Event = require('../Models/Event');
const Ticket = require('../Models/Ticket'); // Needed for data integrity cleanup

// 1. PUBLIC: Homepage - Shows all upcoming events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ Date: 1 });
        res.render('index', { events, error: null });
    } catch (err) {
        res.render('index', { events: [], error: 'Error loading events' });
    }
};

// 2. PUBLIC: Details - Shows specific event info and booking form
exports.getEventDetails = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.redirect('/');

        res.render('event-details', { 
            event, 
            error: null 
        }); 
    } catch (err) {
        console.error("Details Fetch Error:", err);
        res.redirect('/');
    }
};

// 3. ADMIN: Table View - Displays management dashboard
exports.getAdminEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        // Standardized to 'Admin/manage-events' to match your route names
        res.render('Admin/manage-events', { events }); 
    } catch (err) {
        res.redirect('/dashboard');
    }
};

// 4. ADMIN: Create - Persists new event to MongoDB
exports.createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.redirect('/admin/manage-events');
    } catch (err) {
        res.render('Admin/create-event', { error: 'Could not create event' });
    }
};

// 5. ADMIN: Edit Page - Fetches existing data for the update form
exports.getEditEventPage = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.render('Admin/edit-event', { event });
    } catch (err) {
        res.redirect('/admin/manage-events');
    }
};

// 6. ADMIN: Update - Persists modifications to an existing event
exports.updateEvent = async (req, res) => {
    try {
        await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect('/admin/manage-events');
    } catch (err) {
        console.error("Update Error:", err);
        res.redirect('/admin/manage-events');
    }
};

// 7. ADMIN: Delete - Removes event and associated tickets (Requirement 35)
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Cleanup: Remove all tickets associated with this event to maintain data integrity
        await Ticket.deleteMany({ EventID: eventId });

        // Removal: Delete the event document from MongoDB
        await Event.findByIdAndDelete(eventId);

        res.redirect('/admin/manage-events');
    } catch (err) {
        console.error("Delete Error:", err);
        res.redirect('/admin/manage-events');
    }
};