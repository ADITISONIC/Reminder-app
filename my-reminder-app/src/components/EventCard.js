import React from "react";

const EventCard = ({ event, onDeleteEvent }) => {
  // Style based on the username, you can customize this as per your needs
  const cardStyle =
    event.uploadedBy === "me"
      ? { backgroundColor: "#D1E8E4" }
      : { backgroundColor: "#FFD1DC" };

  return (
    <div className="event-card" style={cardStyle}>
      <h3>{new Date(event.date).toLocaleDateString()}</h3>
      <p>{event.description}</p>
      <p>Uploaded by: {event.uploadedBy}</p> {/* Show the username */}
      <button onClick={() => onDeleteEvent(event._id)}>Delete</button>
    </div>
  );
};

export default EventCard;
