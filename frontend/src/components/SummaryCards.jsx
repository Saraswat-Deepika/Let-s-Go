import React from 'react';
import './SummaryCards.css';

const SummaryCards = () => {
    const stats = [
        { label: 'Total Trips', value: '24', icon: '✈️', color: 'blue' },
        { label: 'Saved Places', value: '158', icon: '📍', color: 'green' },
        { label: 'Reviews', value: '42', icon: '⭐', color: 'purple' },
        { label: 'Cities Visited', value: '12', icon: '🏙️', color: 'orange' }
    ];

    return (
        <div className="summary-cards">
            {stats.map((stat, idx) => (
                <div key={idx} className={`stat-card ${stat.color}`}>
                    <div className="stat-icon-wrapper">
                        <span className="stat-icon">{stat.icon}</span>
                    </div>
                    <div className="stat-content">
                        <h2 className="stat-value">{stat.value}</h2>
                        <p className="stat-label">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
