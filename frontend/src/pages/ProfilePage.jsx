import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import styles from "./UserProfile.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
        setNewName(response.data.user.name);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdateName = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      await axios.put(
        `${baseUrl}users/${userId}/profile`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser({ ...user, name: newName });
      setIsEditingName(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update name.");
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const response = await axios.post(
        `${baseUrl}users/${userId}/profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser({ ...user, profilePicture: response.data.url });
      setShowPictureModal(false);
      setSelectedFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload picture.");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match!");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      await axios.put(
        `${baseUrl}users/${userId}/profile`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Missing token in local storage.");
      return;
    }

    try {
      await axios.delete(`${baseUrl}users/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Account deleted successfully.");
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <header className={styles.header}>
        <Link to="/home">
          <img src="./logo_dark.png" alt="Logo" className={styles.logo} />
        </Link>
      </header>

      <div className={styles.profileContainer}>
        <div className={styles.profilePictureContainer}>
          <img
            src={user.profilePicture || "/placeholder_pfp.png"}
            alt="Profile"
            className={styles.profilePicture}
          />
          <button
            className={styles.iconButton}
            onClick={() => setShowPictureModal(true)}
            aria-label="Edit profile picture"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        <div className={styles.infoContainer}>
          <div className={styles.infoRow}>
            <label className={styles.label}>Name:</label>
            {isEditingName ? (
              <div className={styles.editNameContainer}>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={styles.input}
                />
                <button
                  className={styles.saveButton}
                  onClick={handleUpdateName}
                >
                  Save
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => setIsEditingName(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.nameContainer}>
                <span className={styles.value}>{user.name}</span>
                <button
                  className={styles.iconButton}
                  onClick={() => setIsEditingName(true)}
                  aria-label="Edit name"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className={styles.infoRow}>
            <label className={styles.label}>Email:</label>
            <span className={styles.value}>{user.email}</span>
          </div>
          <button
            className={styles.changePasswordButton}
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div>

        <div className={styles.deleteAccountContainer}>
          <button className={styles.deleteButton} onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>

      {/* Profile Picture Modal */}
      {showPictureModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Upload Profile Picture</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowPictureModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.saveButton}
                onClick={handleUploadPicture}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Change Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className={styles.input}
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className={styles.input}
            />
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.saveButton}
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
