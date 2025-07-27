const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Session" },
    chatHistory: [
      {
        role: String, // "user" or "ai"
        content: String,
      },
    ],
    generatedCode: {
      jsx: String,
      css: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
