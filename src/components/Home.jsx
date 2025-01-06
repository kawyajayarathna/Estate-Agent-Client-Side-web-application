import React from 'react'; 
import { Link } from 'react-router-dom'; 
import './Home.css';

// Create a Home component: a landing page for the application
const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Refined Residences</h1>
        <p className="subtitle">Where Luxury Meets Lifestyle</p>
        <Link to="/properties" className="cta-button">Explore Properties</Link>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🏰</div>
          <h3>Exclusive Properties</h3>
          <p>Discover handpicked luxury properties that define elegance and sophistication.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🌟</div>
          <h3>Premium Locations</h3>
          <p>Find homes in the most prestigious and sought-after neighborhoods.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Personalized Search</h3>
          <p>Use our advanced search features to find your perfect luxury residence.</p>
        </div>
      </div>

      <div className="welcome-section">
        <div className="welcome-content">
          <h2>Experience Luxury Living</h2>
          <p>
            At Refined Residences, we understand that your home is more than just a place to live
            – it's a reflection of your lifestyle and aspirations. Our curated collection of
            luxury properties represents the pinnacle of architectural excellence and sophisticated living.
          </p>
          <div className="welcome-buttons">
            <Link to="/properties" className="welcome-button">View Properties</Link>
            <Link to="/contact" className="welcome-button outline">Contact Us</Link>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <span className="stat-number">200+</span>
          <span className="stat-label">Luxury Properties</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">50+</span>
          <span className="stat-label">Premium Locations</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">1000+</span>
          <span className="stat-label">Happy Clients</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
