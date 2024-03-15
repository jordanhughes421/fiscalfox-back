// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    position: { type: String },
    hourlyRate: { type: Number }, // Assuming payment is based on hourly work
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
