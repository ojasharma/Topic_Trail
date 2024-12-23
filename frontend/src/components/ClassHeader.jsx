import React, { useState } from "react";
import { toast } from "react-toastify";// To show the toast notification on copy success
import "./ClassHeader.css"

const ClassHeader = ({ classCode }) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyClick = () => {
    // Copy the class code to the clipboard
    navigator.clipboard.writeText(classCode).then(() => {
      setCopied(true); // Set the copied state to true
      toast.success("Class code copied to clipboard!"); // Show success toast notification
      setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    }).catch(err => {
      toast.error("Failed to copy class code."); // Show error toast if the copy fails
    });
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    // Handle the search action, maybe log the search query or perform a search
    toast.info(`Searching for: ${searchQuery}`);
  };

  return (
    <div className="class-header">
      {/* Logo on the left side */}
      <div className="logo-container">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>

      {/* Centered search box */}
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
        <button className="search-button" onClick={handleSearchClick}>
          Search
        </button>
      </div>

      {/* Class code and copy button on the right side */}
      <div className="class-code-container">
        <h2>Class Code: {classCode}</h2>
        <button
          className="copy-button"
          onClick={handleCopyClick}
        >
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
    </div>
  );
};

export default ClassHeader;
