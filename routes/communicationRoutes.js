const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Communication = require('../models/Communication'); // Adjust the path as needed

// POST a new communication - Protected by auth
router.post('/', auth, async (req, res) => {
    const communication = new Communication({
        ...req.body,
        user: req.user.id, // Associate the communication with the authenticated user
    });
    try {
        const newCommunication = await communication.save();
        res.status(201).json(newCommunication);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all communications for the authenticated user - Protected by auth
router.get('/', auth, async (req, res) => {
    try {
        const communications = await Communication.find({ user: req.user.id });
        res.json(communications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to verify communication ownership
async function getCommunication(req, res, next) {
    let communication;
    try {
        communication = await Communication.findOne({ _id: req.params.id, user: req.user.id });
        if (communication == null) {
            return res.status(404).json({ message: 'Cannot find communication' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.communication = communication;
    next();
}

// GET a single communication by ID - Protected by auth and ownership
router.get('/:id', auth, getCommunication, (req, res) => {
    res.json(res.communication);
});

// PATCH (update) a communication by ID - Protected by auth and verified ownership
router.patch('/:id', auth, getCommunication, async (req, res) => {
    const communication = res.communication;
    Object.keys(req.body).forEach(key => {
        if (req.body[key] != null) {
            communication[key] = req.body[key];
        }
    });

    try {
        const updatedCommunication = await communication.save();
        res.json(updatedCommunication);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a communication by ID - Protected by auth and verified ownership
router.delete('/:id', auth, getCommunication, async (req, res) => {
    try {
        await res.communication.remove();
        res.json({ message: 'Deleted Communication' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
