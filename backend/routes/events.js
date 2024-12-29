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
    req.username = decoded.username; // Add the username to the request
    next();
  } catch (error) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

router.post("/add", verifyToken, async (req, res) => {
  try {
    const { eventName, date, description } = req.body;

    if (!eventName || !date) {
      return res
        .status(400)
        .json({ message: "Event name and date are required" });
    }

    const newEvent = new Event({
      eventName,
      date,
      description,
      uploadedBy: req.username, // Use the username from the token
      createdBy: req.user, // User ID stored in createdBy
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
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
