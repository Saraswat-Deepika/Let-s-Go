const express = require('express');
const router = express.Router();
const weatherService = require('../services/weather.service');
const placesService = require('../services/places.service');
const countryService = require('../services/country.service');
const flightService = require('../services/flight.service');

// Weather endpoint
router.get('/weather', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ message: 'City is required' });

        const weather = await weatherService.getWeather(city);
        res.json(weather);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Places endpoint (Real-time)
router.get('/places', async (req, res) => {
    try {
        const { city, query = 'tourist attractions' } = req.query;
        if (!city) return res.status(400).json({ message: 'City is required' });

        const places = await placesService.searchPlaces(query, city);
        res.json({ places });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Country info endpoint
router.get('/country/:name', async (req, res) => {
    try {
        const info = await countryService.getCountryInfo(req.params.name);
        if (!info) return res.status(404).json({ message: 'Country not found' });
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Flights endpoint
router.get('/flights', async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        if (!origin || !destination || !date) {
            return res.status(400).json({ message: 'Origin, destination, and date are required' });
        }

        const flights = await flightService.searchFlights(origin, destination, date);
        res.json({ flights });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
