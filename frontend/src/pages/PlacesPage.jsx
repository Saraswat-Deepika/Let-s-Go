import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlacesPage.css';

// Page data for each category
const categoryConfig = {
  temples: {
    title: 'Temples',
    icon: '🏛️',
    filter: 'Temple',
    color: '#e8f4fd',
    accent: '#5a54a7',
    description: 'Sacred temples of Vrindavan and Mathura'
  },
  cafes: {
    title: 'Cafes & Restaurants',
    icon: '☕',
    filter: 'Restaurant',
    color: '#fff8ec',
    accent: '#f59e0b',
    description: 'Best cafes and eateries in the area'
  },
  ghats: {
    title: 'Ghats',
    icon: '🌊',
    filter: 'Ghat',
    color: '#ecfdf5',
    accent: '#10b981',
    description: 'Holy ghats on the banks of Yamuna river'
  },
  markets: {
    title: 'Markets',
    icon: '🛍️',
    filter: 'Market',
    color: '#fdf4ff',
    accent: '#a855f7',
    description: 'Shopping hubs and local bazaars'
  },
  nearby: {
    title: 'Nearby Places',
    icon: '📍',
    filter: 'Attraction',
    color: '#f0f9ff',
    accent: '#0ea5e9',
    description: 'All attractions near Vrindavan and Mathura'
  },
  events: {
    title: 'Events & Festivals',
    icon: '🎉',
    filter: 'Event',
    color: '#fff1f2',
    accent: '#e11d48',
    description: 'Upcoming events and festivals'
  },
  hotels: {
    title: 'Hotels & Hostels',
    icon: '🏨',
    filter: 'Stay',
    color: '#f0fdf4',
    accent: '#16a34a',
    description: 'Places to stay in Vrindavan and Mathura'
  },
  transport: {
    title: 'Transport',
    icon: '🚌',
    filter: 'Transport',
    color: '#f8fafc',
    accent: '#475569',
    description: 'How to get around Vrindavan and Mathura'
  },
  colleges: {
    title: 'Colleges',
    icon: '🎓',
    filter: 'College',
    color: '#fefce8',
    accent: '#ca8a04',
    description: 'Educational institutions in the area'
  },
  emergency: {
    title: 'Emergency',
    icon: '🚨',
    filter: 'Emergency',
    color: '#fff1f2',
    accent: '#dc2626',
    description: 'Hospitals, police stations, and emergency contacts'
  },
  reviews: {
    title: 'Reviews',
    icon: '💬',
    filter: null,
    color: '#f0f9ff',
    accent: '#3b82f6',
    description: 'User reviews and ratings of places'
  },
  analytics: {
    title: 'Analytics',
    icon: '📊',
    filter: null,
    color: '#f8fafc',
    accent: '#5a54a7',
    description: 'Platform analytics and insights'
  }
};

// Static fallback data for places
const staticData = {
  Temple: [
    { name: 'Banke Bihari Temple', area: 'Vrindavan', bestTime: 'Morning & Evening Aarti', estimatedBudget: 'Free', description: 'One of the most famous Krishna temples.', icon: '🏛️' },
    { name: 'Prem Mandir', area: 'Vrindavan', bestTime: 'Evening 6–8 PM', estimatedBudget: 'Free', description: 'White marble temple complex with light shows.', icon: '🏛️' },
  ],
  Ghat: [
    { name: 'Vishram Ghat', area: 'Mathura', bestTime: 'Evening Aarti', estimatedBudget: 'Free', description: 'Major ghat in Mathura.', icon: '🌊' },
    { name: 'Keshi Ghat', area: 'Vrindavan', bestTime: 'Sunrise/Sunset', estimatedBudget: 'Free', description: 'Legendary ghat in Vrindavan.', icon: '🌊' },
  ],
  Market: [
    { name: 'Loi Bazaar', area: 'Vrindavan', description: 'Famous for spiritual items and clothes.', icon: '🛍️' },
    { name: 'Holi Gate Area', area: 'Mathura', description: 'Central market hub of Mathura.', icon: '🛍️' },
  ],
  College: [
    { name: 'GLA University', area: 'Mathura', description: 'One of the leading universities in the region.', icon: '🎓' },
    { name: 'BSA College', area: 'Mathura', description: 'Historic educational institution.', icon: '🎓' },
  ],
  Transport: [
    { name: 'Mathura Junction', area: 'Mathura', description: 'Main railway hub.', icon: '🚆' },
    { name: 'Shared E-Rickshaws', area: 'Vrindavan', description: 'Most common local transport.', icon: '🛺' },
  ],
  Event: [
    { name: 'Braj Holi', area: 'Braj Region', description: 'World famous festival of colors.', icon: '🎨' },
    { name: 'Janmashtami', area: 'Mathura', description: 'Celebration of Krishna\'s birth.', icon: '🎊' },
  ],
  default: [
    { name: 'Nidhivan', area: 'Vrindavan', description: 'Sacred forest temple.', icon: '🌳' },
  ]
};

const transportInfo = [
  { title: 'By Train', description: 'Mathura Junction is a major railway station. Vrindavan has a smaller station. Both are well connected to Delhi (2hrs), Agra (1hr) etc.', icon: '🚆' },
  { title: 'By Bus', description: 'UP State Roadways and private buses connect Mathura to Delhi, Agra, Jaipur. Local e-rickshaws connect Mathura to Vrindavan (15km).', icon: '🚌' },
  { title: 'By Car/Taxi', description: 'Mathura is on the Yamuna Expressway, 180km from Delhi, 50km from Agra. Taxis and auto-rickshaws are available locally.', icon: '🚗' },
  { title: 'Local Transport', description: 'E-rickshaws and cycle rickshaws are the most common way to get around. Shared e-rickshaws run on fixed routes.', icon: '🛺' },
];

const collegeInfo = [
  { name: 'Vrindavan College', area: 'Vrindavan', type: 'Degree College', icon: '🎓' },
  { name: 'Braj Institute of Technology', area: 'Mathura', type: 'Engineering', icon: '🎓' },
  { name: 'Agra University (Affiliated)', area: 'Mathura', type: 'University Affiliated', icon: '🏛️' },
];

const upcomingEvents = [
  { name: 'Janmashtami', date: 'August 2025', type: 'Festival', description: 'Celebration of Lord Krishna\'s birth. Massive events at all temples.', icon: '🎊' },
  { name: 'Holi - Lathmar Holi', date: 'March 2025', type: 'Festival', description: 'Unique Holi where women playfully beat men. Takes place in Barsana.', icon: '🎨' },
  { name: 'Radhashtami', date: 'September 2025', type: 'Festival', description: 'Celebration of Radha Rani\'s birthday in Barsana and Vrindavan.', icon: '🌸' },
  { name: 'Govardhan Pooja', date: 'November 2025', type: 'Festival', description: 'Day after Diwali. Govardhan Hill is circumambulated by thousands.', icon: '⛰️' },
];

const PlacesPage = ({ category }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const config = categoryConfig[category] || categoryConfig.nearby;

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/places/category/${category}`);
        if (response.data.success && response.data.places.length > 0) {
          setPlaces(response.data.places);
        } else {
          // Fallback to static data if category matches
          const fallback = staticData[config.filter] || staticData.default;
          setPlaces(fallback);
        }
      } catch (err) {
        console.error("Error fetching places:", err);
        const fallback = staticData[config.filter] || staticData.default;
        setPlaces(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [category, config.filter]);

  const data = places;

  // Special render for analytics
  if (category === 'analytics') {
    return (
      <div className="places-page">
        <div className="places-page-header" style={{ backgroundColor: config.color, borderBottom: `3px solid ${config.accent}` }}>
          <div className="header-icon">{config.icon}</div>
          <div>
            <h1>{config.title}</h1>
            <p>{config.description}</p>
          </div>
        </div>
        <div className="analytics-grid">
          <div className="analytics-card" style={{ borderTop: `4px solid #5a54a7` }}><h2>200+</h2><p>Total Real Places</p></div>
          <div className="analytics-card" style={{ borderTop: `4px solid #10b981` }}><h2>20</h2><p>Cafes & Restaurants</p></div>
          <div className="analytics-card" style={{ borderTop: `4px solid #f59e0b` }}><h2>20</h2><p>Top Markets</p></div>
          <div className="analytics-card" style={{ borderTop: `4px solid #e11d48` }}><h2>20</h2><p>Famous Temples</p></div>
          <div className="analytics-card" style={{ borderTop: `4px solid #0ea5e9` }}><h2>20</h2><p>Holy Ghats</p></div>
          <div className="analytics-card" style={{ borderTop: `4px solid #a855f7` }}><h2>20</h2><p>Colleges</p></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="places-page loading">
        <div className="loader-container">
          <div className="loader"></div>
          <p>Exploring {config.title}...</p>
        </div>
      </div>
    );
  }

  // Default grid for places (covers all general categories)
  return (
    <div className="places-page">
      <div className="places-page-header" style={{ backgroundColor: config.color, borderBottom: `3px solid ${config.accent}` }}>
        <div className="header-icon">{config.icon}</div>
        <div>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
      </div>

      <div className="places-grid">
        {data.length > 0 ? data.map((place, index) => (
          <div key={index} className="place-card" style={{ borderTop: `4px solid ${config.accent}` }}>
            <div className="place-card-icon" style={{ backgroundColor: config.color }}>{place.icon || config.icon}</div>
            <div className="place-card-content">
              <h3>{place.name}</h3>
              <span className="place-area-badge">{place.area || place.city}</span>
              <p className="place-description">{place.description}</p>

              <div className="place-meta">
                {place.bestTime && <span>🕐 <strong>Best Time:</strong> {place.bestTime}</span>}
                {place.timings && <span>🕐 <strong>Timings:</strong> {place.timings}</span>}
                {place.entry_fee && <span>💰 <strong>Entry:</strong> {place.entry_fee}</span>}
              </div>

              <div className="place-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-view-details" 
                  onClick={() => {
                    if (place.id) {
                      navigate(`/dashboard/place/${place.id}`);
                    } else {
                      console.warn("Place ID missing for:", place.name);
                    }
                  }}
                  style={{ background: config.accent, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', flex: 1, cursor: 'pointer' }}
                >
                  View Details
                </button>
                <button 
                  className="btn-get-directions"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat || place.name},${place.lng || place.area}`, '_blank')}
                  style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Directions
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="no-data">No places found for this category yet.</div>
        )}
      </div>
    </div>
  );
};

export default PlacesPage;

