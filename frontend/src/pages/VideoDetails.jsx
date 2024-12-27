import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './VideoDetails.css'; // Create a new CSS file for styling this page

const VideoDetails = () => {
  const { videoId } = useParams(); // Extract videoId from URL params
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!token) {
        toast.error('You need to log in to view video details.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/videos/${videoId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch video details.');
        }

        const result = await response.json();
        setSelectedVideo(result);
      } catch (err) {
        toast.error(err.message || 'An error occurred while fetching video details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId, token]);

  if (loading) return <p>Loading video details...</p>;
  if (!selectedVideo) return <p>Video not found.</p>;

  return (
    <div className="video-details">
      <h1>{selectedVideo.title}</h1>

      <div className="video-left">
        <div className="video-container">
          <video controls>
            <source src={selectedVideo.cloudinaryUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-description">
            <h3>Description</h3>
            <p>{selectedVideo.description}</p>
        </div>
      </div>

      <div className="video-right">
        <div className="video-summary">
          <h3>Summary</h3>
          {selectedVideo.summary.length > 0 ? (
            selectedVideo.summary.map((item, index) => (
              <div key={index}>
                <h4>{item.title}</h4>
                <p>{item.content}</p>
              </div>
            ))
          ) : (
            <p>No summary available for this video.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default VideoDetails;
