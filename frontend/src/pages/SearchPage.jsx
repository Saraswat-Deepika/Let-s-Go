import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PlacesPage.css';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.warn("Geolocation permission denied:", err);
          setUserLocation({ lat: null, lng: null });
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { q: query };
        if (userLocation?.lat) {
          params.lat = userLocation.lat;
          params.lng = userLocation.lng;
        }

        // Fetch primary search results
        const searchRes = await axios.get('http://localhost:5000/api/search', { params });
        if (searchRes.data.success) {
          setResults(searchRes.data.results);
        }

        // Fetch trending recommendations
        const trendRes = await axios.get('http://localhost:5000/api/search/trending', { params: { limit: 6 } });
        if (trendRes.data.success) {
          // Filter out results already in the main search
          const resultIds = new Set(searchRes.data.results.map(r => r.id));
          const filteredTrends = trendRes.data.trending.filter(t => !resultIds.has(t.id));
          setRecommendations(filteredTrends);
        }

      } catch (err) {
        console.error("Search error:", err);
        setError("Unable to complete search. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, userLocation]);

  const PlaceCard = ({ place, isRecommendation = false }) => (
    <div className={`place-card ${isRecommendation ? 'recommendation-card' : ''}`} style={{ borderTop: isRecommendation ? `4px solid #f59e0b` : `4px solid #3b82f6` }}>
      <div className="place-card-icon" style={{ backgroundColor: isRecommendation ? '#fff9eb' : '#eff6ff' }}>
        {place.category === 'Temple' ? '🏛️' : place.category === 'Cafe' ? '☕' : '📍'}
      </div>
      <div className="place-card-content">
        <div className="place-card-header">
          <h3>{place.name}</h3>
          {place.distance && <span className="distance-badge">{Math.round(place.distance / 1000 * 10) / 10}km away</span>}
        </div>
        <div className="place-sub-header">
          <span className="place-area-badge">{place.area || place.city}</span>
          {isRecommendation && <span className="recommendation-badge" style={{ backgroundColor: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' }}>🔥 Trending</span>}
        </div>
        <p className="place-description">{place.description || `Perfect spot for ${place.category.toLowerCase()} lovers.`}</p>
        
        <div className="place-meta">
          {place.rating > 0 && <span>⭐ <strong>{place.rating}</strong></span>}
          {place.views && <span>👁️ {place.views} views</span>}
        </div>

        <div className="place-actions">
          <button className="btn-view-details" onClick={() => navigate(`/dashboard/place/${place.id}`)}>View Details</button>
          <button 
            className="btn-get-directions"
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, '_blank')}
          >
            Directions
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="places-page search-results-page">
      <div className="places-page-header" style={{ backgroundColor: '#f0f9ff', borderBottom: '3px solid #3b82f6', marginBottom: '30px' }}>
        <div className="header-icon">🔍</div>
        <div>
          <h1>Search Results</h1>
          <p>Results for: <strong>"{query}"</strong></p>
        </div>
      </div>

      {loading ? (
        <div className="loading-container"><div className="loader"></div><p>Searching Vrindavan...</p></div>
      ) : (
        <div className="search-content-wrapper" style={{ padding: '0 20px' }}>
          {results.length > 0 ? (
            <div className="results-section" style={{ marginBottom: '50px' }}>
              <h2 className="section-title" style={{ marginBottom: '20px', color: '#1e293b' }}>Exact Matches</h2>
              <div className="places-grid">
                {results.map((place, i) => <PlaceCard key={i} place={place} />)}
              </div>
            </div>
          ) : (
            <div className="no-data" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '15px', marginBottom: '50px' }}>
              <h3>No direct matches found for "{query}"</h3>
              <p>But don't worry, here are some popular places you might like!</p>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="recommendations-section">
              <h2 className="section-title" style={{ marginBottom: '20px', color: '#b45309' }}>Recommended for You</h2>
              <div className="places-grid">
                {recommendations.map((place, i) => <PlaceCard key={i} place={place} isRecommendation={true} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
