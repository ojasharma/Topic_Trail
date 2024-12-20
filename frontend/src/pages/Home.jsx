import React, { useEffect, useState } from "react";
import Header from "../assets/Header";
import "./Home.css";
import { ToastContainer } from "react-toastify";
import { handleError } from "../utils";
import { useNavigate } from 'react-router-dom';

function Home() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      if (!token) {
        handleError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch classes
        const response = await fetch("http://localhost:8080/classes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch classes. Please try again.");
        }

        const result = await response.json();
        const classesWithCreators = await Promise.all(
          result.classes.map(async (classItem) => {
            try {
              // Fetch creator details
              const creatorResponse = await fetch(
                `http://localhost:8080/users/${classItem.creator}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                  },
                }
              );

              if (!creatorResponse.ok) {
                throw new Error("Failed to fetch creator details.");
              }

              const creatorData = await creatorResponse.json();
              return { ...classItem, creatorName: creatorData.name };
            } catch (err) {
              // Fallback if creator details fail
              console.error(
                `Error fetching creator for class ${classItem.title}: ${err.message}`
              );
              return { ...classItem, creatorName: "Unknown" };
            }
          })
        );

        setClasses(classesWithCreators);
      } catch (err) {
        handleError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [token]);

  const handleCardClick = (classId) => {
    navigate(`/class/${classId}`);
  };

  return (
    <div>
      <Header />
      <div class="spacer"></div>
      <div className="home-container">
        <h1>Your Classes</h1>
        {loading ? (
          <p>Loading classes...</p>
        ) : classes.length === 0 ? (
          <p>You are not part of any classes yet.</p>
        ) : (
          <div className="classes-grid">
            {classes.map((classItem) => (
              <div
                key={classItem._id}
                className="class-card"
                onClick={() => handleCardClick(classItem._id)}
                role="button"
              >
                <h2>{classItem.title}</h2>
                <p>Created by: {classItem.creatorName}</p>
              </div>
            ))}
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

export default Home;