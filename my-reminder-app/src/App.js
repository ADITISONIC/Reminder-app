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
  const [addedBy, setAddedBy] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 15; // Items per page

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const onLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        fetchEvents();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("An error occurred while logging in.");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/events", {
        method: "GET",
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      const data = await response.json();
      if (response.ok) {
        setEvents(data);
      } else {
        alert(data.message || "Failed to fetch events.");
      }
    } catch (error) {
      alert("An error occurred while fetching events.");
    }
  };

  const handleAddEvent = async () => {
    if (newEvent && newDate && addedBy && eventDescription) {
      const event = {
        eventName: newEvent,
        date: newDate,
        addedBy,
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
          setAddedBy("");
          setEventDescription("");
        } else {
          alert(data.message || "Failed to add event.");
        }
      } catch (error) {
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
        headers: { "x-auth-token": localStorage.getItem("token") },
      });

      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== id)
        );
      } else {
        alert("Failed to delete event.");
      }
    } catch (error) {
      alert("An error occurred while deleting the event.");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

  const filteredEvents = events.filter(
    (event) =>
      event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatDate(event.date).includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
          placeholder="Search by Event Name or Date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        <Routes>
          <Route
            path="/"
            element={
              <div className="events">
                {currentEvents.map((event) => (
                  <div className="event-card" key={event._id}>
                    <div className="event-header">
                      <span className="event-date">
                        {formatDate(event.date)}
                      </span>
                      <span className="event-added-by">{event.addedBy}</span>
                    </div>
                    <h3>{event.eventName}</h3>
                    <p>{event.description}</p>
                    <button onClick={() => handleDeleteEvent(event._id)}>
                      Delete
                    </button>
                  </div>
                ))}
                <div className="pagination">
                  <button
                    onClick={previousPage}
                    disabled={currentPage === 1}
                    className="page-button"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="page-button"
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
