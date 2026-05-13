const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String }, 
    Date: { type: Date, required: true },
    Venue: { type: String, required: true },
    Category: { type: String },
    Capacity: { type: Number, required: true },
    SoldTickets: { type: Number, default: 0 },
    Price: { type: Number, required: true },
    ImageURL: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);