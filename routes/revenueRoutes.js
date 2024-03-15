const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the authentication middleware
const Revenue = require('../models/Revenue'); // Make sure this path matches your file structure

// Post a new revenue - Protected by auth
router.post('/', auth, async (req, res) => {
    const revenue = new Revenue({
        ...req.body,
        user: req.user.id // Associate the revenue with the authenticated user
    });
    try {
        const newRevenue = await revenue.save();
        res.status(201).json(newRevenue);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all revenues - Protected by auth
router.get('/', auth, async (req, res) => {
    try {
        // Fetch revenues for the authenticated user
        const revenues = await Revenue.find({ user: req.user.id });
        res.json(revenues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get a revenue by ID and verify ownership
async function getRevenue(req, res, next) {
    let revenue;
    try {
        // Ensure the revenue belongs to the authenticated user
        revenue = await Revenue.findOne({ _id: req.params.id, user: req.user.id });
        if (revenue == null) {
            return res.status(404).json({ message: 'Cannot find revenue' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.revenue = revenue;
    next();
}

// Protected routes with getRevenue middleware ensuring the revenue belongs to the user
router.get('/:id', auth, getRevenue, (req, res) => {
    res.json(res.revenue);
});

router.patch('/:id', auth, getRevenue, async (req, res) => {
    if (req.body.amount != null) {
        res.revenue.amount = req.body.amount;
    }
    // Add other fields as necessary
    try {
        const updatedRevenue = await res.revenue.save();
        res.json(updatedRevenue);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, getRevenue, async (req, res) => {
    try {
        await res.revenue.remove();
        res.json({ message: 'Deleted Revenue' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
