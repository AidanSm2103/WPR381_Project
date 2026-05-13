exports.ensureAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

exports.ensureAdmin = (req, res, next) => {
    // Standardized to lowercase 'role' to match your Schema
    if (req.session.user && req.session.user.role === 'Admin') {
        return next();
    }
    
    // If not an admin, show the homepage with an error
    res.status(403).render('index', { 
        error: 'Access Denied: Administrators only.',
        events: [] 
    });
};