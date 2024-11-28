const express = require("express");
const connectDB = require("./config/db");
const passport = require("passport");
const sessionMiddleware = require("./middleware/session");
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");
require("dotenv").config();
require("./config/passport");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Include credentials like cookies, authorization headers, etc.
  })
);
// Middleware
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);

// Connect to DB and Start Server
connectDB();

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  
  // Graceful shutdown function
  const gracefulShutdown = () => {
    console.log('\nShutting down gracefully...');
    server.close((err) => {
      if (err) {
        console.error('Error during server shutdown:', err);
        process.exit(1);
      }
      console.log('Closed out remaining connections');
      process.exit(0);
    });
  };
  
  // Capture termination signals
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);