const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String, 
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Placed", "Not Placed"],
        default: "Not Placed"
    },
    scores: {
        dsa: {
            type: Number,
            required: true
        },
        webd: {
            type: Number,
            required: true
        },
        react: {
            type: Number,
            required: true
        }
    }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;