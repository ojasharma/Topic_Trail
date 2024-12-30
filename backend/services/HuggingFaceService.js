const https = require("https");
const { HfInference } = require("@huggingface/inference");
const axios = require("axios");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Disable SSL verification

const HUGGINGFACE_API_KEY = "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";

// Create a client for Hugging Face Inference
const client = new HfInference(HUGGINGFACE_API_KEY);

async function generateStructuredSummary(text) {
  if (!text) {
    throw new Error("Text content is required");
  }

  try {
    // Request structured summary from the model
    const response = await client.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        {
          role: "user",
          content: `[Strictly adhere to the formatting rules] Your reply should be in JSON format where each key is a topic and the value of the key is the topic's summary. ALL TOPICS SHOULD HAVE A CORRESPONDING SUMMARY.THE SUMMARY SHOULD BE A BREIF OF WHAT'S INSIDE THE TEXT(PHRASE IT LIKE: The instructr says that...) The topics should be chronological according to the lecture script I am providing. Descriptive 100 words of summary for each topic. Text: "${text}"`,
        },
      ],
      max_tokens: 4000,
    });

    if (!response || !response.choices || !response.choices.length) {
      throw new Error("Invalid response from Hugging Face API");
    }

    const structuredSummary =
      response.choices[0].message.content || "No summary generated.";
    return parseStructuredSummary(structuredSummary);
  } catch (error) {
    console.error("HuggingFace API error:", error.message);
    console.error("Full error:", error); // Log full error details
    throw new Error("Summary generation failed");
  }
}

function parseStructuredSummary(content) {
  try {
    console.log("Raw Summary Content:", content);

    // First, try to parse the JSON string if it isn't already an object
    let jsonContent;
    if (typeof content === "string") {
      // Remove any leading/trailing whitespace and handle potential markdown code block syntax
      const cleanContent = content.trim().replace(/```json\s*|\s*```/g, "");
      jsonContent = JSON.parse(cleanContent);
    } else {
      jsonContent = content;
    }

    // Transform the JSON object into an array of SummaryItemSchema-compatible objects
    const result = Object.entries(jsonContent).map(([title, content]) => ({
      title: title.trim(),
      content: content.trim(),
    }));

    // Validate the structure
    result.forEach((item, index) => {
      if (!item.title || !item.content) {
        throw new Error(
          `Invalid summary item at index ${index}: missing title or content`
        );
      }

      // Ensure title and content are strings
      if (typeof item.title !== "string" || typeof item.content !== "string") {
        throw new Error(
          `Invalid summary item at index ${index}: title and content must be strings`
        );
      }
    });

    console.log("Final Processed Result:", result);

    if (result.length === 0) {
      throw new Error("No topics and summaries could be extracted");
    }

    return result;
  } catch (error) {
    console.error("Parsing error:", error);
    throw new Error(`Failed to parse structured summary: ${error.message}`);
  }
}

module.exports = {
  generateStructuredSummary,
};
