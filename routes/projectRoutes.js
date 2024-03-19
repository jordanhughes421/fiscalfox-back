const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the authentication middleware
const Project = require('../models/Project'); // Assuming you have this model set up
const Expense = require('../models/Expense');
const Revenue = require('../models/Revenue');

// Post a new project - Protected by auth
router.post('/', auth, async (req, res) => {
    const project = new Project({
        ...req.body,
        user: req.user.id // Associate the project with the authenticated user
    });
    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all projects - Protected by auth
router.get('/', auth, async (req, res) => {
    try {
        // Fetch projects for the authenticated user
        const projects = await Project.find({ user: req.user.id });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get a project by ID and verify ownership
async function getProject(req, res, next) {
    let project;
    try {
        // Ensure the project belongs to the authenticated user
        project = await Project.findOne({ _id: req.params.id, user: req.user.id });
        if (project == null) {
            return res.status(404).json({ message: 'Cannot find project' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.project = project;
    next();
}

// Protected routes with getProject middleware ensuring the project belongs to the user
router.get('/:id', auth, getProject, (req, res) => {
    res.json(res.project);
});

router.patch('/:id', auth, getProject, async (req, res) => {
    if (req.body.name != null) {
        res.project.name = req.body.name;
    }
    // Add other fields as necessary
    try {
        const updatedProject = await res.project.save();
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const projectId = req.params.id;

        // Delete all expenses associated with the project
        await Expense.deleteMany({ project: projectId });

        // Delete all revenues associated with the project
        await Revenue.deleteMany({ project: projectId });

        // Then, delete the project itself
        const deletedProject = await Project.findByIdAndDelete(projectId);
        
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Deleted Project and its associated expenses and revenues' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
