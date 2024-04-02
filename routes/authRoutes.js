const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Adjust path as necessary
require('dotenv').config();

const router = express.Router();
const secretKey = process.env.JWT_SECRET;

// Passport setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
        password: await bcrypt.hash(`${profile.id}${process.env.GOOGLE_CLIENT_SECRET}`, 10) // Or any other fields you wish to save
      });
      await user.save();
    }

    done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Local Registration
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

// Local Login
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
        
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
        res.send({ user: { id: user._id, email: user.email, username: user.username }, token });
    } catch(error) {
        res.status(400).send(error);
    }
});

// Google OAuth Routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // On successful authentication, issue a token or redirect as needed
    const token = jwt.sign({ id: req.user._id }, secretKey, { expiresIn: '1h' });
    // You might redirect the user to the frontend with the token
    res.redirect(`https://projectfinancetracker-front-c3c5e9b026ae.herokuapp.com/`);
    // Or send the token directly if handling authentication within a SPA
    res.send({ token });
  }
);

module.exports = router;
