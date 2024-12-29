import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");
  const [newDate, setNewDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const onLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);

        // Store the token and username in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username); // Store the username

        setIsLoggedIn(true);
        alert("Login successful!");

        fetchEvents(); // Fetch events after login
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/events", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use the correct Authorization header format
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEvents(data); // Set the fetched events in the state
      } else {
        alert(data.message || "Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("An error occurred while fetching events.");
    }
  };

  const handleAddEvent = async () => {
    if (newEvent && newDate && eventDescription) {
      const event = {
        eventName: newEvent,
        date: newDate,
        description: eventDescription, // Send description as well
      };

      try {
        const response = await fetch("http://localhost:5001/api/events/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"), // Ensure the token is included
          },
          body: JSON.stringify(event),
        });

        const data = await response.json();
        if (response.ok) {
          // Update the events state with the response from the server
          setEvents((prevEvents) => [...prevEvents, data]);
          setNewEvent("");
          setNewDate("");
          setEventDescription("");
        } else {
          alert(data.message || "Failed to add event");
        }
      } catch (error) {
        console.error("Error while adding event:", error);
        alert("An error occurred while adding the event.");
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== id)
        );
        alert(data.message || "Event deleted");
      } else {
        alert(data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents(); // Fetch events when the user is logged in
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={onLogin} />;
  }

  return (
    <Router>
      <div className="app">
        <h1>Reminder Website</h1>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <div className="events">
                {events
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((event) => (
                    <div key={event._id} className="event-card">
                      <div className="event-header">
                        <span className="event-date">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3>{event.eventName}</h3>
                      <p>{event.description}</p>
                      <p>Uploaded by: {event.uploadedBy || "Unknown"}</p>
                      <button onClick={() => handleDeleteEvent(event._id)}>
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            }
          />
          <Route
            path="/add-event"
            element={
              <div className="input-section">
                <input
                  type="text"
                  placeholder="Event Name"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                />
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                <textarea
                  placeholder="Event Description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
                <button onClick={handleAddEvent}>Add Event</button>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
