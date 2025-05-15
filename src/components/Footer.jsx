import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Refined Residences</h3>
          <p>Luxury Living Redefined</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <nav>
            <a href="#properties">Properties</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>Email: info@refinedresidences.com</p>
          <p>Address: 123 Luxury Lane, London</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Refined Residences. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;