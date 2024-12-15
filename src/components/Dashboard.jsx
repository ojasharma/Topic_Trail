import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboard from './TeacherDashboard'; // Import Teacher's Dashboard
import StudentDashboard from './StudentDashboard'; // Import Student's Dashboard

function Dashboard() {
  const role = localStorage.getItem('role'); // Get the user's role from localStorage
  const navigate = useNavigate();

  if (!role) {
    navigate('/'); // If no role is set, navigate to login
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
    </div>
  );
}

export default Dashboard;
