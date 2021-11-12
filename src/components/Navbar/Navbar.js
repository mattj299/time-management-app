import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./styles.scss";

function Navbar({ darkTheme, onThemeChange }) {
  const [currentTime, setcurrentTime] = useState("00:00:00 AM");
  const [activeNavbar, setActiveNavbar] = useState(false);

  const toggleNav = () => {
    setActiveNavbar(!activeNavbar);
  };

  const closeNav = () => {
    setActiveNavbar(false);
  };

  useEffect(() => {
    const current = new Date().toLocaleTimeString();
    const timer = setInterval(() => setcurrentTime(current), 1000);

    return () => {
      clearInterval(timer);
    };
  }, [currentTime]);

  useEffect(() => {
    const theme = darkTheme ? "dark" : "light";

    const bodyElem = document.getElementsByTagName("body")[0];

    bodyElem.className = "";
    bodyElem.classList.add(`theme-${theme}`);
  }, [darkTheme]);

  return (
    <div className="navbar">
      <div className="navbar-no-switch-content">
        <div
          className={
            activeNavbar
              ? "navbar-menu-items navbar-active "
              : "navbar-menu-items"
          }
        >
          <div className="navbar-time navbar-top-content">{currentTime}</div>
          <Link to="/tips">
            <div className="navbar-tip navbar-top-content" onClick={closeNav}>
              Tips
            </div>
          </Link>
        </div>
        <div className="navbar-title-bars">
          <Link to="/" onClick={closeNav}>
            <div className="navbar-title navbar-top-content">
              Time Management
            </div>
          </Link>
          <FaBars className="navbar-bars" onClick={toggleNav} />
        </div>
      </div>

      <label className="switch">
        <input name="navbar-switch" onChange={onThemeChange} type="checkbox" />
        <div>
          <span></span>
        </div>
      </label>
    </div>
  );
}

export default Navbar;
