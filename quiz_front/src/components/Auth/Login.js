import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../context/QuizContext";
import styles from "./Auth.module.css";

const Login = () => {
  const { setUser } = useQuiz();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // Handle regular login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        email,
        password,
      });
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token); // Store JWT
      setMessage("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Error logging in. Check your credentials.");
    }
  };

  // Handle Google Login
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2>Login</h2>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {message && <p className={styles.message}>{message}</p>}
        <a href="/signup">Sign Up</a>
      </form>

      {/* Google Login Button */}
      <button className={styles.googleButton} onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  );
};

export default Login;
