import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Importing useLocation to get state
import './VideoPage.css';

function VideoPage() {
  const { folderId } = useParams();
  const location = useLocation(); // Access the location object to get state
  const { folderName } = location.state || {}; // Destructure folderName from state

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="video-page">
      <h1>Videos in Folder: {folderName || "Unknown Folder"}</h1> {/* Display folderName or fallback */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for videos..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="videos-container">
        {/* Here you would display the videos based on folderId */}
        <div className="video-card">Video 1 in Folder {folderId}</div>
        <div className="video-card">Video 2 in Folder {folderId}</div>
        <div className="video-card">Video 3 in Folder {folderId}</div>
      </div>
    </div>
  );
}

export default VideoPage;
