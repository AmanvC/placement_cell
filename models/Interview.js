const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    date_of_visit: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;