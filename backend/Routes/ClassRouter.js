const express = require("express");
const ensureAuthenticated = require("../Middlewares/Auth");
const {
  createClass,
  joinClass,
  getUserClasses,
  leaveClass,
} = require("../Controllers/ClassController");

// console.log({ ensureAuthenticated });
// console.log({ createClass, joinClass, getUserClasses, leaveClass });

const router = express.Router();

// Create a class
router.post("/create", ensureAuthenticated, createClass);

// Join a class
router.post("/join", ensureAuthenticated, joinClass);

// Get all classes for the logged-in user
router.get("/", ensureAuthenticated, getUserClasses);

// Leave a class
router.delete("/:classId/leave", ensureAuthenticated, leaveClass);

module.exports = router;
