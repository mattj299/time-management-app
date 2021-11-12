import React, { useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import TimelineAndForm from "./components//TimelineAndForm/TimelineAndForm";
import Tips from "./components/Tips/Tips";
import Footer from "./components/Footer/Footer";
import "./styles.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  // if true light them, else dark theme
  const [darkTheme, setTheme] = useState(true);

  const onThemeChange = () => setTheme(!darkTheme);

  return (
    <Router>
      <div className="container">
        <div className="no-footer-content">
          <div className="App">
            <Navbar darkTheme={darkTheme} onThemeChange={onThemeChange} />
            <div className="no-footer-navbar-content">
              <Routes>
                <Route exact path="/" element={<TimelineAndForm />} />
                <Route path="/tips" element={<Tips />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
