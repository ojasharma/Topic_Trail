require("dotenv").config();
const Groq = require("groq-sdk");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function chunkText(text, maxWords = 2000) {
  console.log("📏 Splitting text into chunks...");
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }

  console.log(`📦 Created ${chunks.length} chunks of text`);
  return chunks;
}

async function generateStructuredSummary(text) {
  if (!text) {
    throw new Error("Text content is required");
  }

  try {
    console.log("🔍 Analyzing text length...");
    const words = text.split(/\s+/).length;
    console.log(`📊 Text contains ${words} words`);

    // If text is within limit, process normally
    if (words <= 2000) {
      console.log("✨ Text within limit, processing as single chunk");
      return await processSingleChunk(text);
    }

    console.log("🔄 Text exceeds limit, initiating chunk processing");
    const chunks = chunkText(text);
    let allResults = [];
    let lastTopic = null;

    // Process first chunk
    console.log("🎯 Processing first chunk...");
    const firstChunkResults = await processSingleChunk(chunks[0]);

    if (chunks.length === 1) {
      console.log("✅ Single chunk processed successfully");
      allResults = firstChunkResults;
    } else {
      console.log("📎 Storing first chunk results (excluding last topic)");
      allResults = firstChunkResults.slice(0, -1);
      lastTopic = firstChunkResults[firstChunkResults.length - 1];
    }

    // Process remaining chunks
    for (let i = 1; i < chunks.length; i++) {
      console.log(`🔄 Processing chunk ${i + 1} of ${chunks.length}`);
      const isLastChunk = i === chunks.length - 1;
      const chunkResults = await processChunkWithContext(chunks[i], lastTopic);

      if (isLastChunk) {
        console.log("🏁 Processing final chunk, keeping all topics");
        allResults = [...allResults, ...chunkResults];
      } else {
        console.log(
          "📎 Storing intermediate chunk results (excluding last topic)"
        );
        allResults = [...allResults, ...chunkResults.slice(0, -1)];
        lastTopic = chunkResults[chunkResults.length - 1];
      }
    }

    console.log(`✅ All chunks processed. Total topics: ${allResults.length}`);
    return allResults;
  } catch (error) {
    console.error("🚨 Processing error:", error.message);
    console.error("🔍 Full error:", error);
    throw new Error("Summary generation failed");
  }
}

async function processSingleChunk(text) {
  console.log("🎯 Processing chunk with Groq API...");
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `[Strictly adhere to the formatting rules] Your reply should be in JSON format where each key is a topic and the value of the key is the topic's summary. ALL TOPICS SHOULD HAVE A CORRESPONDING SUMMARY.THE SUMMARY SHOULD BE A BREIF OF WHAT'S INSIDE THE TEXT(PHRASE IT LIKE: The instructr says that...) The topics should be chronological according to the lecture script I am providing (Don't create useless topics they should be relevant to the topics). Descriptive 100 words of summary for each topic. Text: "${text}"`,
      },
    ],
  });

  if (!response || !response.choices || !response.choices.length) {
    console.error("❌ Invalid response from Groq API");
    throw new Error("Invalid response from Groq API");
  }

  const structuredSummary =
    response.choices[0]?.message?.content || "No summary generated.";
  return parseStructuredSummary(structuredSummary);
}

async function processChunkWithContext(chunk, lastTopic) {
  console.log("🔄 Processing chunk with context...");
  console.log(`📌 Last topic: ${lastTopic.title}`);

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `Title: "${lastTopic.title}"
Summary: "${lastTopic.content}"

Alright ,  so above is the last topic/summary of the previous chunk of the transcription of this lecture video,
Now , I am giving you the continuation of that transcription,
You have to create topic and summary for the give continuation but i have given you the last topic/summary becasue i want you to take the decision that you either start with that topic(when the given continuation's start is about something new) or Start with this topic and summary and adding the additional details given in this continutaiton to the summary.
After that Generate a structured summary of the main educational content only. Ignore any:
        - Like and subscribe reminders
        - Sponsor segments
        - Video outro segments
        - Social media promotions
        - Merchandise promotions
        - Channel-related announcements
      
Your reply should be in JSON format where each key is a topic and the value of the key is the topic's summary. ALL TOPICS SHOULD HAVE A CORRESPONDING SUMMARY. The summary should be a brief of what's inside the text (phrase it like: The instructor says that...). The topics should be chronological according to the lecture script (Don't create useless topics - they should be relevant to the core educational content). Provide descriptive 100 words of summary for each topic.
But this JSON should start with that initial decision's result only.

Text: "${chunk}"`,
      },
    ],
  });

  if (!response || !response.choices || !response.choices.length) {
    console.error("❌ Invalid response from Groq API");
    throw new Error("Invalid response from Groq API");
  }

  const structuredSummary =
    response.choices[0]?.message?.content || "No summary generated.";
  return parseStructuredSummary(structuredSummary);
}

function parseStructuredSummary(content) {
  try {
    console.log("📝 Raw Summary Content:", content);

    let jsonContent;
    if (typeof content === "string") {
      console.log("🧹 Cleaning JSON content...");
      const cleanContent = content.trim().replace(/```json\s*|\s*```/g, "");
      jsonContent = JSON.parse(cleanContent);
    } else {
      jsonContent = content;
    }

    console.log("🔄 Converting to array format...");
    const result = Object.entries(jsonContent).map(([title, content]) => ({
      title: title.trim(),
      content: content.trim(),
    }));

    console.log("✅ Validating topics and summaries...");
    result.forEach((item, index) => {
      if (!item.title || !item.content) {
        throw new Error(
          `Invalid summary item at index ${index}: missing title or content`
        );
      }

      if (typeof item.title !== "string" || typeof item.content !== "string") {
        throw new Error(
          `Invalid summary item at index ${index}: title and content must be strings`
        );
      }
    });

    console.log(`✨ Successfully processed ${result.length} topics`);

    if (result.length === 0) {
      throw new Error("No topics and summaries could be extracted");
    }

    return result;
  } catch (error) {
    console.error("❌ Summary parsing error:", error);
    throw new Error(`Failed to parse structured summary: ${error.message}`);
  }
}

module.exports = {
  generateStructuredSummary,
};
