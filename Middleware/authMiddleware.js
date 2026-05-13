exports.ensureAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

exports.ensureAdmin = (req, res, next) => {

    if (req.session.user && req.session.user.role === 'Admin') {
        return next();
    }
    
    res.status(403).render('index', { 
        error: 'Access Denied: Administrators only.',
        events: [] 
    });
};