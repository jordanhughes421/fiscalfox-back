const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the authentication middleware
const Revenue = require('../models/Revenue'); // Make sure this path matches your file structure
const Project = require('../models/Project');

// Post a new revenue - Protected by auth
router.post('/', auth, async (req, res) => {
    const revenue = new Revenue({
        ...req.body,
        user: req.user.id // Associate the revenue with the authenticated user
    });
    try {
        const newRevenue = await revenue.save();
        // Update the associated project
        await Project.findByIdAndUpdate(req.body.project, {
            $push: { revenues: newRevenue._id } // Assuming 'project' in req.body is the project's ID
        });
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
    // Retrieve the revenue document from the response (assumed to be added by the getRevenue middleware)
    const revenue = res.revenue;

    // Iterate over the keys in the request body
    Object.keys(req.body).forEach(key => {
        // Update the revenue document if the key exists in req.body and is not null
        if (req.body[key] != null) {
            revenue[key] = req.body[key];
        }
    });

    try {
        // Attempt to save the updated revenue document
        const updatedRevenue = await revenue.save();
        // Respond with the updated revenue data
        res.json(updatedRevenue);
    } catch (err) {
        // Handle potential errors, such as validation errors
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        // Directly delete the revenue document and capture the result
        const deletedRevenue = await Revenue.findByIdAndDelete(req.params.id);

        if (!deletedRevenue) {
            return res.status(404).json({ message: 'Revenue not found' });
        }

        // Assuming your Project model has an array of revenue IDs
        // Find the project associated with the deleted revenue and remove the revenue ID from its array
        // Here, deletedRevenue._id refers to the ID of the revenue that was just deleted
        await Project.updateMany(
            { revenues: deletedRevenue._id }, // Match projects with this revenue ID
            { $pull: { revenues: deletedRevenue._id } } // Remove the revenue ID from the projects' revenues array
        );

        res.json({ message: 'Deleted Revenue and removed from its associated project' });
    } catch (err) {
        console.error("Error deleting revenue:", err);
        res.status(500).json({ message: err.message });
    }
});6

module.exports = router;
