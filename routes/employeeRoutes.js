const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the authentication middleware
const Employee = require('../models/Employee'); // Assuming you have this model set up

// Post a new employee - Protected by auth
router.post('/', auth, async (req, res) => {
    // Assuming you want to link the employee to the user somehow
    // You might need to adjust this according to your Employee model
    const employee = new Employee({
        ...req.body,
        user: req.user.id // Associate the employee with the authenticated user
    });
    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all employees - Protected by auth
router.get('/', auth, async (req, res) => {
    try {
        // Adjust the query to fetch only employees associated with the authenticated user
        const employees = await Employee.find({ user: req.user.id });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get an employee by ID and verify ownership
async function getEmployee(req, res, next) {
    let employee;
    try {
        // Adjust this to ensure the employee belongs to the authenticated user
        employee = await Employee.findOne({ _id: req.params.id, user: req.user.id });
        if (employee == null) {
            return res.status(404).json({ message: 'Cannot find employee' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.employee = employee;
    next();
}

// Protected routes with getEmployee middleware ensuring the employee belongs to the user
router.patch('/:id', auth, getEmployee, async (req, res) => {
    // Assume getEmployee middleware retrieves the employee document and attaches it to res.employee

    Object.keys(req.body).forEach(key => {
        // Check if the key exists in req.body and is not null
        if (req.body[key] != null) {
            res.employee[key] = req.body[key];
        }
    });

    try {
        // Attempt to save the updated employee document
        const updatedEmployee = await res.employee.save();
        // Respond with the updated employee data
        res.json(updatedEmployee);
    } catch (err) {
        // Handle potential errors, such as validation errors
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', auth, getEmployee, async (req, res) => {
    try {
        await res.employee.remove();
        res.json({ message: 'Deleted Employee' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
