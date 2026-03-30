import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { StatCard, LocationList, DashboardCard, WeatherWidget } from '../components/DashboardComponents';
import travelService from '../services/travelService';
import './Dashboard.css';

const Dashboard = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await travelService.getWeather('Vrindavan');
      if (data) setWeather(data);
    };
    fetchWeather();
  }, []);

  const recentAdditions = [
    { name: 'Banke Bihari Temple', icon: '🏛️' },
    { name: '11 Flowers Rooftop Cafe', icon: '☕' },
    { name: 'Yamuna Aarti', icon: '🕯️' },
  ];

  const trendingLocations = [
    { name: 'Prem Mandir', icon: '🌸' },
    { name: 'Govardhan Hill', icon: '⛰️' },
    { name: 'Radha Kund', icon: '⛲' },
  ];

  return (
    <div className="dashboard-main-view">
      <div className="dashboard-scrollable-area">
        {/* 1. Stat Cards Row */}
        <div className="stats-grid">
          <StatCard title="Total Temples" count="25" icon="🏛️" bgColor="#ecebff" />
          <StatCard title="Cafes & Restaurants" count="18" icon="☕" bgColor="#fff2ca" />
          <StatCard title="Nearby Places" count="12" icon="📍" bgColor="#d4f6ed" />
          <WeatherWidget weather={weather} />
        </div>

        {/* 2. Main Middle Section */}
        <div className="dashboard-middle-row">
          <div className="map-column">
            <div className="map-placeholder">
              <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" alt="Map" />
              <div className="map-overlay-text">Vrindavan</div>
            </div>
          </div>
          
          <div className="lists-column">
            <LocationList title="Recent Additions" items={recentAdditions} />
            <LocationList title="Trending Locations" items={trendingLocations} />
            
            <div className="small-cards-row">
              <DashboardCard 
                title="Krishna Janmabhoomi" 
                date="March 2022" 
                image="https://images.unsplash.com/photo-1561494519-798836544521?auto=format&fit=crop&q=80&w=400" 
              />
              <DashboardCard 
                title="ISKCON Vrindavan" 
                date="August 2022" 
                image="https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?auto=format&fit=crop&q=80&w=400" 
              />
            </div>
          </div>
        </div>

        {/* 3. Bottom Section */}
        <div className="dashboard-bottom-row">
          <div className="row-section half">
            <h3 className="row-title">Popular Temples</h3>
            <div className="large-cards-grid">
              <DashboardCard 
                title="Krishna Janmabhoomi" 
                date="March 2022" 
                image="https://images.unsplash.com/photo-1561494519-798836544521?auto=format&fit=crop&q=80&w=600" 
              />
              <DashboardCard 
                title="ISKCON Vrindavan" 
                date="August 2022" 
                image="https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?auto=format&fit=crop&q=80&w=600" 
              />
            </div>
          </div>

          <div className="row-section half">
            <h3 className="row-title">Upcoming Festivals</h3>
            <div className="large-cards-grid">
              <DashboardCard 
                title="Holi Festival" 
                date="March 2022" 
                image="https://images.unsplash.com/photo-1532188978303-4bfac24222ba?auto=format&fit=crop&q=80&w=600" 
              />
              <DashboardCard 
                title="Janmashtami" 
                date="August 2022" 
                image="https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&q=80&w=600" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;