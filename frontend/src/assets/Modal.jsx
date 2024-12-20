import React, { useState } from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, type }) => {
  const [classTitle, setClassTitle] = useState(""); // State for the class title input

  if (!isOpen) return null; // Don't render modal if it's not open

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Prepare the data to be sent to the backend
    const classData = { title: classTitle };

    try {
      const response = await fetch("http://localhost:8080/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Class created successfully!");
        onClose(); // Close the modal after successful class creation
      } else {
        alert("Failed to create class. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{type === "create" ? "Create Class" : "Join Class"}</h2>
        {type === "create" && (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="classTitle">Class Title</label>
              <input
                type="text"
                id="classTitle"
                value={classTitle} // Use `classTitle` instead of `title`
                onChange={(e) => setClassTitle(e.target.value)} // Update `classTitle` state
                placeholder="Enter class title"
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
