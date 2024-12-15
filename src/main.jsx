import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importing Router
import App from './App';
import './index.css'; // Global styles
import Login from './components/Login'; // Importing Login Component
import Dashboard from './components/Dashboard'; // Importing Dashboard Component

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login Page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard */}
      </Routes>
    </Router>
  </React.StrictMode>
);

