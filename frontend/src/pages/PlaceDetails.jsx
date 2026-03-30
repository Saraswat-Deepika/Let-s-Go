import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlacesPage.css'; // Reuse common styles
import './Dashboard.css';

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Calculator States
  const [userLat, setUserLat] = useState('');
  const [userLng, setUserLng] = useState('');
  const [distance, setDistance] = useState(null);
  const [expense, setExpense] = useState(null);
  const [transportMode, setTransportMode] = useState('auto');

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/places/${id}`);
        if (res.data.success) {
          setPlace(res.data.place);
        }
      } catch (err) {
        setError("Place not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  const calculateTrip = () => {
    if (!userLat || !userLng || !place) return;
    
    // Haversine formula
    const R = 6371; // Earth radius in km
    const dLat = (place.lat - userLat) * Math.PI / 180;
    const dLon = (place.lng - userLng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLat * Math.PI / 180) * Math.cos(place.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    
    setDistance(d.toFixed(2));
    
    // Expense calculation (Baseline Vrindavan rates)
    let ratePerKm = 15; // Auto
    if (transportMode === 'taxi') ratePerKm = 25;
    if (transportMode === 'walking') ratePerKm = 0;
    
    const estExpense = d * ratePerKm;
    setExpense(Math.round(estExpense));
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
      });
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1544911845-1f34a3eb46b1';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  if (loading) return <div className="loading-container"><div className="loader"></div></div>;
  if (error || !place) return <div className="error-container"><h2>{error || "Place not found"}</h2><button onClick={() => navigate(-1)}>Go Back</button></div>;

  return (
    <div className="place-details-page" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div className="place-hero-glass" style={{ 
        background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${getImageUrl(place.images?.[0])})`,
        height: '400px',
        borderRadius: '24px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '40px',
        color: 'white',
        marginBottom: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div className="hero-content">
          <span className="category-tag" style={{ background: '#3b82f6', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{place.category}</span>
          <h1 style={{ fontSize: '48px', margin: '15px 0' }}>{place.name}</h1>
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
            <span>⭐ {place.rating} ({place.reviewCount || 0} reviews)</span>
            <span>📍 {place.area}, {place.city}</span>
            <span>👁️ {place.views} Views</span>
          </div>
        </div>
      </div>

      <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px' }}>
        {/* Main Info */}
        <div className="main-info-section">
          <div className="glass-card" style={{ padding: '30px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Description</h3>
            <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '16px' }}>{place.description}</p>
            
            <div className="info-tags" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
              <div className="info-box">
                <span style={{ color: '#64748b', fontSize: '12px' }}>Best Time to Visit</span>
                <p style={{ fontWeight: '600' }}>🕒 {place.best_time || 'Always open'}</p>
              </div>
              <div className="info-box">
                <span style={{ color: '#64748b', fontSize: '12px' }}>Opening Hours</span>
                <p style={{ fontWeight: '600' }}>⌛ {place.timings || 'Check locally'}</p>
              </div>
              <div className="info-box">
                <span style={{ color: '#64748b', fontSize: '12px' }}>Entry Fee</span>
                <p style={{ fontWeight: '600' }}>💰 {place.entry_fee || 'Free'}</p>
              </div>
              <div className="info-box">
                <span style={{ color: '#64748b', fontSize: '12px' }}>Suitable For</span>
                <p style={{ fontWeight: '600' }}>👥 {place.suitableFor?.join(', ') || 'Everyone'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Calculator */}
        <div className="sidebar-section">
          <div className="calculator-glass" style={{ 
            padding: '30px', 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
            borderRadius: '24px', 
            color: 'white',
            boxShadow: '0 15px 30px rgba(59, 130, 246, 0.3)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Trip Planner 🚗</h3>
            <p style={{ fontSize: '14px', marginBottom: '20px', opacity: '0.9' }}>Calculate distance and estimated travel cost from your location.</p>
            
            <div className="calc-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button onClick={useCurrentLocation} style={{ 
                background: 'rgba(255,255,255,0.2)', 
                border: '1px solid rgba(255,255,255,0.3)', 
                color: 'white',
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}>📍 Use My Location</button>
              
              <div className="input-group">
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Latitude</label>
                <input type="number" value={userLat} onChange={(e) => setUserLat(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }} />
              </div>
              
              <div className="input-group">
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Longitude</label>
                <input type="number" value={userLng} onChange={(e) => setUserLng(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }} />
              </div>

              <div className="input-group">
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Transport Mode</label>
                <select value={transportMode} onChange={(e) => setTransportMode(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none' }}>
                  <option value="auto">🛺 Auto Rickshaw</option>
                  <option value="taxi">🚕 Private Taxi</option>
                  <option value="walking">🚶 Walking</option>
                </select>
              </div>

              <button onClick={calculateTrip} style={{ 
                background: '#f59e0b', 
                color: 'white', 
                fontWeight: 'bold',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                marginTop: '10px',
                cursor: 'pointer'
              }}>Calculate Distance & Cost</button>
            </div>

            {distance && (
              <div className="calc-results" style={{ marginTop: '25px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Distance:</span>
                  <span style={{ fontWeight: 'bold' }}>{distance} km</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Est. Expense:</span>
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{expense}</span>
                </div>
              </div>
            )}
          </div>

          <button 
            className="btn-google-maps" 
            style={{ width: '100%', marginTop: '20px', padding: '15px', borderRadius: '15px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, '_blank')}
          >
            🗺️ View on Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
