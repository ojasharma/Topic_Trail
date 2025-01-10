const fs = require("fs").promises;
const path = require("path");
const WhisperService = require("./WhisperService");

async function testWhisperTranscription() {
  try {
    console.log("Reading audio file...");
    const audioBuffer = await fs.readFile(path.join(__dirname, "audio.mp3"));

    console.log(
      "Audio file size:",
      (audioBuffer.length / (1024 * 1024)).toFixed(2),
      "MB"
    );

    console.log("Starting transcription...");
    console.time("Transcription time");

    const transcription = await WhisperService.transcribe(audioBuffer);

    console.timeEnd("Transcription time");

    console.log("\nTranscription result:");
    console.log("-------------------");
    console.log(transcription);
    console.log("-------------------");

    // Save transcription to a file
    await fs.writeFile(
      path.join(__dirname, "transcription.txt"),
      transcription,
      "utf-8"
    );
    console.log("\nTranscription saved to transcription.txt");
  } catch (error) {
    console.error("Test failed:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
  }
}

// Check if environment variables are set
if (!process.env.HUGGINGFACE_API_KEY || !process.env.HUGGINGFACE_WHISPER_URL) {
  console.error(
    "Please set HUGGINGFACE_API_KEY and HUGGINGFACE_WHISPER_URL environment variables"
  );
  process.exit(1);
}

// Run the test
testWhisperTranscription();
