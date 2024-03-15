const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the authentication middleware
const Expense = require('../models/Expense'); // Make sure this path matches your file structure

// Post a new expense - Protected by auth
router.post('/', auth, async (req, res) => {
    const expense = new Expense({
        ...req.body,
        user: req.user.id // Associate the expense with the authenticated user
    });
    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all expenses - Protected by auth
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }); // Fetch expenses for the authenticated user
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get an expense by ID and verify ownership
async function getExpense(req, res, next) {
    let expense;
    try {
        expense = await Expense.findOne({ _id: req.params.id, user: req.user.id }); // Ensure the expense belongs to the authenticated user
        if (expense == null) {
            return res.status(404).json({ message: 'Cannot find expense' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.expense = expense;
    next();
}

// Protected routes with getExpense middleware ensuring the expense belongs to the user
router.get('/:id', auth, getExpense, (req, res) => {
    res.json(res.expense);
});

router.patch('/:id', auth, getExpense, async (req, res) => {
    // Update fields here. For example:
    if (req.body.amount != null) {
        res.expense.amount = req.body.amount;
    }
    // Add other fields as necessary

    try {
        const updatedExpense = await res.expense.save();
        res.json(updatedExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, getExpense, async (req, res) => {
    try {
        await res.expense.remove();
        res.json({ message: 'Deleted Expense' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
