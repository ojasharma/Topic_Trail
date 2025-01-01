// ClassHeader.js
import React, { useState, useEffect } from "react";
import { FaRegCopy, FaUpload } from "react-icons/fa";
import { Sun, Moon } from "lucide-react"; // Using lucide icons for theme toggle
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ClassHeader.css";

const ClassHeader = ({ classCode, classId, onSearch, isCreator }) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const { id: classId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
      // Initialize theme based on saved preference or default to light mode
      const savedTheme = localStorage.getItem("theme") || "light";
      setIsDarkMode(savedTheme === "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(classCode)
      .then(() => {
        setCopied(true);
        toast.success("Class code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy class code.");
      });
  };

  const handleRefreshClass = () => {
    window.location.reload();
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    if (!videoFile || !videoTitle || !videoDescription) {
      toast.error("Please fill in all fields and select a video.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);
    formData.append("classId", classId);

    try {
      const response = await fetch("http://localhost:8080/videos/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload video. Please try again.");
      }

      const result = await response.json();
      toast.success(result.message || "Video uploaded successfully!");

      setTimeout(function(){
        window.location.reload();
      }, 3000);

      setVideoFile(null);
      setVideoTitle("");
      setVideoDescription("");
      setShowUploadModal(false);
    } catch (error) {
      toast.error(error.message || "An error occurred during video upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="class-header">
      <div className="logo-container">
        <img 
        src={isDarkMode ? "/logo_dark.png" : "/logo.png"}
        alt="Logo" 
        className="logo" 
        onClick={handleRefreshClass}
        />
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-box"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
      </div>

      <div className="class-controls">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="class-code-container">
          <div className="copy-icon">
            <FaRegCopy onClick={handleCopyClick} />
          </div>

          {/* <button className="copy-button" onClick={handleCopyClick}>
            {copied ? "Copied!" : "Copy Code"}
          </button> */}
        </div>

        {isCreator && <div className="upload-button-container">
          <div className="upload-icon">
            <FaUpload
              onClick={() => setShowUploadModal(true)}
              disabled={isUploading}
            />
            {/* <div>Uploading</div> */}
          </div>
        </div>}

      </div>

      {showUploadModal && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <h2>Upload Video</h2>
            <input
              type="text"
              placeholder="Video Title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              disabled={isUploading}
            />
            <textarea
              placeholder="Video Description"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              disabled={isUploading}
            />
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <div className="modal-buttons">
              <button onClick={handleUploadClick} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              <button
                // className="cancel-button"
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassHeader;
