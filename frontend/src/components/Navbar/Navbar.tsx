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
          to="/api"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          API
        </NavLink>
        <NavLink
          to="/metrics"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Metrics
        </NavLink>
        <NavLink
          to="/visualize"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Visualize
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/graph"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Graph
        </NavLink>
      </nav>
    </header>
  );
};

export default NavBar;
