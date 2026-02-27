import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const destinations = [
    { id: 1, name: 'Shree Krishna Janmabhoomi', location: 'Mathura', img: 'https://images.unsplash.com/photo-1544011501-a203f71c4801?auto=format&fit=crop&w=400' },
    { id: 2, name: 'Banke Bihari Temple', location: 'Vrindavan', img: 'https://images.unsplash.com/photo-1590050835412-42173322a36d?auto=format&fit=crop&w=400' },
    { id: 3, name: 'Prem Mandir', location: 'Vrindavan', img: 'https://images.unsplash.com/photo-1621244299838-2d7c677617d8?auto=format&fit=crop&w=400' }
  ];

  const features = [
    { icon: '🗺️', title: 'Personalized Plans', text: 'AI-driven itineraries tailored to your unique interests.' },
    { icon: '🛡️', title: 'Safe Travels', text: 'Community-verified safety ratings for every destination.' },
    { icon: '🤝', title: 'Travel Buddy', text: 'Connect with fellow explorers in real-time.' }
  ];

  return (
    <div className="et-landing">
      {/* 1. Navbar */}
      <nav className="et-navbar">
        <Link to="/" className="et-logo">
          <span className="logo-icon">🔗</span> EASY TRIP
        </Link>
        <div className="et-nav-links">
          <Link to="/">Home</Link>
          <Link to="#">Reviews</Link>
          <Link to="#">Our blog</Link>
        </div>
        <Link to="/dashboard" className="btn-download btn-link">Explore App</Link>
      </nav>

      {/* 2. Hero Section */}
      <section className="et-hero">
        <div className="hero-grid">
          <div className="hero-text-content">
            <h1 className="hero-title">
              EXPLORE THE<br />
              <span className="italic-text">KRISHNA NAGARI</span>
            </h1>
            <div className="hero-card">
              <p>
                Discover Mathura & Vrindavan (Braj Bhoomi), the birthplace of Lord Krishna.
                Experience the divine atmosphere, ancient temples, and vibrant festivals like Holi and Janmashtami.
                24-hour support for your spiritual journey.
              </p>
              <Link to="/dashboard" className="btn-get-started">Get Started</Link>
              <div className="app-availability">
                <span>The mobile app is available now</span>
                <div className="app-icons">
                  <span className="app-icon">🍏</span>
                  <span className="app-icon">🤖</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="screen-header">My Trips</div>
                <div className="screen-content">
                  <div className="trip-mini-card">
                    <h4>Exotic Bali</h4>
                    <p>Nov 24 - Dec 2</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="wave-bg"></div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="et-section et-features">
        <h2 className="section-title">Why EASY TRIP?</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Popular Destinations */}
      <section className="et-section et-destinations">
        <div className="section-header">
          <h2 className="section-title">Popular Destinations</h2>
          <span className="view-link">See all</span>
        </div>
        <div className="destinations-grid">
          {destinations.map(d => (
            <div key={d.id} className="dest-card">
              <img src={d.img} alt={d.name} />
              <div className="dest-info">
                <h4>{d.name}</h4>
                <p>{d.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="et-section et-how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-row">
          <div className="step-item">
            <div className="step-num">01</div>
            <h4>Choose Location</h4>
            <p>Select your dream destination from our catalog.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-item">
            <div className="step-num">02</div>
            <h4>Pick Your Mood</h4>
            <p>Tell us how you feel today.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-item">
            <div className="step-num">03</div>
            <h4>Travel Smart</h4>
            <p>Get your AI plan and go!</p>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="et-section et-testimonials">
        <div className="testimonial-box">
          <p className="quote">"EASY TRIP changed the way I explore cities. The AI planner is scarily accurate!"</p>
          <div className="user-info">
            <img src="https://i.pravatar.cc/100?u=1" alt="User" />
            <div>
              <strong>Sarah Jenkins</strong>
              <span>Solo Traveler</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Stats Section */}
      <section className="et-section et-stats">
        <div className="stats-row">
          <div className="stat-box">
            <h3>7+</h3>
            <p>Sacred Sites</p>
          </div>
          <div className="stat-box">
            <h3>Millions</h3>
            <p>Annual Pilgrims</p>
          </div>
          <div className="stat-box">
            <h3>NH-19</h3>
            <p>Connectivity</p>
          </div>
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="et-cta">
        <div className="cta-content">
          <h2>Ready for your next adventure?</h2>
          <p>Join thousands of smart travelers using EASY TRIP.</p>
          <Link to="/dashboard" className="btn-get-started">Get Started Now</Link>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="et-footer">
        <div className="footer-grid">
          <div className="footer-col brand">
            <h3>EASY TRIP</h3>
            <p>Making travel smart and accessible for everyone.</p>
          </div>
          <div className="footer-col links">
            <h4>Company</h4>
            <Link to="#">About us</Link>
            <Link to="#">Our blog</Link>
            <Link to="#">Terms</Link>
          </div>
          <div className="footer-col follow">
            <h4>Follow us</h4>
            <div className="social-links">
              <span>FB</span> <span>IG</span> <span>TW</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2024 EASY TRIP. All rights reserved.
        </div>
      </footer>
    </div >
  );
};

export default Home;