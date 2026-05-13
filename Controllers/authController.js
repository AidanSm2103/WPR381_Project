const User = require('../Models/User');
const Ticket = require('../Models/Ticket'); 
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const { FName, SName, Email, Password, Role } = req.body;

        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).render('register', { error: 'Email already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = new User({
            FName,
            SName,
            Email,
            Password: hashedPassword,
            Role: Role || 'User'
        });

        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).render('register', { error: 'Error during registration. Please try again.' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await User.findOne({ Email });

        if (user && await bcrypt.compare(Password, user.Password)) {
            req.session.userId = user._id;
            
            req.session.user = { 
                id: user._id, 
                name: user.FName, 
                email: user.Email,
                role: user.role || user.Role || 'User' 
            };

            res.redirect('/dashboard');
        } else {
            res.render('login', { error: 'Invalid email or password.' });
        }
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'An error occurred during login.' });
    }
};

exports.getDashboard = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        const recentBookings = await Ticket.find({ UserID: req.session.userId })
            .populate('EventID')
            .sort({ createdAt: -1 });

        res.render('dashboard', { 
            user: req.session.user,
            recentBookings 
        });
    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).render('dashboard', { 
            user: req.session.user, 
            recentBookings: [], 
            error: 'Error loading dashboard activity.' 
        });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Could not log out.');
        res.redirect('/');
    });
};