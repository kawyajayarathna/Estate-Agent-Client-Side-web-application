import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Refined Residences</h1>
        <div className="about-section">
          <h2>Our Vision</h2>
          <p>
            At Refined Residences, we believe that finding your dream luxury home should be an
            experience as refined as the properties we showcase. Our platform is designed to
            connect discerning buyers with the most prestigious properties across the globe.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Commitment</h2>
          <p>
            We are committed to providing an unparalleled property search experience, featuring
            only the most exclusive listings that meet our stringent quality standards. Each
            property in our portfolio is carefully selected to ensure it meets the expectations
            of our distinguished clientele.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Expertise</h2>
          <p>
            With years of experience in luxury real estate, our team understands the unique
            requirements of high-end property transactions. We combine this expertise with
            cutting-edge technology to deliver a seamless and sophisticated property search
            experience.
          </p>
        </div>

        <div className="about-section">
          <h2>Quality Assurance</h2>
          <p>
            Every property listed on Refined Residences undergoes a thorough verification
            process. From architectural excellence to premium locations, we ensure that each
            listing represents the pinnacle of luxury living.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
