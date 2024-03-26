const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quote = require('../models/Quote'); // Adjust the path as necessary

// POST a new quote - Protected by auth
router.post('/', auth, async (req, res) => {
    const quote = new Quote({
        ...req.body,
        user: req.user.id, // Associate the quote with the authenticated user
    });
    try {
        const newQuote = await quote.save();
        res.status(201).json(newQuote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all quotes for the authenticated user - Protected by auth
router.get('/', auth, async (req, res) => {
    try {
        const quotes = await Quote.find({ user: req.user.id });
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to verify quote ownership
async function getQuote(req, res, next) {
    let quote;
    try {
        quote = await Quote.findOne({ _id: req.params.id, user: req.user.id });
        if (quote == null) {
            return res.status(404).json({ message: 'Cannot find quote' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.quote = quote;
    next();
}

// GET a single quote by ID - Protected by auth and ownership
router.get('/:id', auth, getQuote, (req, res) => {
    res.json(res.quote);
});

// PATCH (update) a quote by ID - Protected by auth and verified ownership
router.patch('/:id', auth, getQuote, async (req, res) => {
    const quote = res.quote;
    Object.keys(req.body).forEach(key => {
        if (req.body[key] != null) {
            quote[key] = req.body[key];
        }
    });

    try {
        const updatedQuote = await quote.save();
        res.json(updatedQuote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a quote by ID - Protected by auth and verified ownership
router.delete('/:id', auth, getQuote, async (req, res) => {
    try {
        await res.quote.remove();
        res.json({ message: 'Deleted Quote' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
