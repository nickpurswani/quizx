import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuiz } from "../../context/QuizContext";
import { useNavigate } from "react-router-dom";

const Result = () => {
  const { quizState , setQuizState } = useQuiz();
  const [report, setReport] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
    const evaluateQuiz = async () => {
      try {
        const response = await axios.post("http://localhost:5001/quiz/evaluate-quiz", {
          responses: quizState.responses,
        });
        setReport(response.data.report);
      } catch (err) {
        console.error(err);
      }
    };

    evaluateQuiz();
  }, [quizState.responses]);

  if (!report) return <p>Loading...</p>;
  const decodeHTML = (str) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  };
  const handleClick=()=>{
    setQuizState({
      currentQuestion: null,
      responses: [],
      isLoading: false,
      questionNumber:1,
    })
    navigate('/dashboard');
  }
  return (
    <div>
      <h2>Your Score: {report.score}%</h2><button onClick={handleClick}>Return To Dashboard</button>
      <h3>Suggestions:</h3>
      <ul>
        {report.suggestions.map((suggestion, index) => (
          <li key={index}>
            Topic: {decodeHTML(suggestion.topic)} | Missed: {suggestion.missed}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Result;
