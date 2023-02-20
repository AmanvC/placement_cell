const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview-controller');
const passport = require('passport');

router.get('/:id', passport.checkAuthentication, interviewController.modifyInterview);
router.post('/update', passport.checkAuthentication,interviewController.update);
router.post('/update-registered', passport.checkAuthentication, interviewController.updateRegistered);

module.exports = router;