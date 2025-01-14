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
const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type - only JPEG, JPG, or PNG allowed"));
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
// Note: Order matters! More specific routes should come before dynamic routes

// 1. Static routes first
router.get("/search", ensureAuthenticated, VideoController.searchVideos);

// 2. Class-specific routes
router.get(
  "/class/:classId",
  ensureAuthenticated,
  VideoController.getClassVideos.bind(VideoController)
);

// 3. Upload route
router.post(
  "/upload",
  ensureAuthenticated,
  upload.single("video"),
  VideoController.uploadVideo.bind(VideoController)
);

// 4. Dynamic routes last (to avoid catching static routes)
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
router.post("/:videoId/notes", ensureAuthenticated, VideoController.addNote);

router.get("/:videoId/notes", ensureAuthenticated, VideoController.getNotes);

router.put(
  "/:videoId/summary",
  ensureAuthenticated,
  VideoController.updateSummary
);
router.delete(
  "/:videoId/summary/:topicId",
  ensureAuthenticated,
  VideoController.deleteSummaryTopic
);
router.post(
  "/:videoId/generate-quiz",
  ensureAuthenticated,
  VideoController.generateQuiz
);

// Assignment routes
router.post(
  "/:videoId/assignment",
  ensureAuthenticated,
  VideoController.addAssignment
);
router.get(
  "/:videoId/assignment",
  ensureAuthenticated,
  VideoController.getAssignment
);
router.post(
  "/:videoId/assignment/submit",
  ensureAuthenticated,
  imageUpload.single("image"),
  VideoController.submitAssignment
);
router.get(
  "/:videoId/assignment/submissions",
  ensureAuthenticated,
  VideoController.getSubmissions
);

module.exports = router;
