require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');

const Event = require('./DB Models/event');
const User = require('./DB Models/user');
const Ticket = require('./DB Models/tickets');
const Enquiry = require('./DB Models/enquiry');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic security and CORS
app.use(helmet());
app.use(cors());

// Body parsers so req.body doesn't come back undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session handling for auth later
app.use(session({
    secret: process.env.SESSION_SECRET || 'wpr381_fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// DB connection
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventPlatform';
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('DB Connection Error:', err));

// Log DB drops just in case
mongoose.connection.on('error', err => console.log('MongoDB error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

// --- Routes ---
// TODO: Break these out into separate router files in the /routes folder

app.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.render('index', {
            events
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.get('/event/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.render('event-details', {
            event
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            Email: req.body.Email
        });
        if (!user) {
            return res.send('User not found');
        }
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.status(500).send('Login Error');
    }
});

app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
    try {
        await User.create(req.body);
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.status(500).send('Registration Error');
    }
});

app.get('/admin', (req, res) => res.render('admin'));
app.get('/dashboard', (req, res) => res.render('dashboard'));

app.get('/contact', (req, res) => res.render('contact'));
app.post('/contact', async (req, res) => {
    try {
        await Enquiry.create(req.body);
        res.redirect('/contact');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});


// 404 Catch-all
app.use((req, res) => {
    res.status(404).send('404 - Page not found');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const message = process.env.NODE_ENV === 'production' ? 'Server Error' : err.message;
    res.status(500).send(message);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});