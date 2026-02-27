const axios = require('axios');

class PlacesService {
    constructor() {
        this.apiKey = process.env.GOOGLE_PLACES_API_KEY;
        this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
    }

    async searchPlaces(query, city) {
        try {
            if (!this.apiKey || this.apiKey.includes('your_')) {
                return this.getMockPlaces(query, city);
            }

            const response = await axios.get(`${this.baseUrl}/textsearch/json`, {
                params: {
                    query: `${query} in ${city}`,
                    key: this.apiKey
                }
            });

            return response.data.results.map(place => this.formatPlace(place));
        } catch (error) {
            console.error('Google Places API Error:', error);
            return this.getMockPlaces(query, city);
        }
    }

    async getNearbyPlaces(lat, lng, radius = 5000, type = 'tourist_attraction') {
        try {
            if (!this.apiKey || this.apiKey.includes('your_')) {
                return this.getMockPlaces('nearby', 'this area');
            }

            const response = await axios.get(`${this.baseUrl}/nearbysearch/json`, {
                params: {
                    location: `${lat},${lng}`,
                    radius,
                    type,
                    key: this.apiKey
                }
            });

            return response.data.results.map(place => this.formatPlace(place));
        } catch (error) {
            console.error('Google Places API Error:', error);
            return this.getMockPlaces('nearby', 'this area');
        }
    }

    formatPlace(googlePlace) {
        return {
            id: googlePlace.place_id,
            name: googlePlace.name,
            description: googlePlace.editorial_summary?.overview || 'A great place to visit',
            category: googlePlace.types?.[0] || 'Place',
            rating: googlePlace.rating || 0,
            priceLevel: googlePlace.price_level,
            address: googlePlace.formatted_address || googlePlace.vicinity,
            location: googlePlace.geometry?.location,
            image: googlePlace.photos?.[0]
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${googlePlace.photos[0].photo_reference}&key=${this.apiKey}`
                : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
        };
    }

    getMockPlaces(query, city) {
        console.log(`Using mock places for ${query} in ${city}`);
        return [
            {
                id: 'mock1',
                name: `Famous ${query || 'Spot'} in ${city}`,
                description: `This is a beautiful ${query || 'place'} in the heart of ${city}.`,
                category: 'Tourist Attraction',
                rating: 4.5,
                priceRange: 'medium',
                location: city,
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
            },
            {
                id: 'mock2',
                name: `${city} Heritage Site`,
                description: 'Experience the rich culture and history of the city.',
                category: 'Historical',
                rating: 4.8,
                priceRange: 'free',
                location: city,
                image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24'
            },
            {
                id: 'mock3',
                name: 'The Grand Mall',
                description: 'One stop destination for shopping and entertainment.',
                category: 'Shopping',
                rating: 4.2,
                priceRange: 'high',
                location: city,
                image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf'
            }
        ];
    }
}

module.exports = new PlacesService();
