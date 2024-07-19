import React from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

const NavBar: React.FC = () => {
  return (
    <header className="header">
      <NavLink to="/" className="logo">
        WebDemo
      </NavLink>
      <nav className="navbar">
        <NavLink
          to="/metrics"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Metrics
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
};

export default NavBar;
