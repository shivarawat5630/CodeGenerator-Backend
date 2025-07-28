const { GoogleGenerativeAI } = require('@google/generative-ai');
const GeneratedCode = require('../models/GeneratedCode');
const ChatHistory = require('../models/ChatHistory');

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateComponent = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.session.userId;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // ✅ Use the correct model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    // ✅ Gemini expects a plain text prompt
    const fullPrompt = `You are a full-stack AI coding assistant.

When asked to generate UI, return clean and optimized React JSX using Tailwind CSS.
When asked about backend, provide secure Node.js/Express code.

Prompt:
${prompt}`;

    // ✅ Call generateContent with a string
    const result = await model.generateContent(fullPrompt);

    // ✅ Get the response text
    const aiContent = result.response.text();

    // ✅ Extract JSX and CSS using regex
    const jsxMatch = aiContent.match(/<[^>]+>[\s\S]*?<\/[^>]+>/);
    const cssMatch = aiContent.match(/```css([\s\S]*?)```/);

    const jsx = jsxMatch ? jsxMatch[0] : '';
    const css = cssMatch ? cssMatch[1].trim() : '';

    // ✅ Save chat history and generated code
    const chat = await ChatHistory.create({
      userId,
      prompt,
      response: aiContent,
    });

    const code = await GeneratedCode.create({
      userId,
      jsx,
      css,
      prompt,
      chatId: chat._id,
    });

    res.status(200).json(code);
  } catch (error) {
    console.error('Gemini generation error:', error.message || error);
    res.status(500).json({ error: 'Failed to generate component' });
  }
};
