import React, { useEffect, useState } from 'react';
import ClassHeader from '../components/ClassHeader';
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './ClassDetails.css'; // Assuming you will add CSS for the card layout

const ClassDetails = () => {
  const { id: classId } = useParams(); // Extract classId from URL params

  console.log('classId from URL:', classId);

  const [classCode, setClassCode] = useState("");
  const [videos, setVideos] = useState([]); // State to store videos
  const [loading, setLoading] = useState(true); // State for loading spinner
  const [selectedVideo, setSelectedVideo] = useState(null); // State for selected video to display in modal
  const token = localStorage.getItem("token"); // Fetch token from localStorage

  useEffect(() => {
    // Fetch the class code from localStorage
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
        // Fetch videos for the class
        const response = await fetch(
          `http://localhost:8080/videos/class/${classId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch videos. Please try again.");
        }

        const result = await response.json();
        setVideos(result); // Store videos in state
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
      // Remove the deleted video from the state
      setVideos(videos.filter((video) => video._id !== videoId));
    } catch (err) {
      toast.error(err.message || "An error occurred while deleting the video.");
    }
  };

  const handleVideoClick = async (videoId) => {
    if (!token) {
      toast.error("You need to log in to view video details.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/videos/${videoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch video details.");
      }
  
      const result = await response.json();
      console.log('API Response:', result); // Add this line
      console.log('Summary data:', result.summary); // Add this line
      setSelectedVideo(result);
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching video details.");
    }
  };

  const closeModal = () => {
    setSelectedVideo(null); // Close the modal
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
                onClick={() => handleVideoClick(video._id)} // Open video details in modal
                role="button"
              >
                <h2 className="video-title">{video.title}</h2>
                <button
                  className="deleteClass-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents triggering card click
                    handleDelete(video._id); // Call the delete function
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedVideo && (
        <div className="video-modal">
          <div className="modal-content">
          {console.log('Selected Video in render:', selectedVideo)} // Add this line
          {console.log('Summary in render:', selectedVideo.summary)} // Add this line
            <button className="close-modal" onClick={closeModal}>X</button>
            <h2>{selectedVideo.title}</h2>
            <video controls>
              <source src={selectedVideo.cloudinaryUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-summary">
              <h3>Description</h3>
              <p>{selectedVideo.description}</p>
              <h3>Summary</h3>
              {selectedVideo.summary.map((item, index) => (
                <div key={index}>
                  <h4>{item.title}</h4>
                  <p>{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ClassDetails;
