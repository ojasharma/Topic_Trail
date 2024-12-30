import React, { useState, useEffect } from "react";
import { FaPlus, FaUser } from "react-icons/fa";
import { Sun, Moon } from "lucide-react"; // Using lucide icons for theme toggle
import "./Header.css";
import Modal from "./Modal";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initialize theme based on saved preference or default to light mode
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDarkMode(savedTheme === "dark");
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
    setIsDropdownOpen(false); // Close dropdown when a modal is triggered
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const handleLogoClick = () => {
    window.location.reload();
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
        {/* <FaUser className="profile-icon" /> */}
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
