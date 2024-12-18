import React ,{ useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./App.css";

function App() {

  const navigate = useNavigate(); // Initialize navigate function from the hook

  // Function to handle navigation
  const goToLogin = () => {
    navigate('/login'); // This will redirect to the login page
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to Topic Trail</h1>
        <p>Your one-stop solution for topic-based video search!</p>
        {/* Button to navigate to Login page */}
        <button onClick={goToLogin} className="goToLogin">
          Go to Login
        </button>
      </header>
    </div>
  );
}

export default App;
