// Middleware to ensure the user is logged in
exports.ensureAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    // Redirect to login if no session is found
    res.redirect('/login');
};

// Middleware to ensure the user has an Admin role
exports.ensureAdmin = (req, res, next) => {
    if (req.session.role === 'Admin') {
        return next();
    }
    // Unauthorized access attempt
    res.status(403).send('Access Denied: Administrators only.');
};