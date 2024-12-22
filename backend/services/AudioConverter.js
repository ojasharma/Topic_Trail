const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

class AudioConverter {
  static async downloadVideo(url, outputPath) {
    try {
      const response = await axios({
        method: "get",
        url: url,
        responseType: "arraybuffer",
      });

      await writeFile(outputPath, response.data);
      return outputPath;
    } catch (error) {
      console.error("Video download error:", error);
      throw new Error("Failed to download video");
    }
  }

  static async convertToAudio(videoPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .toFormat("mp3")
        .on("end", () => resolve(outputPath))
        .on("error", (err) =>
          reject(new Error(`Audio conversion failed: ${err.message}`))
        )
        .save(outputPath);
    });
  }

  static async cleanupFiles(...filePaths) {
    for (const filePath of filePaths) {
      try {
        if (fs.existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.error(`Failed to delete file ${filePath}:`, error);
      }
    }
  }

  static async videoToAudio(videoUrl) {
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const videoPath = path.join(tempDir, `${Date.now()}_video.mp4`);
    const audioPath = path.join(tempDir, `${Date.now()}_audio.mp3`);

    try {
      await this.downloadVideo(videoUrl, videoPath);
      await this.convertToAudio(videoPath, audioPath);

      const audioBuffer = fs.readFileSync(audioPath);
      return audioBuffer;
    } finally {
      await this.cleanupFiles(videoPath, audioPath);
    }
  }
}

module.exports = AudioConverter;
