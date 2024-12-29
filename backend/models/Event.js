const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  addedBy: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
