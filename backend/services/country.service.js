const axios = require('axios');

class CountryService {
    constructor() {
        this.baseUrl = 'https://restcountries.com/v3.1';
    }

    async getCountryInfo(countryName) {
        try {
            const response = await axios.get(`${this.baseUrl}/name/${countryName}`);
            const country = response.data[0];

            return {
                name: country.name.common,
                flag: country.flags.svg,
                currency: Object.values(country.currencies)[0].name,
                currencySymbol: Object.values(country.currencies)[0].symbol,
                languages: Object.values(country.languages),
                population: country.population,
                capital: country.capital[0]
            };
        } catch (error) {
            console.error('Country API Error:', error);
            return null;
        }
    }
}

module.exports = new CountryService();
