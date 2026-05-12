const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Message: { type: String, required: true },
    Status: { 
        type: String, 
        enum: ['Pending', 'Resolved'], 
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', EnquirySchema);