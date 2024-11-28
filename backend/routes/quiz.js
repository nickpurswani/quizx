const express = require("express");
const axios = require("axios");
const Question = require("../models/Question");

const router = express.Router();
const evaluateQuiz = require("../utils/evaluateQuiz");

router.post("/evaluate-quiz", (req, res) => {
  const { responses } = req.body; // Array of { questionId, isCorrect, topic }

  try {
    const report = evaluateQuiz(responses);
    res.json({ report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to evaluate quiz." });
  }
});
// Fetch and store questions
router.get("/fetch-questions", async (req, res) => {
  try {
    // Fetch questions from Open Trivia DB API
    const { data } = await axios.get("https://opentdb.com/api.php?amount=50&type=multiple");

    if (data.response_code !== 0) {
      return res.status(500).json({ message: "Failed to fetch questions." });
    }

    const questions = data.results.map((item) => ({
      question: item.question,
      options: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5), // Shuffle options
      correctAnswer: item.correct_answer,
      difficulty: item.difficulty,
      category: item.category,
    }));

    // Insert only new questions
    const bulkOps = questions.map((q) => ({
      updateOne: {
        filter: { question: q.question },
        update: { $setOnInsert: q },
        upsert: true,
      },
    }));

    const result = await Question.bulkWrite(bulkOps);

    res.json({
      message: "Questions fetched and stored successfully!",
      upserted: result.upsertedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch and store questions." });
  }
});
// Helper function: Get the next question based on performance
async function getNextQuestion(difficulty, answeredCorrectly) {
  // Adjust difficulty: If correct, increase; if wrong, decrease
  const nextDifficulty = answeredCorrectly
    ? difficulty === "medium"
      ? "hard"
      : "medium"
    : difficulty === "medium"
    ? "easy"
    : "medium";

  // Fetch a random question of the next difficulty
  const question = await Question.aggregate([
    { $match: { difficulty: nextDifficulty } },
    { $sample: { size: 1 } },
  ]);

  return question[0] || null; // Return null if no question is found
}

// Start Quiz
router.post("/start-quiz", async (req, res) => {
  try {
    const { userId } = req.body; // Optional: Associate quiz with a user
    const firstQuestion = await getNextQuestion("medium", true); // Start with medium difficulty
    delete firstQuestion.correctAnswer;
    res.json({ question: firstQuestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start quiz." });
  }
});

// Submit Answer and Fetch Next Question
router.post("/submit-answer", async (req, res) => {
  const { questionId, answer, answeredCorrectly } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }

    const isCorrect = question.correctAnswer === answer;
    const nextQuestion = await getNextQuestion(question.difficulty, isCorrect);
    delete nextQuestion.correctAnswer;
    res.json({ isCorrect, nextQuestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit answer." });
  }
});
module.exports = router;
