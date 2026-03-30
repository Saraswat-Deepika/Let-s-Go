import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/dashboard', exact: true },
    { name: 'Temples', icon: '🏛️', path: '/dashboard/temples' },
    { name: 'Cafes & Restaurants', icon: '☕', path: '/dashboard/cafes' },
    { name: 'Ghats', icon: '🌊', path: '/dashboard/ghats' },
    { name: 'Markets', icon: '🛍️', path: '/dashboard/markets' },
    { name: 'Nearby Places', icon: '📍', path: '/dashboard/nearby' },
    { name: 'Events & Festivals', icon: '🎉', path: '/dashboard/events' },
    { name: 'Hotels & Hostels', icon: '🏨', path: '/dashboard/hotels' },
    { name: 'Transport', icon: '🚌', path: '/dashboard/transport' },
    { name: 'Colleges', icon: '🎓', path: '/dashboard/colleges' },
    { name: 'Emergency', icon: '🚨', path: '/dashboard/emergency' },
    { name: 'Reviews', icon: '💬', path: '/dashboard/reviews' },
    { name: 'Analytics', icon: '📊', path: '/dashboard/analytics' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <div className="logo-main">Let's Go <span className="logo-icon">🕊️</span></div>
        <p className="logo-sub">Vrindavan Mathura Explorer</p>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            end={item.exact}
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          >
            <span className="icon">{item.icon}</span>
            <span className="text">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="btn-add-place-sidebar">
          <span className="plus">+</span> Add Spot
        </button>
        <button className="btn-logout-sidebar" onClick={handleLogout}>
          <span className="icon">🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
