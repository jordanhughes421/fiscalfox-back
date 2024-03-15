const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as necessary
require('dotenv').config();

const router = express.Router();
const secretKey = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        console.log(req.body); // Check the incoming request data
        const user = new User(req.body);
        await user.save();
        console.log(user); // Verify the user is created
        const token = jwt.sign({id: user._id}, secretKey, { expiresIn: '1h' });
        console.log(token); // Verify the token is generated
        res.status(201).send({ user: { id: user._id, email: user.email, username: user.username }, token });
    } catch(error) {
        console.log(error); // Check for any errors
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send('Unable to login');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).send('Unable to login');
        }
        
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
        res.send({ user: { id: user._id, email: user.email, username: user.username }, token });
    } catch(error) {
        res.status(400).send(error);
    }
});

module.exports = router;
