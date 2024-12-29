import React from "react";

const EventCard = ({ event, onDeleteEvent }) => {
  const cardStyle =
    event.addedBy === "me"
      ? { backgroundColor: "#D1E8E4" }
      : { backgroundColor: "#FFD1DC" };

  return (
    <div className="event-card" style={cardStyle}>
      <h3>{event.date}</h3>
      <p>{event.description}</p>
      <button onClick={() => onDeleteEvent(event._id)}>Delete</button>
    </div>
  );
};

export default EventCard;
