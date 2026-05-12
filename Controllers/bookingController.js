const Ticket = require('../Models/Ticket');
const Event = require('../Models/Event');

// User Dashboard: Fetch their specific booking history
exports.getUserDashboard = async (req, res) => {
    try {
        const bookings = await Ticket.find({ user: req.session.userId }).populate('event');
        res.render('dashboard', { bookings });
    } catch (err) {
        res.status(500).send('Error loading dashboard');
    }
};

// Admin Dashboard: Aggregate analytics for the business
exports.getAdminAnalytics = async (req, res) => {
    try {
        const totalBookings = await Ticket.countDocuments();
        const events = await Event.find().sort({ SoldTickets: -1 }); // Popular events first
        
        // Calculate total revenue and capacity usage
        const totalRevenue = events.reduce((acc, curr) => acc + (curr.SoldTickets * curr.Price), 0);

        res.render('Admin/analytics', { 
            totalBookings, 
            events, 
            totalRevenue 
        });
    } catch (err) {
        res.status(500).send('Error loading analytics');
    }
};

// The Booking Logic with Capacity Validation
exports.bookTicket = async (req, res) => {
    try {
        const { eventId, quantity } = req.body;
        const numQuantity = parseInt(quantity);

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send('Event not found');

        // Mandatory Capacity Check
        const remainingSpace = event.Capacity - event.SoldTickets;
        if (numQuantity > remainingSpace) {
            return res.status(400).send('Not enough tickets available');
        }

        // Create the ticket record
        const ticket = new Ticket({
            user: req.session.userId,
            event: eventId,
            quantity: numQuantity
        });

        await ticket.save();

        // Update the event's sold count
        event.SoldTickets += numQuantity;
        await event.save();

        res.redirect('/bookings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Booking failed');
    }
};