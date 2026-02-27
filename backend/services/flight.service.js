const axios = require('axios');
const qs = require('qs');

class FlightService {
    constructor() {
        this.clientId = process.env.AMADEUS_CLIENT_ID;
        this.clientSecret = process.env.AMADEUS_CLIENT_SECRET;
        this.baseUrl = 'https://test.api.amadeus.com/v2';
        this.authUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        if (this.accessToken && this.tokenExpiry > Date.now()) {
            return this.accessToken;
        }

        try {
            const response = await axios.post(this.authUrl, qs.stringify({
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: this.clientSecret
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
            return this.accessToken;
        } catch (error) {
            console.error('Amadeus Auth Error:', error);
            return null;
        }
    }

    async searchFlights(origin, destination, date) {
        try {
            if (!this.clientId || this.clientId.includes('your_')) {
                return this.getMockFlights(origin, destination, date);
            }

            const token = await this.getAccessToken();
            if (!token) return this.getMockFlights(origin, destination, date);

            const response = await axios.get(`${this.baseUrl}/shopping/flight-offers`, {
                params: {
                    originLocationCode: origin,
                    destinationLocationCode: destination,
                    departureDate: date,
                    adults: 1,
                    max: 10
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data.data.map(offer => this.formatFlight(offer));
        } catch (error) {
            console.error('Amadeus Flight API Error:', error);
            return this.getMockFlights(origin, destination, date);
        }
    }

    formatFlight(offer) {
        const itinerary = offer.itineraries[0];
        const segment = itinerary.segments[0];
        return {
            id: offer.id,
            airline: segment.carrierCode,
            flightNumber: segment.number,
            departure: segment.departure.at,
            arrival: segment.arrival.at,
            duration: itinerary.duration,
            price: offer.price.total,
            currency: offer.price.currency
        };
    }

    getMockFlights(origin, destination, date) {
        return [
            {
                id: 'mock1',
                airline: '6E',
                flightNumber: '123',
                departure: `${date}T08:00:00`,
                arrival: `${date}T10:30:00`,
                duration: 'PT2H30M',
                price: '4500.00',
                currency: 'INR'
            },
            {
                id: 'mock2',
                airline: 'AI',
                flightNumber: '456',
                departure: `${date}T14:00:00`,
                arrival: `${date}T16:15:00`,
                duration: 'PT2H15M',
                price: '5200.00',
                currency: 'INR'
            }
        ];
    }
}

module.exports = new FlightService();
