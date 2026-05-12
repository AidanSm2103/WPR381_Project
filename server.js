require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');

// Import routers (Ensure these files exist in your Routes folder)
const authRoutes = require('./Routes/authRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const enquiryRoutes = require('./Routes/enquiryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Security and Request Parsing ---
app.use(helmet()); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // CRITICAL for parsing form data

// Serve static assets from the Public folder
app.use(express.static(path.join(__dirname, 'Public')));

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

// --- Session Management ---
app.use(session({
    secret: process.env.SESSION_SECRET || 'wpr381_fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24-hour session
    }
}));

// --- GLOBAL VIEW VARIABLES (The Missing Link) ---
// This makes the logged-in user's data available to every single EJS file
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// --- Database Connection ---
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventPlatform';
mongoose.connect(dbURI)
    .then(() => console.log('✅ MongoDB connected successfully.'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// Database monitoring
mongoose.connection.on('error', err => console.log('⚠️ MongoDB error:', err));
mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));

// --- Route Handlers ---

// Mount routers
app.use('/', authRoutes);
app.use('/', eventRoutes); 
app.use('/', bookingRoutes);
app.use('/', enquiryRoutes);

// Temporary Home Route (Until eventRoutes is fully set up)
app.get('/', (req, res) => {
    res.render('index', { events: [] }); 
});

// General Page Renders
app.get('/event-details', (req, res) => res.render('event-details'));

// --- Error Handling ---

// 404 Catch-all
app.use((req, res) => {
    res.status(404).render('index', { error: '404 - Page not found' });
});

// Global internal server error handler
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);
    
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message;

    res.status(err.status || 500).send(message);
});

// --- Server Initialization ---
app.listen(PORT, () => {
    console.log(`🚀 Server is humming at http://localhost:${PORT}`);
});