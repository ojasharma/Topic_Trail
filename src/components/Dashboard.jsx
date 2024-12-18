import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

function Dashboard() {
  const folders = [
    { id: 1, name: 'Math' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'History' },
  ]; // Example folders
  const navigate = useNavigate();

  const handleFolderClick = (folderId) => {
    navigate(`/videos/${folderId}`); // Redirect to video interface
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to Topic Trail Dashboard</h1>
      <div className="folders-container">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="folder-card"
            onClick={() => handleFolderClick(folder.id)}
          >
            {folder.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
