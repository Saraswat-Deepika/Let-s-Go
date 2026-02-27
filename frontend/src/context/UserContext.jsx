import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    budget: 'medium',
    interests: [],
    dietaryRestrictions: [],
    accessibility: false
  });

  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [currentCity, setCurrentCity] = useState(JSON.parse(localStorage.getItem('currentCity')) || { name: 'Mathura' });

  // Load user preferences from backend
  const loadUserPreferences = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/preferences');
      setPreferences(response.data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, []);

  // Update preferences
  const updatePreferences = async (newPreferences) => {
    try {
      const response = await axios.put('http://localhost:5000/api/user/preferences', newPreferences);
      setPreferences(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Add to favorites
  const addToFavorites = async (placeId) => {
    try {
      await axios.post('http://localhost:5000/api/user/favorites', { placeId });
      setFavorites(prev => [...prev, placeId]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (placeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/favorites/${placeId}`);
      setFavorites(prev => prev.filter(id => id !== placeId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Add recent search
  const addRecentSearch = (search) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== search);
      return [search, ...filtered].slice(0, 10);
    });
  };

  // Set current city for exploration
  const selectCity = (city) => {
    setCurrentCity(city);
    localStorage.setItem('currentCity', JSON.stringify(city));
  };

  return (
    <UserContext.Provider value={{
      preferences,
      favorites,
      recentSearches,
      currentCity,
      loadUserPreferences,
      updatePreferences,
      addToFavorites,
      removeFromFavorites,
      addRecentSearch,
      selectCity,
      isFavorite: (placeId) => favorites.includes(placeId)
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);