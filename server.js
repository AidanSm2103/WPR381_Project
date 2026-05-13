require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');

// 1. Import Routers
const authRoutes = require('./Routes/authRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const enquiryRoutes = require('./Routes/enquiryRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const bookingRoutes = require('./Routes/bookingRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middleware Stack
app.use(helmet({ contentSecurityPolicy: false })); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'Public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

// 3. Session Management (Role-Based Access Control)
app.use(session({
    secret: process.env.SESSION_SECRET || 'wpr381_fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

// 4. Global View Variables & Safety Nets
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    // Set default values for common EJS variables to prevent ReferenceErrors
    res.locals.error = null;
    res.locals.success = null;
    next();
});

// 5. Database Connection
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/EventPlatform';
mongoose.connect(dbURI).then(() => console.log('✅ MongoDB connected.'));

// --- 6. Route Handlers (Ordered by Specificity) ---

app.get('/favicon.ico', (req, res) => res.status(204).end());

// A. Specific Static Routes (High Priority)
// Moving enquiryRoutes to the top ensures /contact is caught before any dynamic IDs
app.use('/', enquiryRoutes);   
app.use('/', authRoutes);      

// B. Feature-Specific Routes
app.use('/', bookingRoutes);   

// C. Prefixed Admin Routes

app.use('/admin', adminRoutes); 

// D. Dynamic/Greedy Routes (Lowest Priority)
app.use('/', eventRoutes);     

// 7. 404 Final Catch-All
app.use((req, res) => {
    res.status(404).render('index', { 
        error: '404 - Page not found', 
        events: [] 
    });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));