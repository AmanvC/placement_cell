const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard-controller');
const passport = require('passport');

router.get('/', passport.checkAuthentication, dashboardController.dashboard)
router.post('/create-student', passport.checkAuthentication, dashboardController.createStudent);
router.post('/create-interview', passport.checkAuthentication, dashboardController.createInterview);
router.get('/download-report', passport.checkAuthentication, dashboardController.downloadReport)

router.use('/interview', require('./interview'));

module.exports = router;