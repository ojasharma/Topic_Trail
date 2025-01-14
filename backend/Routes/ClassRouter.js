const express = require("express");
const ensureAuthenticated = require("../Middlewares/Auth");
const {
  createClass,
  joinClass,
  getUserClasses,
  leaveClass,
  deleteClass,
  removeMember, // Import the removeMember function
  getClassById, // Import the getClassMembers function
} = require("../Controllers/ClassController");

const router = express.Router();

// Create a class
router.post("/create", ensureAuthenticated, createClass);

// Join a class
router.post("/join", ensureAuthenticated, joinClass);

// Get all classes for the logged-in user
router.get("/", ensureAuthenticated, getUserClasses);

// Leave a class
router.delete("/:classId/leave", ensureAuthenticated, leaveClass);

// Delete a class (only by the creator)
router.delete("/:classId", ensureAuthenticated, deleteClass);

// Remove a member from a class (only by the creator)
router.delete("/:classId/remove/:memberId", ensureAuthenticated, removeMember);

// Get members of a specific class
router.get("/:classId", ensureAuthenticated, getClassById);

module.exports = router;
