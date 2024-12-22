const axios = require("axios");
const FormData = require("form-data");

class WhisperService {
  static async transcribe(audioBuffer) {
    const formData = new FormData();
    formData.append("audio", audioBuffer, {
      filename: "audio.mp3",
      contentType: "audio/mp3",
    });

    try {
      const response = await axios.post(
        process.env.HUGGINGFACE_WHISPER_URL,
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            ...formData.getHeaders(),
          },
          maxBodyLength: Infinity,
        }
      );

      return response.data.text;
    } catch (error) {
      console.error(
        "Whisper API error:",
        error.response?.data || error.message
      );
      throw new Error("Transcription failed");
    }
  }
}

module.exports = WhisperService;
