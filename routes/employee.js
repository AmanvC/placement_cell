const express = require('express');
const router = express.Router();
const passport = require('passport');

const employeesController = require('../controllers/employees-controller');

router.get('/login', employeesController.login);
router.get('/signup', employeesController.signup);
router.post('/signup/create', employeesController.createEmployee);
router.post('/login/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/employee/login'}
), employeesController.createSession);
router.get('/logout', employeesController.destroySession);

router.use('/dashboard', require('./dashboard'));

module.exports = router;