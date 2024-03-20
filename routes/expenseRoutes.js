const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the authentication middleware
const Expense = require('../models/Expense'); // Make sure this path matches your file structure
const Project = require('../models/Project');

// Post a new expense - Protected by auth
router.post('/', auth, async (req, res) => {
    const expense = new Expense({
        ...req.body,
        user: req.user.id // Associate the expense with the authenticated user
    });
    try {
        const newExpense = await expense.save();
        // Update the associated project
        await Project.findByIdAndUpdate(req.body.project, {
            $push: { expenses: newExpense._id } // Assuming 'project' in req.body is the project's ID
        });
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
    // Assume getExpense middleware retrieves the expense document and attaches it to res.expense

    Object.keys(req.body).forEach(key => {
        // Check if the key exists in req.body and is not null
        if (req.body[key] != null) {
            res.expense[key] = req.body[key];
        }
    });

    try {
        // Attempt to save the updated expense document
        const updatedExpense = await res.expense.save();
        // Respond with the updated expense data
        res.json(updatedExpense);
    } catch (err) {
        // Handle potential errors, such as validation errors
        res.status(400).json({ message: err.message });
    }
});



router.delete('/:id', auth, async (req, res) => {
    try {
        // Directly delete the expense document and capture the result
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Assuming your Project model has an array of expense IDs
        // Find the project associated with the deleted expense and remove the expense ID from its array
        // Here, deletedExpense._id refers to the ID of the expense that was just deleted
        await Project.updateMany(
            { expenses: deletedExpense._id }, // Match projects with this expense ID
            { $pull: { expenses: deletedExpense._id } } // Remove the expense ID from the projects' expenses array
        );

        res.json({ message: 'Deleted Expense and removed from its associated project' });
    } catch (err) {
        console.error("Error deleting expense:", err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
