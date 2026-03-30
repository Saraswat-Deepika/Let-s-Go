import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const suggestionRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions as-you-type
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/search/suggest?q=${query}`);
        if (response.data.success) {
          setSuggestions(response.data.suggestions);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowSuggestions(false);
      navigate(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const onSuggestionClick = (suggestion) => {
    setQuery(suggestion.value);
    setShowSuggestions(false);
    navigate(`/dashboard/search?q=${encodeURIComponent(suggestion.value)}`);
  };

  return (
    <div className="admin-navbar">
      <div className="navbar-search" ref={suggestionRef}>
        <div className="search-box">
          <span className="search-icon" onClick={() => query.trim() && navigate(`/dashboard/search?q=${encodeURIComponent(query.trim())}`)}>🔍</span>
          <input 
            type="text" 
            placeholder="Search for places (e.g. Banke Bihari, Temple)..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions-dropdown">
              {suggestions.map((s, i) => (
                <div key={i} className="suggestion-item" onClick={() => onSuggestionClick(s)}>
                  <span className="suggestion-icon">{s.type === 'place' ? '🏛️' : '🏷️'}</span>
                  <div className="suggestion-info">
                    <span className="suggestion-text">{s.value}</span>
                    <span className="suggestion-meta">{s.category || (s.type === 'category' ? 'Category' : '')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="navbar-actions">
        <div className="action-icons">
          <span className="notify-icon">🔔</span>
          <span className="notify-icon second">🔔</span>
        </div>
        
        <button className="btn-add-place-nav">
          + Add Place
        </button>
        
        <div className="user-profile-nav">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" 
            alt="Admin" 
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;