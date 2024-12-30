const express = require("express");
const Event = require("../models/Event");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; 
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
// Get Events
router.get("/", verifyToken, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Remove the filter on createdBy
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Event
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    // Find the event by ID
    const event = await Event.findById(req.params.id);

    // If the event doesn't exist
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the event was created by the logged-in user
    if (event.createdBy.toString() !== req.user.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this event" });
    }

    // If the event was created by the logged-in user, delete it
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
