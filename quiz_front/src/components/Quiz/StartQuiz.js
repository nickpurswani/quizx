import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuiz } from "../../context/QuizContext";

const StartQuiz = () => {
  const { quizState, setQuizState } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    const startQuiz = async () => {
      setQuizState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await axios.post("http://localhost:5001/quiz/start-quiz");
        setQuizState((prev) => ({
          ...prev,
          currentQuestion: response.data.question,
          isLoading: false,
        }));
        navigate("/question");
      } catch (err) {
        console.error(err);
        setQuizState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    startQuiz();
  }, [setQuizState, navigate]);

  return quizState.isLoading ? <p>Loading...</p> : null;
};

export default StartQuiz;
