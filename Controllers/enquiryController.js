const Enquiry = require('../Models/Enquiry');

// Save a new enquiry from the contact form
exports.submitEnquiry = async (req, res) => {
    try {
        const { Name, Email, Message } = req.body;
        
        const newEnquiry = new Enquiry({
            Name,
            Email,
            Message
        });

        await newEnquiry.save();
        // Redirect back to contact with a success state or just the page
        res.redirect('/contact');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to send enquiry.');
    }
};

// Admin view to see all enquiries
exports.getAdminEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.render('Admin/enquiries', { enquiries });
    } catch (err) {
        res.status(500).send('Error loading enquiries.');
    }
};

// Mark an enquiry as resolved
exports.resolveEnquiry = async (req, res) => {
    try {
        await Enquiry.findByIdAndUpdate(req.params.id, { Status: 'Resolved' });
        res.redirect('/admin/enquiries');
    } catch (err) {
        res.status(500).send('Error updating enquiry.');
    }
};