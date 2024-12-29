const express = require("express");
const Event = require("../models/Event");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

// Add Event
// Add Event (Updated to include description)
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { eventName, date, addedBy, description } = req.body;

    if (!eventName || !date || !addedBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEvent = new Event({
      eventName,
      date,
      addedBy,
      createdBy: req.user,
      description,  // Added description if provided
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Events
router.get("/", verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Event
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
