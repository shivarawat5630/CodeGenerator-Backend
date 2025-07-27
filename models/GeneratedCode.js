const mongoose = require('mongoose');

const generatedCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatHistory' },
  prompt: String,
  jsx: String,
  css: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GeneratedCode', generatedCodeSchema);
