import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

function Dashboard() {
  const folders = [
    { id: 1, name: 'Math' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'History' },
    { id: 4, name: 'Math' },
    { id: 5, name: 'Science' },
    { id: 6, name: 'History' },
    { id: 7, name: 'Math' },
    { id: 8, name: 'Science' },
    { id: 9, name: 'History' },
    { id: 10, name: 'Math' },
    { id: 11, name: 'Science' },
    { id: 12, name: 'History' },
    { id: 13, name: 'Math' },
    { id: 14, name: 'Science' },
    { id: 15, name: 'History' },
  ]; // Example folders
  const navigate = useNavigate();

  const handleFolderClick = (folderId) => {
    navigate(`/videos/${folderId}`); // Redirect to video interface
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Choose Your Topic !</h1>
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
