// ClassHeader.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import "./ClassHeader.css";

const ClassHeader = ({ classCode, classId, onSearch }) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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
        <img src="/logo.png" alt="Logo" className="logo" />
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

      <div className="class-code-container">
        <h2>Class Code: {classCode}</h2>
        <button className="copy-button" onClick={handleCopyClick}>
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>

      <div className="upload-button-container">
        <button
          className="upload-button"
          onClick={() => setShowUploadModal(true)}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
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
                className="cancel-button"
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
