import React, { useState } from "react";
import { FaPlus, FaUser } from "react-icons/fa"; // Using React Icons for plus and profile icons
import "./Header.css"; 
import Modal from "./Modal";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // State to track which modal to show
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const handleOpenModal = (type) => {
    setModalType(type); // Set modal type to either "create" or "join"
    setIsModalOpen(true); // Open the modal
    setIsDropdownOpen(false); // Close the dropdown
  };

  const handleCloseModal = () => setIsModalOpen(false); // Close the modal

  return (
    <header>
      <div className="logo">
      <img src="/logo.png" alt="Topic Trail Logo" className="logo-img" />
      </div>
      <div className="icons">
        <FaUser className="profile-icon" />
        <div className="plus-container">
          <FaPlus className="plus-icon" onClick={toggleDropdown} />
          {isDropdownOpen && (
            <ul className="dropdown-menu">
            <li className="dropdown-item" onClick={() => handleOpenModal("create")}>Create Class</li>
            <li className="dropdown-item" onClick={() => handleOpenModal("join")}>Join Class</li>
          </ul>
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} type={modalType} />    
    </header>
  );
};

export default Header;
