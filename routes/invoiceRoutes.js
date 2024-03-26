const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Invoice = require('../models/Invoice'); // Adjust this path to match your file structure

// POST a new invoice - Protected by auth
router.post('/', auth, async (req, res) => {
    const invoice = new Invoice({
        ...req.body,
        user: req.user.id, // Associate the invoice with the authenticated user
    });
    try {
        const newInvoice = await invoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all invoices for the authenticated user - Protected by auth
router.get('/', auth, async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to verify invoice ownership
async function getInvoice(req, res, next) {
    let invoice;
    try {
        invoice = await Invoice.findOne({ _id: req.params.id, user: req.user.id });
        if (invoice == null) {
            return res.status(404).json({ message: 'Cannot find invoice' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.invoice = invoice;
    next();
}

// GET a single invoice by ID - Protected by auth and ownership
router.get('/:id', auth, getInvoice, (req, res) => {
    res.json(res.invoice);
});

// PATCH (update) an invoice by ID - Protected by auth and verified ownership
router.patch('/:id', auth, getInvoice, async (req, res) => {
    const invoice = res.invoice;
    Object.keys(req.body).forEach(key => {
        if (req.body[key] != null) {
            invoice[key] = req.body[key];
        }
    });

    try {
        const updatedInvoice = await invoice.save();
        res.json(updatedInvoice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE an invoice by ID - Protected by auth and verified ownership
router.delete('/:id', auth, getInvoice, async (req, res) => {
    try {
        await res.invoice.remove();
        res.json({ message: 'Deleted Invoice' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
