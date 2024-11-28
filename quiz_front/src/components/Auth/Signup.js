import React, { useState } from "react";
import axios from "axios";
import styles from "./Auth.module.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate=useNavigate()
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/auth/signup", {
        email,
        password,
        name,
      });
      setMessage("Signup successful! Please login.");
      navigate('/')
    } catch (err) {
      console.error(err);
      setMessage("Error signing up. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSignup}>
        <h2>Signup</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Signup</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
