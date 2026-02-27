import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="dashboard-navbar">
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search" className="top-search-input" />
      </div>

      <div className="navbar-actions">
        <button className="action-btn">🔔</button>
        <div className="user-profile-top">
          <div className="avatar">👤</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;