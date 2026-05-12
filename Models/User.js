const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    FName: { type: String, required: true },
    SName: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['User', 'Admin'], 
        default: 'User' 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);