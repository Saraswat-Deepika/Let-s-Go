import React from 'react';
import './Card.css';

const Card = ({
  title,
  image,
  description,
  rating,
  price,
  category,
  location,
  status = 'Active',
  country = 'Australia',
  duration = '7 Day',
  start = '2023',
  onClick
}) => {
  return (
    <div className="tour-card" onClick={onClick}>
      <div className="card-image-wrapper">
        <img src={image || 'https://images.unsplash.com/photo-1506929662133-570a13349948?auto=format&fit=crop&w=400&h=250'} alt={title} className="card-image" />
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{title}</h3>
          <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
        </div>

        <div className="card-meta-row">
          <span className="card-category-tag">{category || 'Tour'}</span>
          <span className="card-rating-star">⭐ {rating || '4.5'}</span>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Location</span>
            <span className="info-value">{location || country}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Duration</span>
            <span className="info-value">{duration}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Price</span>
            <span className="info-value">{price === 0 ? 'Free' : `₹${price}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;