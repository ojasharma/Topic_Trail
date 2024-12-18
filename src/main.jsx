import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importing Router
import App from './App';
import './index.css'; // Global styles
import Login from './components/Login'; // Importing login Component
import Dashboard from './components/Dashboard'; // Importing Dashboard Component
import VideoPage from './components/VideoPage'; // Import VideoPage Component (where videos will be displayed)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} /> {/* Show App at root */}
        <Route path="/login" element={<Login />} /> {/* Login Page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard */}
        <Route path="/videos/:folderId" element={<VideoPage />} /> {/* Dynamic Route for Folder Videos */}
      </Routes>
    </Router>
  </React.StrictMode>
);

