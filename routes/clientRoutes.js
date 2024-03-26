const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Authentication middleware
const Client = require('../models/Client'); // Adjust the path as needed

// POST a new client - Protected by auth
router.post('/', auth, async (req, res) => {
    const client = new Client({
        ...req.body,
        user: req.user.id // Associate the client with the authenticated user
    });
    try {
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all clients for the authenticated user - Protected by auth
router.get('/', auth, async (req, res) => {
    try {
        const clients = await Client.find({ user: req.user.id });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to verify client ownership
async function getClient(req, res, next) {
    let client;
    try {
        client = await Client.findOne({ _id: req.params.id, user: req.user.id });
        if (client == null) {
            return res.status(404).json({ message: 'Cannot find client' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.client = client;
    next();
}

// GET a single client by ID - Protected by auth and ownership
router.get('/:id', auth, getClient, (req, res) => {
    res.json(res.client);
});

// PATCH (update) a client by ID - Protected by auth and verified ownership
router.patch('/:id', auth, getClient, async (req, res) => {
    const client = res.client;
    Object.keys(req.body).forEach(key => {
        if (req.body[key] != null) {
            client[key] = req.body[key];
        }
    });

    try {
        const updatedClient = await client.save();
        res.json(updatedClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a client by ID - Protected by auth and verified ownership
router.delete('/:id', auth, getClient, async (req, res) => {
    try {
        await res.client.remove();
        res.json({ message: 'Deleted Client' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
