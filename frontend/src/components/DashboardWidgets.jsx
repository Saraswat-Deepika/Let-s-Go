import React from 'react';
import './DashboardWidgets.css';

export const UpcomingTripCard = () => {
    return (
        <div className="widget-card upcoming-trip">
            <div className="widget-header">
                <h3>Upcoming Trip</h3>
                <span className="status-badge">In 5 Days</span>
            </div>
            <div className="trip-hero">
                <img src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=400" alt="Destination" />
                <div className="trip-overlay">
                    <h4>Mathura Adventure</h4>
                    <p>Exploring Spiritual Heritage</p>
                </div>
            </div>
            <div className="trip-details-row">
                <div className="detail-item">
                    <span className="label">Date</span>
                    <p>Oct 24, 2024</p>
                </div>
                <div className="detail-item">
                    <span className="label">Weather</span>
                    <p>28°C Sunny</p>
                </div>
            </div>
        </div>
    );
};

export const TravelActivityChart = () => {
    const data = [40, 70, 45, 90, 65, 80, 55];
    return (
        <div className="widget-card activity-chart">
            <div className="widget-header">
                <h3>Travel Activity</h3>
                <select className="chart-select">
                    <option>Weekly</option>
                    <option>Monthly</option>
                </select>
            </div>
            <div className="chart-visual">
                {data.map((h, i) => (
                    <div key={i} className="chart-bar-container">
                        <div className="chart-bar" style={{ height: `${h}%` }}></div>
                        <span className="chart-day">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const MapPreview = () => {
    return (
        <div className="widget-card map-preview">
            <div className="widget-header">
                <h3>Map Preview</h3>
            </div>
            <div className="map-placeholder">
                <div className="map-overlay">
                    <span className="map-icon">📍</span>
                    <p>Exploring Mathura Region</p>
                    <button className="btn-expand">Full Screen</button>
                </div>
            </div>
        </div>
    );
};

export const Favorites = () => {
    const favorites = [
        { id: 1, name: 'Radha Rani Temple', cat: 'Spiritual', rating: 4.9 },
        { id: 2, name: 'Holi Gate', cat: 'Market', rating: 4.7 }
    ];

    return (
        <div className="widget-card favorites-widget">
            <div className="widget-header">
                <h3>Favorites</h3>
                <span className="add-btn">+</span>
            </div>
            <div className="fav-list">
                {favorites.map(fav => (
                    <div key={fav.id} className="fav-item">
                        <div className="fav-details">
                            <h4>{fav.name}</h4>
                            <p>{fav.cat}</p>
                        </div>
                        <div className="fav-rating">⭐ {fav.rating}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DashboardWidgets = () => {
    return (
        <div className="dashboard-widgets-row">
            <UpcomingTripCard />
            <Favorites />
        </div>
    );
};

export default DashboardWidgets;
