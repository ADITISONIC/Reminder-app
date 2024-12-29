import React, { useState } from "react";

const EventForm = ({ onAddEvent, username }) => {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (eventName && date && description) {
      onAddEvent({ eventName, date, description, uploadedBy: username });
      setEventName("");
      setDate("");
      setDescription("");
    } else {
      alert("Please fill all fields!");
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        required
      />
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
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
