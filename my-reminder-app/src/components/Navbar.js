import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/Navbar.css";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("/");

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <nav>
      <Link
        to="/"
        className={activeLink === "/" ? "active" : ""}
        onClick={() => handleLinkClick("/")}
      >
        Home
      </Link>
      <Link
        to="/add-event"
        className={activeLink === "/add-event" ? "active" : ""}
        onClick={() => handleLinkClick("/add-event")}
      >
        Add Event
      </Link>
    </nav>
  );
};

export default Navbar;
