// routes/assetRoutes.js
const express = require('express');
const auth = require('../middleware/auth'); // Adjust path as necessary
const router = express.Router();
const Asset = require('../models/Asset'); // Assuming you have this model set up

// Post a new asset
router.post('/', auth, async (req, res) => {
    const asset = new Asset({
        ...req.body,
        user: req.user.id // Associate asset with the authenticated user
    });
    try {
        const newAsset = await asset.save();
        res.status(201).json(newAsset);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all assets
router.get('/', auth, async (req, res) => {
    try {
        const assets = await Asset.find({ user: req.user.id });
        res.json(assets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get an asset by ID and verify ownership
async function getAsset(req, res, next) {
    let asset;
    try {
        asset = await Asset.findOne({ _id: req.params.id, user: req.user.id });
        if (asset == null) {
            return res.status(404).json({ message: 'Cannot find asset' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.asset = asset;
    next();
}

// Get a single asset by ID, ensuring the asset belongs to the user
router.get('/:id', auth, getAsset, (req, res) => {
    res.json(res.asset);
});

// Update an asset, ensuring the asset belongs to the user
router.patch('/:id', auth, getAsset, async (req, res) => {
    // Assume getAsset middleware retrieves the asset document and attaches it to res.asset

    Object.keys(req.body).forEach(key => {
        // Check if the key exists in req.body and is not null
        if (req.body[key] != null) {
            res.asset[key] = req.body[key];
        }
    });

    try {
        // Attempt to save the updated asset document
        const updatedAsset = await res.asset.save();
        // Respond with the updated asset data
        res.json(updatedAsset);
    } catch (err) {
        // Handle potential errors, such as validation errors
        res.status(400).json({ message: err.message });
    }
});

// Delete an asset, ensuring the asset belongs to the user
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedAsset = await Asset.findByIdAndDelete(req.params.id);

        if (!deletedAsset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.json({ message: 'Deleted Asset' });
    } catch (err) {
        console.error("Error deleting asset:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
