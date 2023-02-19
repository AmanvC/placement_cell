const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/employee/login');
})
router.use('/employee', require('./employee'));

module.exports = router;