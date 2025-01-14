// Header.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Sun, Moon, Settings, LogOut } from "lucide-react";
import "./Header.css";
import Modal from "./Modal";
const baseUrl = import.meta.env.VITE_BASE_URL;

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profilePicture, setProfilePicture] = useState("/placeholder_pfp.png");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDarkMode(savedTheme === "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`${baseUrl}users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }

          const { user } = await response.json();
          setProfilePicture(user.profilePicture || "/placeholder_pfp.png");
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfilePicture("/placeholder_pfp.png");
        }
      };

      fetchUserProfile();
    } else {
      setProfilePicture("/placeholder_pfp.png");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
    setIsDropdownOpen(false);
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.open("/"); // Opens the "/" route in the current tab
  };

  return (
    <header className={`header ${isDarkMode ? "dark" : ""}`}>
      <div className="logo" onClick={handleLogoClick}>
        <img
          src={isDarkMode ? "/logo_dark.png" : "/logo.png"}
          alt="Topic Trail Logo"
          className="logo-img"
        />
      </div>
      <div className="icons">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="plus-container">
          <FaPlus className="plus-icon" onClick={toggleDropdown} />
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li
                className="dropdown-item"
                onClick={() => handleOpenModal("create")}
              >
                Create Class
              </li>
              <li
                className="dropdown-item"
                onClick={() => handleOpenModal("join")}
              >
                Join Class
              </li>
            </ul>
          )}
        </div>
        <div className="profile-container">
          <button className="profile-button" onClick={toggleProfileDropdown}>
            <img
              src={profilePicture}
              alt="Profile"
              className="profile-picture"
            />
          </button>
          {isProfileDropdownOpen && (
            <ul className="dropdown-menu profile-dropdown">
              <li
                className="dropdown-item"
                onClick={() => navigate("/profile")}
              >
                <Settings size={16} className="dropdown-icon" />
                Profile Settings
              </li>
              <li className="dropdown-item" onClick={handleLogout}>
                <LogOut size={16} className="dropdown-icon" />
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          type={modalType}
        />
      )}
    </header>
  );
};

export default Header;
