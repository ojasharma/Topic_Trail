const VideoModel = require("../Models/Video");
const CloudinaryService = require("../services/CloudinaryService");
const { processVideo } = require("../Utils/videoProcessing");

const cloudinaryService = new CloudinaryService();

const VideoController = {
  upload: cloudinaryService.upload.single("video"),

  async uploadVideo(req, res) {
    try {
      const { title, description, classId } = req.body;
      const videoFile = req.file;

      if (!videoFile) {
        return res.status(400).json({ error: "No video file provided" });
      }

      // Upload to Cloudinary
      const cloudinaryResult = await CloudinaryService.uploadVideo(videoFile);
      console.log("Cloudinary upload completed:", cloudinaryResult);

      // Create video document
      const video = new VideoModel({
        title,
        description,
        cloudinaryUrl: cloudinaryResult.url, // Now using the actual Cloudinary URL
        classId,
        creator: req.user._id,
        duration: cloudinaryResult.duration || 0,
        processingStatus: "pending",
      });
      await video.save();

      // Clean up temporary file
      await CloudinaryService.cleanup(videoFile.path);

      // Start processing pipeline
      processVideo(video._id).catch(console.error);

      res.status(201).json({
        message: "Video upload successful",
        videoId: video._id,
        status: "processing",
      });
    } catch (error) {
      console.error("Upload error:", error);
      // Clean up temporary file in case of error
      if (req.file) {
        await CloudinaryService.cleanup(req.file.path);
      }
      res.status(500).json({
        error: "Upload failed",
        details: error.message,
      });
    }
  },
  async getClassVideos(req, res) {
    try {
      const { classId } = req.params;
      const videos = await VideoModel.find({ classId })
        .sort("-createdAt")
        .select("-processingError");
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  },

  async getVideo(req, res) {
    try {
      const video = await VideoModel.findById(req.params.videoId);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch video" });
    }
  },

  async deleteVideo(req, res) {
    try {
      const video = await VideoModel.findById(req.params.videoId);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      if (video.creator.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const publicId = CloudinaryService.getPublicIdFromUrl(
        video.cloudinaryUrl
      );
      await CloudinaryService.deleteVideo(publicId);
      await video.deleteOne();

      res.json({ message: "Video deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Delete failed" });
    }
  },
};

module.exports = VideoController;
