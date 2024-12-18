import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

function Dashboard() {
  const folders = [
    { id: 1, name: 'Math' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'History' },
    { id: 4, name: 'Math' },
    { id: 5, name: 'Mole Concept' },
    { id: 6, name: 'Algebra' },
    { id: 7, name: 'Computing' },
    { id: 8, name: 'Geography' },
    { id: 9, name: 'Literature' },
  ]; // Example folders
  const navigate = useNavigate();

  const handleFolderClick = (folderId, folderName) => {
    navigate(`/videos/${folderId}`, { state: { folderName: folderName } });
  };  

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Choose Your Topic !</h1>
      <div className="folders-container">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="folder-card"
            onClick={() => handleFolderClick(folder.id, folder.name)}
          >
            {folder.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
