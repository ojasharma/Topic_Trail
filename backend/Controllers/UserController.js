const User = require("../Models/User");
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const Class = require("../Models/Class");
const Video = require("../Models/Video");
const cloudinary = require("cloudinary").v2;


const uploadProfilePicture = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Delete old profile picture from cloudinary if it exists
    if (user.profilePicture) {
      try {
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting old profile picture:", error);
      }
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "profile_pictures",
      resource_type: "auto",
    });

    // Update user profile picture URL
    user.profilePicture = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }

    if (currentPassword && newPassword) {
      const isValid = await bcryptjs.compare(currentPassword, user.password);
      if (!isValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all classes where user is creator
    const userClasses = await Class.find({ creator: userId });

    // Delete all videos from each class
    for (const classObj of userClasses) {
      const videos = await Video.find({ classId: classObj._id });

      // Delete videos from Cloudinary and database
      for (const video of videos) {
        try {
          const publicId = video.cloudinaryUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
          await Video.findByIdAndDelete(video._id);
        } catch (error) {
          console.error(`Error deleting video ${video._id}:`, error);
        }
      }

      // Delete the class
      await Class.findByIdAndDelete(classObj._id);
    }

    // Delete user from all classes they are a member of
    await Class.updateMany({ members: userId }, { $pull: { members: userId } });

    // Delete profile picture from cloudinary if it exists
    const user = await User.findById(userId);
    if (user && user.profilePicture) {
      try {
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting profile picture:", error);
      }
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};

module.exports = {
  uploadProfilePicture,
  updateUserProfile,
  getUserById,
  deleteAccount,
};