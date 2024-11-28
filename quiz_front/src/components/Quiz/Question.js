import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuiz } from "../../context/QuizContext";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    fontFamily: "'Arial', sans-serif",
  },
  questionBox: {
    width: "100%",
    maxWidth: "600px",
    background: "#ffffff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  questionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "10px",
  },
  questionText: {
    fontSize: "16px",
    color: "#555555",
    marginBottom: "20px",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
    maxWidth: "600px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    color: "#444444",
    background: "#f4f4f4",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  radio: {
    margin: "0",
    padding: "0",
    width: "16px",
    height: "16px",
    accentColor: "#4caf50",
  },
  submitButton: {
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s ease",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
  },
};
const decodeHTML = (str) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
};
const Question = () => {
  const { quizState, setQuizState } = useQuiz();
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selectedOption) return;

    try {
      const response = await axios.post("http://localhost:5001/quiz/submit-answer", {
        questionId: quizState.currentQuestion._id,
        answer: selectedOption,
      });

      response.data.nextQuestion.question=decodeHTML(response.data.nextQuestion.question)
      response.data.nextQuestion.options[0]=decodeHTML(response.data.nextQuestion.options[0])
      response.data.nextQuestion.options[1]=decodeHTML(response.data.nextQuestion.options[1])
      response.data.nextQuestion.options[2]=decodeHTML(response.data.nextQuestion.options[2])
      response.data.nextQuestion.options[3]=decodeHTML(response.data.nextQuestion.options[3])
      
      setQuizState((prev) => ({
        ...prev,
        responses: [
          ...prev.responses,
          {
            questionId: quizState.currentQuestion._id,
            isCorrect: response.data.isCorrect,
            topic: quizState.currentQuestion.category,
          },
        ],
        currentQuestion: response.data.nextQuestion,
        questionNumber: prev.questionNumber + 1,
      }));

      if (quizState.questionNumber >= 20 || !response.data.nextQuestion) {
        navigate("/result");
      } else {
        setSelectedOption("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!quizState.currentQuestion) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.questionBox}>
        <h2 style={styles.questionTitle}>
          {quizState.currentQuestion.category} ({quizState.currentQuestion.difficulty}) - Question {quizState.questionNumber} of 20
        </h2>
        <p style={styles.questionText}>{quizState.currentQuestion.question}</p>
      </div>
      <div style={styles.options}>
        {quizState.currentQuestion.options.map((option, index) => (
          <label key={index} style={styles.option}>
            <input
              type="radio"
              value={option}
              checked={selectedOption === option}
              onChange={(e) => setSelectedOption(e.target.value)}
              style={styles.radio}
            />
            {option}
          </label>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        style={{
          ...styles.submitButton,
          ...(selectedOption ? {} : styles.disabledButton),
        }}
        disabled={!selectedOption}
      >
        Submit
      </button>
    </div>
  );
};

export default Question;
