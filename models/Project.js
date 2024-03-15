// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
    revenues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Revenue' }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
