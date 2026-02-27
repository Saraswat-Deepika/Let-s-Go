const axios = require('axios');

class WeatherService {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    async getWeather(city) {
        try {
            if (!this.apiKey || this.apiKey.includes('your_')) {
                return this.getMockWeather(city);
            }

            const response = await axios.get(`${this.baseUrl}/weather`, {
                params: {
                    q: city,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            return {
                temp: response.data.main.temp,
                condition: response.data.weather[0].main,
                icon: response.data.weather[0].icon,
                description: response.data.weather[0].description,
                humidity: response.data.main.humidity,
                windSpeed: response.data.wind.speed
            };
        } catch (error) {
            console.error('Weather API Error:', error);
            return this.getMockWeather(city);
        }
    }

    getMockWeather(city) {
        return {
            temp: 25,
            condition: 'Clear',
            icon: '01d',
            description: 'clear sky',
            humidity: 40,
            windSpeed: 5
        };
    }
}

module.exports = new WeatherService();
