const axios = require('axios');
const GeneratedCode = require('../models/GeneratedCode');
const ChatHistory = require('../models/ChatHistory');

exports.generateComponent = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.session.userId;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-4o',
        max_tokens: 2000,
        messages: [
          {
            role: 'system',
            content: `You are a full-stack AI coding assistant.
You can answer any kind of question related to frontend (React, Tailwind CSS, Next.js, etc.) and backend (Node.js, Express, MongoDB, PostgreSQL, etc.) technologies.
When asked to generate UI, return clean and optimized React JSX using Tailwind CSS.
When asked about backend, provide structured and secure Node.js or Express code.
Always include explanations when appropriate.`
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiContent = response.data.choices[0].message.content;

    const jsxMatch = aiContent.match(/<[^>]+>[\s\S]*?<\/[^>]+>/);
    const cssMatch = aiContent.match(/```css([\s\S]*?)```/);

    const jsx = jsxMatch ? jsxMatch[0] : '';
    const css = cssMatch ? cssMatch[1].trim() : '';

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

    // Send the entire saved document back (includes _id, jsx, css, chatId)
    res.status(200).json(code);

  } catch (error) {
    console.error('AI generation error:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to generate component' });
  }
};
