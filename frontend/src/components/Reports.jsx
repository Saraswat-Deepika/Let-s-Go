import React from 'react';
import './Reports.css';

const Reports = () => {
    const travelers = [
        { name: 'User 1', avatar: 'https://i.pravatar.cc/150?u=1' },
        { name: 'User 2', avatar: 'https://i.pravatar.cc/150?u=2' },
        { name: 'User 3', avatar: 'https://i.pravatar.cc/150?u=3' },
        { name: 'User 4', avatar: 'https://i.pravatar.cc/150?u=4' },
        { name: 'User 5', avatar: 'https://i.pravatar.cc/150?u=5' }
    ];

    return (
        <div className="reports-container">
            <div className="main-analytics">
                <div className="analysis-card">
                    <div className="analysis-header">
                        <h3 className="section-title">Analysis</h3>
                        <div className="tabs">
                            <button className="tab-btn active">Hotels</button>
                            <button className="tab-btn">Car</button>
                            <button className="tab-btn">Flight</button>
                        </div>
                    </div>

                    <div className="spend-row">
                        <div className="spend-item">
                            <div className="spend-info">
                                <p className="spend-value">325,975$</p>
                                <p className="spend-label">Total Est. Spend</p>
                            </div>
                            <div className="progress-circle" data-percent="80">
                                <span className="percent">80%</span>
                            </div>
                        </div>

                        <div className="spend-item">
                            <div className="spend-info">
                                <p className="spend-value">3,02,754$</p>
                                <p className="spend-label">Total Spend</p>
                            </div>
                            <div className="progress-circle blue" data-percent="55">
                                <span className="percent">55%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="report-card">
                    <div className="report-header">
                        <h3 className="section-title">Today Report</h3>
                        <div className="report-legend">
                            <span className="legend-item sales">Sales</span>
                            <span className="legend-item exec">Executive</span>
                            <span className="legend-item recruit">Recruitment</span>
                        </div>
                    </div>
                    <div className="bar-chart">
                        {[20, 45, 30, 60, 40, 70, 50, 65].map((h, i) => (
                            <div key={i} className="chart-column">
                                <div className="bar-group">
                                    <div className="bar sales" style={{ height: `${h}%` }}></div>
                                    <div className="bar exec" style={{ height: `${h - 10}%` }}></div>
                                </div>
                                {i % 2 === 0 && <span className="chart-label">{['Jan', 'Feb', 'Mar', 'Apr'][i / 2]}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="side-analytics">
                <div className="traveler-card">
                    <div className="card-header">
                        <h4>Current Traveler</h4>
                        <span className="more-btn">•••</span>
                    </div>
                    <div className="avatar-list">
                        {travelers.map((t, i) => (
                            <img key={i} src={t.avatar} alt={t.name} className="traveler-avatar" style={{ zIndex: 10 - i }} />
                        ))}
                        <div className="avatar-plus">+12</div>
                    </div>
                    <div className="traveler-badge">6,230$</div>
                </div>

                <div className="breakdown-card">
                    <div className="card-header">
                        <h4>Spend Breakdowns</h4>
                        <span className="more-btn">•••</span>
                    </div>
                    <div className="donut-chart-container">
                        <div className="donut-chart">
                            <div className="donut-center">
                                <span className="main-percent">43%</span>
                            </div>
                        </div>
                    </div>
                    <div className="breakdown-list">
                        <div className="breakdown-row">
                            <span className="dot marketing"></span> Marketing <span className="val">50%</span>
                        </div>
                        <div className="breakdown-row">
                            <span className="dot design"></span> Design <span className="val">20%</span>
                        </div>
                        <div className="breakdown-row">
                            <span className="dot webflow"></span> Webflow <span className="val">20%</span>
                        </div>
                        <div className="breakdown-row">
                            <span className="dot sales"></span> Sales <span className="val">10%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
