const Enquiry = require('../Models/Enquiry');

exports.getContactPage = (req, res) => {
    res.render('contact', { success: null, error: null });
};


exports.submitEnquiry = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newEnquiry = new Enquiry({
            name,
            email,
            subject,
            message
        });

        await newEnquiry.save();

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
        await Enquiry.findByIdAndUpdate(req.params.id, { status: 'Resolved' });

        res.redirect('/admin/enquiries');
    } catch (err) {
        console.error("Resolution Error:", err);
        res.status(500).send('Error updating enquiry status.');
    }
};