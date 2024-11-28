const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.FRONTENDURL}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails, photos } = profile; // Extract profile details
      try {
        // Check if the user already exists
        let user = await User.findOne({ googleId: id });

        if (!user) {
          // If not, create a new user and save profile details
          user = await User.create({
            googleId: id,
            name: displayName,
            email: emails[0].value, // First email in the array
            profilePicture: photos[0].value, // First photo in the array
          });
        } else {
          // Optional: Update the user with the latest profile picture
          user.profilePicture = photos[0].value;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        console.error("Error during Google authentication:", err);
        done(err, null);
      }
    }
  )
);

// Serialize user ID into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session by ID
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = passport;
