const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Update the path as necessary
const bcrypt = require('bcryptjs');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    // Try to find the user by their Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // If the user isn't found by Google ID, they might be a new user,
      // or they've previously registered without Google. Here, we're opting
      // to create a new user if they don't exist.
      // Consider additional checks or prompts as necessary, especially if merging accounts
      // or linking existing accounts with Google.

      // Create a new user with information from their Google profile.
      // You might want to adjust this according to your User schema.
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value, // Taking the first email
        username: profile.displayName, // Or any other username logic
        // Set a hashed random password for OAuth users if your User model requires it
        password: await bcrypt.hash(`${profile.id}${process.env.GOOGLE_CLIENT_SECRET}`, 10)
      });
      await user.save();
    }
    
    // Pass the user to the done function, which will be utilized by Passport to establish a session
    done(null, user);
  }
));

// Serialization and deserialization here
// Assuming you're using sessions, which might not be necessary if using JWT tokens
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
