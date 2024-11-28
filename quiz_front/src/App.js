import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import Login from "./components/Auth/Login";
import StartQuiz from "./components/Quiz/StartQuiz";
import Question from "./components/Quiz/Question";
import Result from "./components/Quiz/Result";
import Dashboard from "./components/Quiz/Dashboard";
import Signup from "./components/Auth/Signup";

const App = () => {
  
  console.log(process.env.REACT_APP_BACKEND_URL);
  
  return (
    <QuizProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/start" element={<StartQuiz />} />
          <Route path="/question" element={<Question />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Router>
    </QuizProvider>
  );
};

export default App;
