import { createContext, useState, useContext } from "react";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Authenticated user
  const [quizState, setQuizState] = useState({
    currentQuestion: null,
    responses: [],
    isLoading: false,
    questionNumber:1,
  });

  return (
    <QuizContext.Provider value={{ user, setUser, quizState, setQuizState }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
