const User = require('../Models/User'); // Double-check exact spelling of folder and file!
const bcrypt = require('bcrypt');

// Handle user registration
exports.registerUser = async (req, res) => {
    try {
        // FIX: Ensure 'Role' is capitalized to match the Mongoose Schema
        const { FName, SName, Email, Password, Role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).send('Email already registered.');
        }

        // FIX: Use bcrypt.hash(), not bcrypt.bcrypt()
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = new User({
            FName,
            SName,
            Email,
            Password: hashedPassword,
            Role: Role || 'User' // FIX: Capital 'R'
        });

        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during registration.');
    }
};

// Handle user login
exports.loginUser = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        // Compare provided password with hashed version in DB 
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password.');
        }

        // Initialize session with user data
        req.session.userId = user._id;
        
        // FIX: Added the user object so your EJS Navbar knows if it's an Admin or User
        req.session.user = { id: user._id, name: user.FName, Role: user.Role };

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during login.');
    }
};

// Handle logout
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Could not log out.');
        res.redirect('/');
    });
};