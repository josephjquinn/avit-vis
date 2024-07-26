import React from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

const NavBar: React.FC = () => {
  return (
    <header className="header">
      <NavLink to="/" className="logo">
        AViT-Vis
      </NavLink>
      <nav className="navbar">
        <NavLink
          to="/visualize"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Visualize
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
          to="/compare"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Compare
        </NavLink>
      </nav>
    </header>
  );
};

export default NavBar;
