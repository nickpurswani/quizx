// server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only required for email/password signup
  googleId: { type: String }, // Only required for Google OAuth users
  name: { type: String },
  profilePicture: { type: String }, // Optional: to store user's profile picture from Google
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving, only if password is modified (for email/password users)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
