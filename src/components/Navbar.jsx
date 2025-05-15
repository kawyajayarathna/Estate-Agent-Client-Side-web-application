import React from 'react';
import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-container">
      <a href="#home" className="logo">
        Refined Residences
      </a>
      <div className="nav-links">
        <a href="#home" className="nav-link">Home</a>
        <a href="#properties" className="nav-link">Properties</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#contact" className="nav-link">Contact</a>
      </div>
    </div>
  </nav>
);

export default Navbar;