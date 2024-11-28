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

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTEND_URL);
});

module.exports = router;
