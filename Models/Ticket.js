const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    UserID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    EventID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true 
    },
    Quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    TotalPrice: { 
        type: Number, 
        required: true 
    },
    Status: { 
        type: String, 
        enum: ['Confirmed', 'Pending', 'Cancelled'], 
        default: 'Confirmed' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);