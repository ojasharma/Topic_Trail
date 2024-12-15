import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student'); // Default role is student
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && role) {
      // Store email and role in localStorage
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
      navigate('/dashboard'); // Redirect to the dashboard
    } else {
      alert('Please enter both email and role');
    }
  };

  return (
    <div className="login-container">
      <h1>Login to Topic Trail</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>
        <label>
          Teacher
          <input
            type="radio"
            value="teacher"
            checked={role === 'teacher'}
            onChange={() => setRole('teacher')}
          />
        </label>
        <label>
          Student
          <input
            type="radio"
            value="student"
            checked={role === 'student'}
            onChange={() => setRole('student')}
          />
        </label>
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
