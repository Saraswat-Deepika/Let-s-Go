import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import Card from '../components/Card';
import { UpcomingTripCard, MapPreview, TravelActivityChart } from '../components/DashboardWidgets';
import travelService from '../services/travelService';
import { useAuth } from '../context/AuthContext';
import ExploreView from './ExploreView';
import './Dashboard.css';

const Dashboard = ({ showExplore }) => {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main-content">
        <Navbar />
        <main className="dashboard-view-area">
          {showExplore ? <ExploreView /> : <DashboardHome />}
        </main>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const city = 'Mathura';
      const placesData = await travelService.getPlaces(city, 'top historical attractions');
      setFeaturedPlaces(placesData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-home">
      {/* 1. TOP SECTION */}
      <section className="dashboard-section top-section">
        <div className="top-header-row">
          <div className="welcome-area">
            <h1>Welcome back to Krishna Nagari, {user?.name || 'Traveler'}! 🙏</h1>
            <p>Ready for your next spiritual adventure in Mathura?</p>
          </div>
          <div className="user-profile-large">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150" alt="Profile" />
            <div className="online-badge"></div>
          </div>
        </div>
        <SummaryCards />
      </section>

      {/* 2. MIDDLE SECTION */}
      <section className="dashboard-section middle-section">
        <div className="recommended-area">
          <div className="section-header">
            <h2>Recommended Places</h2>
            <span className="view-link">View All</span>
          </div>
          <div className="recommended-grid">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              featuredPlaces.slice(0, 2).map(place => (
                <Card
                  key={place.id}
                  title={place.name}
                  description={place.description}
                  image={place.image}
                  rating={place.rating}
                  price={place.price || 0}
                  category={place.category}
                  location={place.location}
                />
              ))
            )}
          </div>
        </div>
        <UpcomingTripCard />
      </section>

      {/* 3. BOTTOM SECTION */}
      <section className="dashboard-section bottom-section">
        <MapPreview />
        <TravelActivityChart />
      </section>
    </div>
  );
};

export default Dashboard;