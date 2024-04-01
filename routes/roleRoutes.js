const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Authentication middleware
const Role = require('../models/Role'); // Adjust the path as needed

// POST a new role - Protected by auth
router.post('/', auth, async (req, res) => {
    try {
        const role = new Role({
            ...req.body
        });
        const newRole = await role.save();
        res.status(201).json(newRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all roles - Optionally protected by auth
router.get('/', auth, async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to find a role by ID for route chaining
async function getRole(req, res, next) {
    let role;
    try {
        role = await Role.findById(req.params.id);
        if (role == null) {
            return res.status(404).json({ message: 'Cannot find role' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.role = role;
    next();
}

// GET a single role by ID - Optionally protected by auth
router.get('/:id', auth, getRole, (req, res) => {
    res.json(res.role);
});

// PATCH (update) a role by ID - Protected by auth
router.patch('/:id', auth, getRole, async (req, res) => {
    if(req.body.name != null){
        res.role.name = req.body.name;
    }
    if(req.body.permissions != null){
        res.role.permissions = req.body.permissions;
    }

    try {
        const updatedRole = await res.role.save();
        res.json(updatedRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a role by ID - Protected by auth
router.delete('/:id', auth, getRole, async (req, res) => {
    try {
        await res.role.remove();
        res.json({ message: 'Deleted Role' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
