// src/App.js

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router and Routes
import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");
  const [newDate, setNewDate] = useState("");
  const [addedBy, setAddedBy] = useState("");

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
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        alert("Login successful!");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in");
    }
  };

  const handleAddEvent = () => {
    if (newEvent && newDate && addedBy) {
      const event = { event: newEvent, date: newDate, addedBy };
      setEvents((prevEvents) => [...prevEvents, event]);
      setNewEvent("");
      setNewDate("");
      setAddedBy("");
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleDeleteEvent = (index) => {
    setEvents((prevEvents) => prevEvents.filter((_, i) => i !== index));
  };

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
                  .map((event, index) => (
                    <div
                      className={`event-card ${
                        event.addedBy === "Me" ? "my-event" : "friend-event"
                      }`}
                      key={index}
                    >
                      <h3>{event.event}</h3>
                      <p>Date: {event.date}</p>
                      <p>Added By: {event.addedBy}</p>
                      <button onClick={() => handleDeleteEvent(index)}>
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
                <select
                  value={addedBy}
                  onChange={(e) => setAddedBy(e.target.value)}
                >
                  <option value="">Added By</option>
                  <option value="Me">Me</option>
                  <option value="Friend">Friend</option>
                </select>
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
