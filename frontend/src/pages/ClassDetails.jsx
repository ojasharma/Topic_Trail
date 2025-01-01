// ClassDetails.js
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import styles from "./Home.module.css";
import ClassHeader from "../components/ClassHeader";
import { ToastContainer, toast } from "react-toastify";
import debounce from "lodash/debounce";
import "react-toastify/dist/ReactToastify.css";
import "./ClassDetails.css";
import { result } from "lodash";

const ClassDetails = () => {
  const { id: classId } = useParams();
  const [classCode, setClassCode] = useState("");
  const [videos, setVideos] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreator, setCreator] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    const storedClassCode = localStorage.getItem("classCode");
    if (storedClassCode) {
      setClassCode(storedClassCode);
    }


    const fetchClasses = async () => {

      const response = await fetch("http://localhost:8080/classes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch classes. Please try again.");
      }

      const result = await response.json();

      let allClasses = result;

      let myClass;
      let myClassCreator;

      if (allClasses) {
        myClass = allClasses.classes.filter(myClass => myClass._id == classId);
      }

      if (myClass) {
        myClassCreator = myClass[0].creator._id;
        const userId = JSON.parse(atob(token.split(".")[1]))._id;

        if (myClassCreator === userId) {
          setCreator(true);
        }
      }

    }

    let allClasses = fetchClasses();

  }, []);

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
      setVideos(result);
      setSearchResults(null);
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [classId, token]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/videos/search?query=${encodeURIComponent(
          searchQuery
        )}&classId=${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Failed to search videos");
    }
  };

  const handleDeleteVideo = async (classId, event) => {
      event.stopPropagation();
      setOpenMenuId(null);
    };

  const debouncedSearch = useCallback(
    debounce((query) => handleSearch(query), 300),
    [handleSearch]
  );

  const VideosGrid = ({ videos, title }) => (
    <div className="videos-section">
      <h2>{title}</h2>
      <div className="videos-grid">
        {videos.map((video) => (
          <div className="videos-card-wrap" key={video._id}>
            <div
              key={video._id}
              className="video-card"
              role="button"
              onClick={() => handleCardClick(video._id)}
            >
              {/* <h2 className="video-title">{video.title}</h2>
            {video.summary && (
              <div className="video-topics">
                {video.summary.map((item, index) => (
                  <span key={index} className="topic-tag">
                    {item.title}
                  </span>
                ))}
              </div>
            )} */}

              <img src={video.thumbnailUrl} />



            </div>
            <div className="classVideoContent">

              <div className="video-content-left">

                <h2 className="video-title">{video.title}</h2>
                {video.summary && (
                  <div className="video-topics">
                    <span>Topics: </span>
                    <select key={video._id}>
                    {video.summary.map((item, index) => (
                      // <span key={index} className="topic-tag">
                      //   {item.title}
                      // </span>
                      <option value={item.title} key={index}>{item.title}</option>
                    ))}
                    </select>
                  </div>
                )}

              </div>

              <div className="video-content-right">


                <div className={styles.options}>
                  {isCreator && <button
                    className={styles.menuButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === video._id ? null : video._id
                      );
                    }}
                  >
                    <MoreVertical size={20} />
                  </button>}
                  {openMenuId === video._id && (
                    <div className={styles.menuDropdown}>
                      {isCreator && (
                        <button onClick={(e) => {
                          e.stopPropagation();
                          openModal(video._id);
                        }}>
                          Delete Video
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>


            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const handleDelete = async () => {
    if (!token) {
      toast.error("You need to log in to delete videos.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/videos/${videoToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete video.");
      }

      toast.success("Video deleted successfully!");
      setVideos(videos.filter((video) => video._id !== videoToDelete));
      closeModal();
    } catch (err) {
      toast.error(err.message || "An error occurred while deleting the video.");
    }
  };

  const handleClassBack = () => {
    navigate("/home");
  }

  const openModal = (videoId) => {
    setVideoToDelete(videoId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setVideoToDelete(null);
    setIsModalOpen(false);
  };

  const handleCardClick = (videoId) => {
    window.location.href = `/video/${videoId}`;
  };

  return (
    <div className="class-details">
      <ClassHeader
        classCode={classCode}
        classId={classId}
        onSearch={debouncedSearch}
        isCreator={isCreator}
      />
      <div className="class-details-content">

        <div className="class-details-back">
          <FaArrowLeft onClick={handleClassBack} />
        </div>

        {loading ? (
          <p>Loading videos...</p>
        ) : searchResults ? (
          <>
            {searchResults.titleMatches.length > 0 && (
              <VideosGrid
                videos={searchResults.titleMatches}
                title="Videos matching title"
              />
            )}
            {searchResults.topicMatches.length > 0 && (
              <VideosGrid
                videos={searchResults.topicMatches}
                title="Videos matching topics"
              />
            )}
            {searchResults.titleMatches.length === 0 &&
              searchResults.topicMatches.length === 0 && (
                <p>No videos found matching your search.</p>
              )}
          </>
        ) : (
          <VideosGrid videos={videos} title="All Videos" />
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this video?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="cancel-button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ClassDetails;
