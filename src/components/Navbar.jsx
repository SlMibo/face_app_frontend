import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ theme, toggleTheme }) => {
  return (
    <nav
        className={`navbar navbar-expand-lg px-4 shadow-sm ${theme === "dark" ? "navbar-dark" : "navbar-light"}`}
        style={
            theme === "dark"
            ? { backgroundColor: "#000000ff", borderBottom: "1px solid #afafafff" }
            : { backgroundColor: "#def1ffff", borderBottom: "1px solid #ccc" }
        }
        >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Karstec</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Personas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Registrar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/identify">Identificar</Link>
            </li>

          </ul>
          <button
            onClick={toggleTheme}
            className={`btn btn-sm ms-3 ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"}`}
          >
            {theme === "light" ? "🌙 Oscuro" : "☀️ Claro"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
