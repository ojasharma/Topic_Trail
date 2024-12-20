import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../assets/Header";
import { handleError } from "../utils";
import { ToastContainer } from "react-toastify";

const ClassDetails = () => {
  const { id } = useParams(); // Get the class ID from URL parameters
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!token) {
        handleError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/classes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch class details");
        }

        const data = await response.json();
        setClassData(data);
      } catch (err) {
        handleError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id, token]);

  return (
    <div>
      <Header />
      <div className="class-details-container">
        {loading ? (
          <p>Loading class details...</p>
        ) : classData ? (
          <div className="class-details">
            <h2>{classData.title}</h2>
            <p>{classData.description}</p>
            {/* Add more class details as needed */}
          </div>
        ) : (
          <p>Class not found</p>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default ClassDetails;