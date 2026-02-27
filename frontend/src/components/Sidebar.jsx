import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const [isExploreOpen, setIsExploreOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="tripler-sidebar">
      <div className="sidebar-brand">
        <span className="brand-logo">🔗</span>
        <span className="brand-name">Easy Trip</span>
      </div>

      <nav className="sidebar-menu">
        {/* Dashboard */}
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          <span className="menu-icon">🔳</span>
          <span className="menu-label">Dashboard</span>
        </NavLink>

        {/* Explore Group */}
        <div className="menu-group">
          <div className={`menu-item has-sub ${isExploreOpen ? 'open' : ''}`} onClick={() => setIsExploreOpen(!isExploreOpen)}>
            <span className="menu-icon">🗺️</span>
            <span className="menu-label">Explore</span>
            <span className="arrow-icon">{isExploreOpen ? '▾' : '▸'}</span>
          </div>
          {isExploreOpen && (
            <div className="sub-menu">
              <NavLink to="/dashboard/explore/cities" className="sub-item">Cities</NavLink>
              <NavLink to="/dashboard/explore/hotels" className="sub-item">Hotels</NavLink>
              <NavLink to="/dashboard/explore/restaurants" className="sub-item">Restaurants</NavLink>
              <NavLink to="/dashboard/explore/attractions" className="sub-item">Attractions</NavLink>
            </div>
          )}
        </div>

        {/* Other Main Links */}
        <NavLink to="/dashboard/trips" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          <span className="menu-icon">✈️</span>
          <span className="menu-label">My Trips</span>
        </NavLink>

        <NavLink to="/dashboard/favorites" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          <span className="menu-icon">❤️</span>
          <span className="menu-label">Favorites</span>
        </NavLink>

        <NavLink to="/dashboard/reviews" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
          <span className="menu-icon">⭐</span>
          <span className="menu-label">Reviews</span>
        </NavLink>

        {/* Footer Sidebar Actions */}
        <div className="sidebar-footer-nav">
          <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            <span className="menu-icon">⚙️</span>
            <span className="menu-label">Settings</span>
          </NavLink>

          <div className="menu-item logout-btn" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Logout</span>
          </div>
        </div>
      </nav>

      <div className="sidebar-profile">
        <div className="profile-avatar">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100" alt="User" />
          <div className="status-dot"></div>
        </div>
        <div className="profile-details">
          <p className="profile-name">Denlica</p>
          <p className="profile-email">denlica78@gmail.com</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
