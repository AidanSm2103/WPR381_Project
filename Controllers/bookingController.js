const Ticket = require('../Models/Ticket');
const Event = require('../Models/Event');

exports.bookTicket = async (req, res) => {
    try {
        const { eventID, Quantity } = req.body;
        const requestedQty = parseInt(Quantity);

        const event = await Event.findById(eventID);
        if (!event) return res.status(404).send('Event not found');

        const currentSold = event.SoldTickets || 0;
        const available = event.Capacity - currentSold;

        if (requestedQty > available) {
            return res.render('event-details', { 
                event, 
                error: `Booking failed. Only ${available} tickets remaining.` 
            });
        }

        const newTicket = new Ticket({
            UserID: req.session.user.id,
            EventID: eventID,
            Quantity: requestedQty,
            TotalPrice: requestedQty * event.Price,
            Status: 'Confirmed'
        });
        await newTicket.save();

        event.SoldTickets = currentSold + requestedQty;
        await event.save();

        res.redirect('/dashboard'); 
    } catch (err) {
        console.error("Booking Error:", err);
        res.redirect('/');
    }
};

exports.getUserDashboard = async (req, res) => {
    try {
        const history = await Ticket.find({ UserID: req.session.user.id })
            .populate('EventID')
            .sort({ createdAt: -1 }); // <-- MAKE SURE THERE IS NO .limit(3) HERE

        res.render('dashboard', { 
            user: req.session.user, 
            recentBookings: history 
        });
    } catch (err) {
        res.render('dashboard', { user: req.session.user, recentBookings: [] });
    }
};

//Analytics aggregation and variable naming
exports.getAdminAnalytics = async (req, res) => {
    try {
        // Fetch all events sorted by popularity
        const events = await Event.find().sort({ SoldTickets: -1 });

        // 1. Calculate Active Events
        const activeEventsCount = events.length;

        // 2. Sum the actual tickets sold across all events
        // This calculates the true volume rather than the number of checkout transactions
        const ticketsSoldTotal = events.reduce((acc, curr) => {
            return acc + (curr.SoldTickets || 0);
        }, 0);

        // 3. Calculate Total Revenue
        const totalRevenue = events.reduce((acc, curr) => {
            return acc + ((curr.SoldTickets || 0) * curr.Price);
        }, 0);
        
        // 4. Render using the exact names expected by the .ejs file
        res.render('Admin/analytics', { 
            ticketsSold: ticketsSoldTotal, 
            activeEvents: activeEventsCount, 
            totalRevenue: totalRevenue,
            events: events 
        });
    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).send('Error loading business analytics');
    }
};