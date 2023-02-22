const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Employee = require('../models/Employee');

passport.use(new LocalStrategy(
    {usernameField: 'email', passReqToCallback: true},
    function(req, email, password, done){
        Employee.findOne({email: email}, function(err, employee){
            if(err){
                console.log(`Error in searching for the user in db: ${err}`);
                req.flash('error', 'Something went wrong!');
                return done(err);
            }
            if(!employee || employee.password !== password){
                console.log('Invalid credentials');
                req.flash('error', 'Invalid email/password!');
                return done(null, false);
            }
            return done(null, employee);
        })
    }
));

passport.serializeUser(function(employee, done){
    done(null, employee.id);
});

passport.deserializeUser(function(id, done){
    Employee.findById(id, function(err, employee){
        if(err){
            console.log(`Error in searching for the user with the particular id: ${err}`);
            return done(err);
        }
        return done(null, employee);
    })
});

passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/employee/login');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;