import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClassHeader from '../components/ClassHeader';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './ClassDetails.css';

const ClassDetails = () => {
  const { id: classId } = useParams();
  const [classCode, setClassCode] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedClassCode = localStorage.getItem('classCode');
    if (storedClassCode) {
      setClassCode(storedClassCode);
    }
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!token) {
        toast.error("Please log in to view videos.");
        setLoading(false);
        return;
      }

      if (!classId) {
        toast.error("Class ID is missing in the URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/videos/class/${classId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch videos. Please try again.");
        }

        const result = await response.json();
        setVideos(result);
      } catch (err) {
        toast.error(err.message || "An error occurred while fetching videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [classId, token]);

  const handleDelete = async (videoId) => {
    if (!token) {
      toast.error("You need to log in to delete videos.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete video.");
      }

      toast.success("Video deleted successfully!");
      setVideos(videos.filter((video) => video._id !== videoId));
    } catch (err) {
      toast.error(err.message || "An error occurred while deleting the video.");
    }
  };

  const handleCardClick = (videoId) => {
    window.location.href = `/video/${videoId}`; // Navigate to video details page
  };

  return (
    <div className="class-details">
      <ClassHeader classCode={classCode} classId={classId} />
      <div className="class-details-content">
        <h1>Class Videos</h1>

        {loading ? (
          <p>Loading videos...</p>
        ) : videos.length === 0 ? (
          <p>No videos available for this class.</p>
        ) : (
          <div className="videos-grid">
            {videos.map((video) => (
              <div
                key={video._id}
                className="video-card"
                role="button"
                onClick={() => handleCardClick(video._id)} // Make the card clickable
              >
                <h2 className="video-title">{video.title}</h2>
                <div className="video-actions">
                  <button
                    className="deleteClass-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click on the card from firing the delete
                      handleDelete(video._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ClassDetails;
