const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Create and save the user
    const newUser = new User({ email, password, name });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),(req,res)=>{
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });res.status(200).json({ message: "Login successful!", token });
  }
);
router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code not provided!");
  }

  try {
    // Exchange the code for tokens
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: "authorization_code",
    });

    const { id_token } = tokenResponse.data;

    // Decode the Google ID token to extract the user's Google ID
    const decoded = jwt.decode(id_token);
    const googleId = decoded.sub;

    if (!googleId) {
      return res.status(400).send("Failed to retrieve Google ID!");
    }

    // Check if the user exists in the database
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).send("User not found in the database!");
    }

    // Generate your own JWT token
    const appToken = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1d" } // Token validity
    );

    // Redirect to frontend with the app token
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${appToken}`);
  } catch (error) {
    console.error("Error during Google OAuth callback:", error.response?.data || error.message);
    res.status(500).send("Failed to authenticate with Google");
  }
});



// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
});

module.exports = router;
