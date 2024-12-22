const axios = require("axios");

class LlamaService {
  static async generateSummary(transcription) {
    const prompt = `
      Analyze this video transcription and provide a topic-wise summary:

      ${transcription}

      Format your response as:
      - Topic Title
        Key points and summary of the topic
      
      Focus on main topics and their core content.`;

    try {
      const response = await axios.post(
        process.env.HUGGINGFACE_LLAMA_URL,
        {
          inputs: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return this.parseTopics(response.data[0].content);
    } catch (error) {
      console.error("Llama API error:", error.response?.data || error.message);
      throw new Error("Summary generation failed");
    }
  }

  static parseTopics(content) {
    const topics = [];
    const topicRegex = /- (.*?)\n([\s\S]*?)(?=- |$)/g;
    let match;

    while ((match = topicRegex.exec(content)) !== null) {
      topics.push({
        title: match[1].trim(),
        content: match[2].trim(),
      });
    }

    return topics;
  }
}

module.exports = LlamaService;
