const mongoose = require('mongoose');

const timeSheetSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // or Employee if you have a separate model
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false // Make required as true if applicable
    },
    date: {
        type: Date,
        required: true
    },
    hoursWorked: {
        type: Number,
        required: true
    },
    breakDuration: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('TimeSheet', timeSheetSchema);