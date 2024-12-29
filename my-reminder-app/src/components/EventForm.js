import React, { useState } from "react";

const EventForm = ({ onAddEvent }) => {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [addedBy, setAddedBy] = useState(""); // "me" or "friend"

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date && description && addedBy) {
      onAddEvent({ date, description, addedBy });
      setDate("");
      setDescription("");
      setAddedBy("");
    } else {
      alert("Please fill all fields!");
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Event description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select
        value={addedBy}
        onChange={(e) => setAddedBy(e.target.value)}
        required
      >
        <option value="">Who added?</option>
        <option value="me">Me</option>
        <option value="friend">Friend</option>
      </select>
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
