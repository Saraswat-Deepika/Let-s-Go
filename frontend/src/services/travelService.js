import axios from 'axios';

const API_URL = 'http://localhost:5000/api/external';

const travelService = {
    getWeather: async (city) => {
        try {
            const response = await axios.get(`${API_URL}/weather?city=${city}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching weather:', error);
            return null;
        }
    },

    getPlaces: async (city, query = 'tourist attractions') => {
        try {
            const response = await axios.get(`${API_URL}/places?city=${city}&query=${query}`);
            return response.data.places;
        } catch (error) {
            console.error('Error fetching places:', error);
            return [];
        }
    },

    getCountryInfo: async (countryName) => {
        try {
            const response = await axios.get(`${API_URL}/country/${countryName}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching country info:', error);
            return null;
        }
    },

    getFlights: async (origin, destination, date) => {
        try {
            const response = await axios.get(`${API_URL}/flights`, {
                params: { origin, destination, date }
            });
            return response.data.flights;
        } catch (error) {
            console.error('Error fetching flights:', error);
            return [];
        }
    }
};

export default travelService;
