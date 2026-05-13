const Enquiry = require('../Models/Enquiry');

// Render the public contact form
exports.getContactPage = (req, res) => {
    res.render('contact', { success: null, error: null });
};

// Handle form submission and store in database
exports.submitEnquiry = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newEnquiry = new Enquiry({
            name,
            email,
            subject,
            message
        });

        await newEnquiry.save(); // Store enquiry in database [cite: 71]

        res.render('contact', { 
            success: 'Thank you! Your enquiry has been submitted successfully.', 
            error: null 
        });
    } catch (err) {
        res.render('contact', { 
            success: null, 
            error: 'Failed to submit enquiry. Please try again.' 
        });
    }
};

// Admin logic to view all enquiries 
exports.getAdminEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.render('Admin/enquiries', { enquiries });
    } catch (err) {
        res.status(500).send('Error retrieving enquiries.');
    }
};

exports.resolveEnquiry = async (req, res) => {
    try {
        // Use Mongoose to find the specific enquiry by ID and update its status
        await Enquiry.findByIdAndUpdate(req.params.id, { status: 'Resolved' });
        
        // CRITICAL: Redirect back to the full admin path to refresh the view
        res.redirect('/admin/enquiries');
    } catch (err) {
        console.error("Resolution Error:", err);
        res.status(500).send('Error updating enquiry status.');
    }
};