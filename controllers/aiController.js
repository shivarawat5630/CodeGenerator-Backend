const Groq = require("groq-sdk");
const GeneratedCode = require("../models/GeneratedCode");
const ChatHistory = require("../models/ChatHistory");

// Initialize Groq client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

exports.generateComponent = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.session.userId;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const fullPrompt = `
You are an AI assistant specialized in generating React components.

Your job is to create clean, optimized, and production-ready React JSX components using Tailwind CSS based entirely on user prompts.

Guidelines:
- Always respond with valid React component code.
- Use Tailwind CSS for all styling.
- Avoid unnecessary explanations unless the user asks for them.
- Focus only on React component generation, not backend code.


Prompt:
${prompt}
`;

    // Groq chat request
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",      // ✅ Updated model
      messages: [
        { role: "system", content: "You are a coding assistant." },
        { role: "user", content: fullPrompt }
      ],
      temperature: 0.6
    });

    const aiContent = completion.choices[0]?.message?.content || "";

    // Extract JSX & CSS
    const jsxMatch = aiContent.match(/<[^>]+>[\s\S]*?<\/[^>]+>/);
    const cssMatch = aiContent.match(/```css([\s\S]*?)```/);

    const jsx = jsxMatch ? jsxMatch[0] : "";
    const css = cssMatch ? cssMatch[1].trim() : "";

    // Save chat and code
    const chat = await ChatHistory.create({
      userId,
      prompt,
      response: aiContent
    });

    const code = await GeneratedCode.create({
      userId,
      jsx,
      css,
      prompt,
      chatId: chat._id
    });

    res.status(200).json(code);

  } catch (error) {
    console.error("Groq generation error:", error?.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to generate component" });
  }
};
