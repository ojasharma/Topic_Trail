import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

function Login() {
  const [email, setEmail] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup
  const navigate = useNavigate();

  const handleLoginOrSignUp = () => {
    if (!email) {
      alert('Please enter an email.');
      return;
    }

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (isSignUp) {
      // Handle Signup
      const userExists = users.some((user) => user.email === email);

      if (userExists) {
        alert('User already exists. Please login.');
        setIsSignUp(false); // Switch to login mode
      } else {
        users.push({ email });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful! You can now log in.');
        setIsSignUp(false); // Switch to login mode
      }
    } else {
      // Handle Login
      const userExists = users.some((user) => user.email === email);

      if (userExists) {
        navigate('/dashboard'); // Redirect to Dashboard
      } else {
        alert('User not found. Please sign up.');
        setIsSignUp(true); // Switch to signup mode
      }
    }
  };

  return (
    <div className="login-container">
      <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="email-input"
      />
      <button onClick={handleLoginOrSignUp} className="login-btn">
        {isSignUp ? 'Sign Up' : 'Login'}
      </button>
      <p>
        {isSignUp
          ? 'Already have an account? '
          : "Don't have an account? "}
        <span
          className="toggle-signup"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Login' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
}

export default Login;
