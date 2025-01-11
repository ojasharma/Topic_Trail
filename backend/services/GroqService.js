const Groq = require("groq-sdk");

class GroqService {
  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async generateQuiz(
    summaryItems,
    numberOfQuestions,
    difficulty,
    additionalInstructions = ""
  ) {
    try {
      const prompt = this._constructQuizPrompt(
        summaryItems,
        numberOfQuestions,
        difficulty,
        additionalInstructions
      );

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a quiz generation AI. You must respond with ONLY a valid JSON object containing MCQs without any markdown formatting or code blocks. Do not include any explanatory text or code block markers.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from Groq API");
      }

      // Clean the response of any markdown or code block markers
      const cleanedResponse = this._cleanResponse(response);

      // Parse the response to ensure it matches our expected format
      const parsedQuiz = JSON.parse(cleanedResponse);
      return this._validateQuizFormat(parsedQuiz);
    } catch (error) {
      console.error("Raw response:", error);
      throw new Error(`Failed to generate quiz: ${error.message}`);
    }
  }

  _cleanResponse(response) {
    // Remove markdown code block indicators and any surrounding whitespace
    let cleaned = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // If the response starts with a newline, remove it
    cleaned = cleaned.replace(/^\n+/, "");

    // If the response ends with a newline, remove it
    cleaned = cleaned.replace(/\n+$/, "");

    return cleaned;
  }

  _constructQuizPrompt(
    summaryItems,
    numberOfQuestions,
    difficulty,
    additionalInstructions
  ) {
    const formattedTopics = summaryItems
      .map((item) => `Topic: ${item.title}\nContent: ${item.content}`)
      .join("\n\n");

    return `
      Based on these lecture topics and their content:

      ${formattedTopics}
    
      Generate a multiple choice quiz with these exact requirements:
      1. Exactly ${numberOfQuestions} questions
      2. Difficulty level: ${difficulty}
      3. ${additionalInstructions}
    [But the thing is you do not have to only generate questions which are about the video and what happened in it , 
    most questions should be about the topic , you should look at topics being explained in the content and use them for creating the questions from your knowledge.]
      IMPORTANT: You must respond with ONLY a valid JSON object in this exact format:
      {
        "mcqs": [
          {
            "question": "question text here",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswerIndex": 0,
            "explanation": "explanation here"
          }
        ]
      }

      Rules:
      - Format must be exactly as shown above
      - No markdown, no code blocks, just the raw JSON
      - Each question must have exactly 4 options
      - correctAnswerIndex must be 0-3
      - All JSON must be valid
      - Questions should match ${difficulty} difficulty:
        ${this._getDifficultyGuidelines(difficulty)}
    `;
  }

  _getDifficultyGuidelines(difficulty) {
    const guidelines = {
      easy: "Focus on basic concept recognition and simple recall from individual topics. Questions should be straightforward.",
      medium:
        "Include application of concepts and some analysis. Questions may require connecting information from related topics.",
      hard: "Focus on complex analysis, evaluation, and synthesis across multiple topics. Include challenging scenarios that require deep understanding.",
    };
    return guidelines[difficulty.toLowerCase()] || guidelines.medium;
  }

  _validateQuizFormat(quiz) {
    if (!quiz.mcqs || !Array.isArray(quiz.mcqs)) {
      throw new Error("Invalid quiz format: mcqs array is missing");
    }

    quiz.mcqs.forEach((question, index) => {
      if (
        !question.question ||
        !question.options ||
        !Array.isArray(question.options) ||
        typeof question.correctAnswerIndex !== "number" ||
        !question.explanation
      ) {
        throw new Error(`Invalid question format at index ${index}`);
      }

      if (question.options.length !== 4) {
        throw new Error(
          `Question at index ${index} must have exactly 4 options`
        );
      }

      if (
        question.correctAnswerIndex < 0 ||
        question.correctAnswerIndex >= question.options.length
      ) {
        throw new Error(`Invalid correctAnswerIndex at question ${index}`);
      }
    });

    return quiz;
  }
}

module.exports = GroqService;
