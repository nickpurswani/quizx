const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true, unique: true }, // Ensure questions are unique
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  difficulty: { type: String, required: true }, // e.g., "easy", "medium", "hard"
  category: { type: String, required: true },
});

module.exports = mongoose.model("Question", questionSchema);
