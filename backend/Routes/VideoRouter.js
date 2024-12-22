const express = require("express");
const multer = require("multer");
const path = require("path");
const VideoController = require("../Controllers/VideoController");
const ensureAuthenticated = require("../Middlewares/Auth");

const router = express.Router();

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type - only MP4, MOV, or AVI allowed"));
  },
});

// Routes with bound controller methods
router.post(
  "/upload",
  ensureAuthenticated,
  upload.single("video"),
  VideoController.uploadVideo.bind(VideoController)
);

router.get(
  "/class/:classId",
  ensureAuthenticated,
  VideoController.getClassVideos.bind(VideoController)
);

router.get(
  "/:videoId",
  ensureAuthenticated,
  VideoController.getVideo.bind(VideoController)
);

router.delete(
  "/:videoId",
  ensureAuthenticated,
  VideoController.deleteVideo.bind(VideoController)
);

module.exports = router;
