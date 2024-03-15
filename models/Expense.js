// models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: function() { return this.unitPrice == null; } }, // Required if unitPrice is not provided
    category: { type: String, required: true },
    date: { type: Date, required: true },
    quantity: { type: Number, default: 0 }, // Quantity of the unit, e.g., number of nails, miles driven
    unit: { type: String }, // Unit of measurement, e.g., pieces, miles
    unitPrice: { type: Number }, // Price per unit, to calculate the total amount if not provided directly
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' }, // Reference to an Asset model
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Reference to an Employee model
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  }, { timestamps: true });

// Virtual for calculating total expense based on quantity and unitPrice
// Only use if amount is not directly provided
expenseSchema.virtual('totalExpense').get(function () {
  if (this.amount) return this.amount; // If amount is provided, use it directly
  return this.quantity * this.unitPrice; // Otherwise, calculate it
});

module.exports = mongoose.model('Expense', expenseSchema);
