const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/placement_cell');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error in database connection!!!'));

db.once('open', () => {
    console.log('Connection to database is succesfull.');
});

module.exports = db;