const Session = require("../models/Session");

const createSession = async (req, res) => {
  try {
    const session = new Session({ user: req.user.id });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error("Create Session Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error("Get Sessions Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (err) {
    console.error("Get Session Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createSession, getSessions, getSessionById };
