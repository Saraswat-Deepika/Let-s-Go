import React from 'react';
import './DashboardComponents.css';

export const StatCard = ({ title, count, icon, bgColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <span className="stat-count">{count}</span>
      </div>
      <div className="stat-icon-wrapper" style={{ backgroundColor: bgColor }}>
        <span className="stat-icon">{icon}</span>
      </div>
    </div>
  );
};

export const LocationList = ({ title, items }) => {
  return (
    <div className="location-list-container">
      <h3 className="section-title">{title}</h3>
      <div className="location-items">
        {items.map((item, index) => (
          <div key={index} className="location-item">
            <span className="item-icon">{item.icon}</span>
            <span className="item-name">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardCard = ({ title, date, image, category }) => {
  return (
    <div className="dashboard-card-item">
      <div className="card-image-wrapper">
        <img src={image} alt={title} />
      </div>
      <div className="card-content">
        <h4 className="card-title">{title}</h4>
        <p className="card-date">{date}</p>
      </div>
    </div>
  );
};
export const WeatherWidget = ({ weather }) => {
  if (!weather) return (
    <div className="weather-widget loading">
      <div className="weather-icon-placeholder">⛅</div>
      <div className="weather-info">
        <span className="weather-temp">--°C</span>
        <span className="weather-desc">Loading weather...</span>
      </div>
    </div>
  );

  return (
    <div className="weather-widget">
      <div className="weather-main">
        <div className="weather-icon-large">
          {weather.condition === 'Sunny' ? '☀️' : weather.condition?.includes('Rain') ? '🌧️' : '⛅'}
        </div>
        <div className="weather-temp-main">{Math.round(weather.temp)}°C</div>
      </div>
      <div className="weather-details">
        <div className="weather-desc">{weather.condition}</div>
        <div className="weather-location">Vrindavan, India</div>
      </div>
    </div>
  );
};
