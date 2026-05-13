const Event = require('../Models/Event');
const Ticket = require('../Models/Ticket');

// 1. Render the Create Event Form
exports.getCreateEventPage = (req, res) => {
    res.render('Admin/create-event');
};

// 2. Handle Form Submission to Database
exports.createEvent = async (req, res) => {
    try {
        const { Title, Description, Date, Venue, Price, Capacity, Category, ImageURL } = req.body;
        
        const newEvent = new Event({
            Title, Description, Date, Venue, Price, Capacity, Category, ImageURL
        });

        await newEvent.save();
        res.redirect('/admin/manage-events');
    } catch (err) {
        console.error(err);
        res.render('Admin/create-event', { error: 'Failed to create event. Please check your inputs.' });
    }
};

// 3. Render the Management Table (events.ejs)
exports.getManageEventsPage = async (req, res) => {
    try {
        const events = await Event.find().sort({ Date: 1 });

        res.render('Admin/events', { events }); 
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
};

// 4. Delete an Event
exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/admin/manage-events');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/manage-events');
    }
};

// 5. Render the Edit Event Page
exports.getEditEventPage = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.redirect('/admin/manage-events');
        
        res.render('Admin/edit-event', { event });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/manage-events');
    }
};

// 6. Save the Edited Event
exports.updateEvent = async (req, res) => {
    try {
        const { Title, Description, Date, Venue, Price, Capacity, Category, ImageURL } = req.body;
        
        await Event.findByIdAndUpdate(req.params.id, {
            Title, Description, Date, Venue, Price, Capacity, Category, ImageURL
        });
        
        res.redirect('/admin/manage-events');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/manage-events');
    }
};

// 7. Calculate and Render Analytics
exports.getAnalyticsPage = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        
        let totalRevenue = 0;
        let ticketsSold = 0;
        
        tickets.forEach(ticket => {
            totalRevenue += ticket.TotalPrice;
            ticketsSold += ticket.Quantity;
        });

        const activeEvents = await Event.countDocuments();

        res.render('Admin/analytics', {
            totalRevenue,
            ticketsSold,
            activeEvents
        });
    } catch (err) {
        console.error("Analytics Error:", err);
        res.render('Admin/analytics', { 
            totalRevenue: 0, ticketsSold: 0, activeEvents: 0, 
            error: 'Failed to calculate analytics.' 
        });
    }
};