import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./UserProfile.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setError("Missing token or userId in local storage.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("Missing token or userId in local storage.");
      return;
    }

    try {
      const response = await axios.delete(`${baseUrl}users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Account deleted successfully.");
      // Redirect to home or login page after deletion
      window.location.href = "/home";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* Header */}
      <header className={styles.header}>
        <Link to="/home">
          <img src="./logo_dark.png" alt="Logo" className={styles.logo} />
        </Link>
      </header>

      {/* Profile Content */}
      <div className={styles.profileContainer}>
        <div className={styles.profilePictureContainer}>
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className={styles.profilePicture}
          />
        </div>

        <div className={styles.infoContainer}>
          <div className={styles.infoRow}>
            <label className={styles.label}>Name:</label>
            <span className={styles.value}>{user.name}</span>
          </div>
          <div className={styles.infoRow}>
            <label className={styles.label}>Email:</label>
            <span className={styles.value}>{user.email}</span>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className={styles.deleteAccountContainer}>
          <button className={styles.deleteButton} onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
