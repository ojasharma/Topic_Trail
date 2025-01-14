const express = require("express");
const {
  getUserById,
  updateUserProfile,
  uploadProfilePicture,
  deleteAccount,
} = require("../Controllers/UserController");
const ensureAuthenticated = require("../Middlewares/Auth")
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/:id", getUserById);
router.put("/:id/profile",ensureAuthenticated, updateUserProfile);
router.post(
  "/:id/profile-picture",
  ensureAuthenticated,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.delete("/delete-account", ensureAuthenticated, deleteAccount);
module.exports = router;
