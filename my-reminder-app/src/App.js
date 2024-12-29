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
  const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const eventsPerPage = 15;

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);

        setIsLoggedIn(true);
        alert("Login successful!");

        fetchEvents();
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await fetch("http://localhost:5001/api/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEvents(data);
      } else {
        alert(data.message || "Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      alert(error.message || "An error occurred while fetching events.");
    }
  };

  const handleAddEvent = async () => {
    if (newEvent && newDate && eventDescription) {
      const event = {
        eventName: newEvent,
        date: newDate,
        description: eventDescription,
      };

      try {
        const response = await fetch("http://localhost:5001/api/events/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(event),
        });

        const data = await response.json();
        if (response.ok) {
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await fetch(`http://localhost:5001/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== id)
        );
        alert(data.message || "Event deleted successfully");
      } else {
        alert(data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(event.date).toLocaleDateString().includes(searchQuery)
  );
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
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

        <input
          type="text"
          placeholder="Search events by name or date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <div className="events">
                  {currentEvents.map((event) => (
                    <div key={event._id} className="event-card">
                      <div className="event-header">
                        <span className="event-date">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span
                          className="event-username"
                          data-username={event.uploadedBy}
                        >
                          {event.uploadedBy || "Unknown"}
                        </span>
                      </div>
                      <h3>{event.eventName}</h3>
                      <p>{event.description}</p>
                      <button onClick={() => handleDeleteEvent(event._id)}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
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
