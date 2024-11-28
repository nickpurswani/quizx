import React from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  graphContainer: {
    width: "100%",
    maxWidth: "600px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  button: {
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

const pastQuizData = [
  { date: "2024-11-21", score: 8 },
  { date: "2024-11-22", score: 7 },
  { date: "2024-11-23", score: 9 },
  { date: "2024-11-24", score: 6 },
  { date: "2024-11-25", score: 10 },
];

const createChartData = (data) => ({
  labels: data.map((entry) => entry.date),
  datasets: [
    {
      label: "Scores",
      data: data.map((entry) => entry.score),
      backgroundColor: "#4caf50",
    },
  ],
});

const Dashboard = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate("/start");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quiz Dashboard</h1>
      <div style={styles.graphContainer}>
        <Bar
          key={JSON.stringify(pastQuizData)} // Force re-render if data changes
          data={createChartData(pastQuizData)}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Past Quiz Performance",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }}
        />
      </div>
      <button style={styles.button} onClick={handleStartQuiz}>
        Start New Quiz
      </button>
    </div>
  );
};

export default Dashboard;
