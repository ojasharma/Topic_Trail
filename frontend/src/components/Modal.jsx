import React, { useState, useContext } from "react";
import "./Modal.css";
import { ThemeContext } from "./ThemeContext";

const baseUrl = import.meta.env.VITE_BASE_URL;

const Modal = ({ isOpen, onClose, type }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get token at time of request
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to perform this action");
      return;
    }

    const createUrl = `${baseUrl}classes/create`;
    const joinUrl = `${baseUrl}classes/join`;
    const data = type === "create" ? { title } : { classCode };

    try {
      const response = await fetch(type === "create" ? createUrl : joinUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token retrieved at request time
        },
        body: JSON.stringify(data),
      });

      if (response.status === 403) {
        setError("Access denied. Please try logging out and logging in again.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "An error occurred. Please try again."
        );
      }

      const result = await response.json();
      console.log("Success:", result);
      onClose();
      window.location.reload();
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
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
            <div className="form-group">
              <label htmlFor="title">Class Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-input"
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="classCode">Class Code:</label>
              <input
                type="text"
                id="classCode"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                required
                className="form-input"
              />
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
          <div className="button-group">
            <button type="submit" className="submit-button">
              {type === "create" ? "Create Class" : "Join Class"}
            </button>
            <button type="button" className="close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
