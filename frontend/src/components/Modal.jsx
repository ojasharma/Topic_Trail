import React, { useState, useContext } from "react";
import "./Modal.css";
import { ThemeContext } from "./ThemeContext"; // Import the theme context

const token = localStorage.getItem("token");

const Modal = ({ isOpen, onClose, type }) => {
  const { isDarkMode } = useContext(ThemeContext); // Access the dark mode state from context

  if (!isOpen) return null;

  const [title, setTitle] = useState(""); // For "Create Class" input
  const [classCode, setClassCode] = useState(""); // For "Join Class" input
  const [error, setError] = useState(""); // To handle any errors

  const handleSubmit = async (e) => {
    e.preventDefault();

    const createurl = "http://localhost:8080/classes/create";
    const joinUrl = "http://localhost:8080/classes/join";

    const data = type === "create" ? { title } : { classCode }; // Send title for create, classCode for join

    try {
      const response = await fetch(type === "create" ? createurl : joinUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("An error occurred. Please try again.");
      }

      const result = await response.json();
      console.log(result); // Handle success result if needed
      onClose(); // Close the modal after submission
      window.location.reload(); // Refresh the page after successful submission
    } catch (error) {
      setError(error.message); // Show error message if request fails
    }
  };

  return (
    <div
      className={`modal-overlay ${isDarkMode ? "dark-overlay" : ""}`}
      onClick={onClose}
    >
      <div
        className={`modal-content ${isDarkMode ? "dark-content" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{type === "create" ? "Create Class" : "Join Class"}</h2>
        <form onSubmit={handleSubmit}>
          {type === "create" ? (
            <>
              <label htmlFor="title">Class Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <label htmlFor="classCode">Class Code:</label>
              <input
                type="text"
                id="classCode"
                name="classCode"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                required
              />
            </>
          )}
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Display error message */}
          <button type="submit" className="submitButton">
            {type === "create" ? "Create Class" : "Join Class"}
          </button>
        </form>
        <button className="closeButton" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
