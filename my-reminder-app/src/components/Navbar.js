// src/components/Navbar.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link> {/* Link to Home route */}
      <Link to="/add-event">Add Event</Link> {/* Link to Add Event route */}
    </nav>
  );
};

export default Navbar;
