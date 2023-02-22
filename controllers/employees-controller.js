const Employee = require('../models/Employee');

// Render login page
module.exports.login = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/employee/dashboard');
    }
    return res.render('login');
}

// Render signup page
module.exports.signup = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/employee/dashboard');
    }
    return res.render('signup');
}

// Create an employee
module.exports.createEmployee = async function(req, res){
    // Find employee with the request email
    const emp = await Employee.findOne({email: req.body.email});
    // If employee already exist, redirect back
    if(emp){
        req.flash('error', 'User already exist!');
        console.log('User is already registered!');
        return res.redirect('back');
    }
    // If employee does not have work email, redirect back
    const domain = req.body.email.split('@')[1];
    if(domain.toLowerCase() !== "aurora.com"){
        req.flash('error', 'You are not authorized to signup!');
        console.log('User not authorized to signup!');
        return res.redirect('back');
    }

    // Create an employee with request.body
    Employee.create(req.body, function(err){
        if(err){
            console.log(`Error occured in creating an employee: ${err}`);
            return res.redirect('back');
        }
        req.flash('success', 'Account created successfully, Login to continue.')
        return res.redirect('/employee/login');
    })
}

// Redirect a successful login to dashboard
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in successfully!');
    return res.redirect('/employee/dashboard');
}


//logout the employee
module.exports.destroySession = function(req, res){
    req.logout(function(err){
        if(err){
            console.log(`Error is logging out: ${err}`);
            return res.redirect('back');
        }
    });
    req.flash('success', 'You have been logged out!');
    res.redirect('/employee/login');
}