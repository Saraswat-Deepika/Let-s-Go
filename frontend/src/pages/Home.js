import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="et-landing-peacock">
      {/* Glassmorphism Navbar */}
      <nav className="et-navbar-transparent">
        <Link to="/" className="et-logo-white">
          LET'S GO
        </Link>
        <div className="et-nav-links-white">
          <Link to="/">Home</Link>
          <Link to="/dashboard/reviews">Reviews</Link>
          <Link to="/dashboard/analytics">Analytics</Link>
        </div>
        <Link to="/login" className="btn-glass-explore">Explore App</Link>
      </nav>

      {/* Hero Section */}
      <section className="hero-peacock">
        <div className="hero-peacock-content">
          <h1 className="hero-subtitle-elegant">Welcome to the Krishna Nagari</h1>
          <h2 className="hero-title-elegant">Vrindavan</h2>
          <p className="hero-description-elegant">
            Discover the divine atmosphere, ancient temples, and vibrant festivals. 
            Experience the spiritual heartbeat of Braj Bhoomi wrapped in pure devotion.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-primary-elegant">Start Your Journey</Link>
            <Link to="/login" className="btn-secondary-elegant">View Places</Link>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div>EXPLORE</div>
        </div>
      </section>
    </div>
  );
};

export default Home;