const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Place = require('../models/Place');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const realPlaces = [
    // --- VRINDAVAN TEMPLES ---
    {
        name: 'Banke Bihari Temple',
        description: 'Vrindavan\'s most iconic temple, dedicated to Krishna. The deity is worshipped as a child. Known for its swinging curtain ritual and intense devotion.',
        category: 'Temple',
        subcategory: 'Krishna Bhakti',
        city: 'Vrindavan',
        location: 'Godhuli Puram',
        address: { street: 'Bihari Pura', area: 'Vrindavan', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5797, lng: 77.6906 },
        timings: '7:45 AM - 12:00 PM, 5:30 PM - 9:30 PM (Adjusts seasonally)',
        entry_fee: 'Free',
        popularity: 'Very High',
        bestTime: 'Morning Aarti or Evening Darshan',
        suitableFor: ['All', 'Devotees', 'Families'],
        tags: ['spiritual', 'krishna', 'iconic', 'holi'],
        rating: 4.9,
        isActive: true
    },
    {
        name: 'Prem Mandir',
        description: 'A masterpiece of white marble architecture, spread over 54 acres. It features intricate carvings depicting the Leelas of Radha-Krishna and Lord Ram.',
        category: 'Temple',
        subcategory: 'Spiritual',
        city: 'Vrindavan',
        location: 'Chattikara Road',
        address: { street: 'Raman Reti', area: 'Vrindavan', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5725, lng: 77.6725 },
        timings: '5:30 AM - 12:00 PM, 4:30 PM - 8:30 PM',
        entry_fee: 'Free',
        popularity: 'Very High',
        bestTime: 'Evening (7:30 PM Light Show)',
        suitableFor: ['Tourists', 'Families', 'All'],
        tags: ['architecture', 'light show', 'marble', 'photo-worthy'],
        rating: 4.8,
        isActive: true
    },
    {
        name: 'ISKCON Vrindavan',
        description: 'Also known as Sri Sri Krishna Balaram Mandir. A global center for Krishna consciousness, featuring stunning deities and constant chanting (Akhanda Harinam Kirtan).',
        category: 'Temple',
        subcategory: 'Spiritual',
        city: 'Vrindavan',
        location: 'Raman Reti',
        address: { street: 'Bhakti Vedant Swami Marg', area: 'Vrindavan', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5714, lng: 77.6800 },
        timings: '4:30 AM - 1:00 PM, 4:30 PM - 8:30 PM',
        entry_fee: 'Free',
        popularity: 'Very High',
        bestTime: 'Sandhya Aarti (Evening)',
        suitableFor: ['Devotees', 'Students', 'Tourists'],
        tags: ['iskcon', 'kirtan', 'international', 'clean'],
        rating: 4.9,
        isActive: true
    },
    {
        name: 'Radha Raman Temple',
        description: 'One of the oldest temples in Vrindavan, housing a self-manifested deity from a Saligram Shila. The temple is known for its rigorous and traditional worship standards.',
        category: 'Temple',
        subcategory: 'Radha Krishna',
        city: 'Vrindavan',
        location: 'Nagar Nigram',
        address: { street: 'Panchayati Mandir Road', area: 'Vrindavan', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5850, lng: 77.6980 },
        timings: '8:00 AM - 12:30 PM, 6:00 PM - 9:00 PM',
        entry_fee: 'Free',
        popularity: 'High',
        bestTime: 'Early Morning',
        suitableFor: ['Devotees', 'Tourists'],
        tags: ['historical', 'traditional', 'sacred'],
        rating: 4.8,
        isActive: true
    },
    {
        name: 'Nidhivan',
        description: 'A mystical forest garden where it is believed Krishna performs Raslila with Radha every night. The trees are small, twisted, and paired.',
        category: 'Attraction',
        subcategory: 'Sacred Grove',
        city: 'Vrindavan',
        location: 'Gopal Pura',
        address: { street: 'Nidhivan Road', area: 'Vrindavan', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5815, lng: 77.6970 },
        timings: '5:00 AM - 7:00 PM',
        entry_fee: 'Free',
        popularity: 'High',
        bestTime: 'Morning',
        suitableFor: ['Families', 'Devotees'],
        tags: ['mystery', 'legend', 'nature', 'spiritual'],
        rating: 4.7,
        isActive: true
    },
    {
        name: 'Kesi Ghat',
        description: 'The principal bathing ghat on the Yamuna river in Vrindavan. Legend says Krishna killed Kesi demon here. The steps are magnificent and sunset is beautiful.',
        category: 'Ghat',
        subcategory: 'Historical',
        city: 'Vrindavan',
        location: 'Yamuna Bank',
        address: { street: 'Parikrama Marg', area: 'Vrindavan', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5855, lng: 77.7011 },
        timings: 'Open 24 hours (Best for Aarti: 6:00 PM)',
        entry_fee: 'Free',
        popularity: 'High',
        bestTime: 'Sunset',
        suitableFor: ['Tourists', 'Devotees', 'Students'],
        tags: ['river', 'yamuna', 'aarti', 'photo-worthy'],
        rating: 4.6,
        isActive: true
    },

    // --- MATHURA TEMPLES ---
    {
        name: 'Shree Krishna Janmabhoomi',
        description: 'The birthplace of Lord Krishna. A sacred complex containing the Keshavdeva temple and the Garbha Griha where Krishna was born in a prison cell.',
        category: 'Temple',
        subcategory: 'Holiest Site',
        city: 'Mathura',
        location: 'Deeg Gate',
        address: { street: 'Janmabhoomi Path', area: 'Mathura City', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001' },
        coordinates: { lat: 27.5055, lng: 77.6713 },
        timings: '5:00 AM - 12:00 PM, 4:00 PM - 9:30 PM',
        entry_fee: 'Free',
        popularity: 'Very High',
        bestTime: 'Morning or Evening',
        suitableFor: ['All', 'Families', 'Devotees'],
        tags: ['birthplace', 'history', 'spiritual', 'security-checked'],
        rating: 4.9,
        isActive: true
    },
    {
        name: 'Dwarkadhish Temple (Mathura)',
        description: 'Prominent temple in Mathura city, dedicated to Lord Dwarkadheesh. Famous for its Rajasthani architecture and colorful paintings.',
        category: 'Temple',
        subcategory: 'Krishna Bhakti',
        city: 'Mathura',
        location: 'Near Vishram Ghat',
        address: { street: 'Raja Dhiraj Marg', area: 'Mathura City', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001' },
        coordinates: { lat: 27.5065, lng: 77.6830 },
        timings: '6:30 AM - 10:30 AM, 4:00 PM - 7:00 PM',
        entry_fee: 'Free',
        popularity: 'High',
        bestTime: 'Morning',
        suitableFor: ['Families', 'Devotees'],
        tags: ['architecture', 'old-city', 'paintings', 'traditional'],
        rating: 4.8,
        isActive: true
    },
    {
        name: 'Vishram Ghat (Mathura)',
        description: 'The holiest ghat in Mathura where Lord Krishna rested after killing Kamsa. The point from which Mathura traditional parikrama starts and ends.',
        category: 'Ghat',
        subcategory: 'Spiritual',
        city: 'Mathura',
        location: 'Riverbank',
        address: { street: 'Vishram Bazar', area: 'Mathura City', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001' },
        coordinates: { lat: 27.5050, lng: 77.6850 },
        timings: 'Open 24 hours (Best for Aarti: 7:00 PM)',
        entry_fee: 'Free',
        popularity: 'High',
        bestTime: 'Evening Aarti',
        suitableFor: ['All', 'Families', 'Devotees'],
        tags: ['yamuna', 'aarti', 'tradition', 'boat-ride'],
        rating: 4.7,
        isActive: true
    },

    // --- DINING & CAFES ---
    {
        name: 'Brijwasi Mithai Wala (Holi Gate)',
        description: 'Mathura\'s most famous sweet shop. Renowned for "Mathura Ke Pede" and traditional snacks like Kachori and Samosa.',
        category: 'Restaurant',
        subcategory: 'Sweets & Snacks',
        city: 'Mathura',
        location: 'Holi Gate',
        address: { street: 'Tilak Dwar', area: 'Holi Gate', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001' },
        coordinates: { lat: 27.4950, lng: 77.6750 },
        price: 200,
        priceRange: 'low',
        popularity: 'Very High',
        suitableFor: ['Families', 'Tourists', 'Students'],
        tags: ['pede', 'sweets', 'iconic', 'local-food'],
        rating: 4.7,
        isActive: true
    },
    {
        name: 'Govinda\'s (ISKCON Vrindavan)',
        description: 'Pure vegetarian restaurant serving Sattvic food. Offers multi-cuisine options from Indian to Continental, all offered to Krishna first.',
        category: 'Restaurant',
        subcategory: 'Sattvic',
        city: 'Vrindavan',
        location: 'Raman Reti',
        address: { street: 'ISKCON Campus', area: 'Vrindavan', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5714, lng: 77.6805 },
        price: 500,
        priceRange: 'medium',
        popularity: 'High',
        suitableFor: ['All', 'Tourists', 'Families'],
        tags: ['sattvic', 'veg', 'clean', 'hygienic'],
        rating: 4.6,
        isActive: true
    },
    {
        name: '11 Flowers Rooftop Cafe',
        description: 'Modern rooftop cafe in Vrindavan with a views of the town. Popular among youth and international tourists for its relaxed vibe and good food.',
        category: 'Cafe',
        subcategory: 'Multi-cuisine',
        city: 'Vrindavan',
        location: 'Near Banke Bihari',
        address: { street: 'Main Road', area: 'Vrindavan', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5815, lng: 77.6970 },
        price: 400,
        priceRange: 'medium',
        popularity: 'Medium',
        suitableFor: ['Students', 'Tourists', 'Youth'],
        tags: ['rooftop', 'view', 'youth-spot', 'relaxed'],
        rating: 4.4,
        isActive: true
    },

    // --- EMERGENCY & UTILITIES ---
    {
        name: 'Rama Krishna Mission Hospital',
        description: 'Reputed charitable hospital in Vrindavan providing quality healthcare services. One of the largest medical facilities in the town.',
        category: 'Emergency',
        subcategory: 'Hospital',
        city: 'Vrindavan',
        location: 'Parikrama Marg',
        address: { street: 'Arundhati Colony', area: 'Vrindavan', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5800, lng: 77.6850 },
        contact: { phone: '0565 244 2310' },
        popularity: 'High',
        tags: ['medical', 'charity', 'emergency', 'healthcare'],
        rating: 4.5,
        isActive: true
    },
    {
        name: 'Niyati Hospital',
        description: 'Modern multi-specialty hospital in Mathura located on the highway, suitable for critical emergencies.',
        category: 'Emergency',
        subcategory: 'Hospital',
        city: 'Mathura',
        location: 'Agra-Delhi Highway',
        address: { street: 'NH-2', area: 'Mathura City', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001' },
        coordinates: { lat: 27.4800, lng: 77.6700 },
        contact: { phone: '0565 243 1111' },
        popularity: 'Medium',
        tags: ['emergency', 'multi-specialty', 'highway-access'],
        rating: 4.2,
        isActive: true
    },
    {
        name: 'Vrindavan Police Station',
        description: 'The main police headquarters for Vrindavan town to assist with security, lost items, and reporting.',
        category: 'Emergency',
        subcategory: 'Police',
        city: 'Vrindavan',
        location: 'Main Road',
        address: { street: 'Main Market Road', area: 'Vrindavan', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5750, lng: 77.6950 },
        contact: { phone: '100' },
        popularity: 'Medium',
        tags: ['safety', 'security', 'police', 'support'],
        rating: 4.0,
        isActive: true
    },

    // --- ADDITIONAL SPIRITUAL SPOTS ---
    {
        name: 'Radhavallabh Temple',
        description: 'A historic temple where the concept of Radha as the supreme is prominent. The morning Darshan is world famous.',
        category: 'Temple',
        subcategory: 'Radha Bhakti',
        city: 'Vrindavan',
        location: 'Banke Bihari Area',
        address: { street: 'Radhavallabh Ghera', city: 'Vrindavan', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.5820, lng: 77.6950 },
        timings: '5:00 AM - 9:00 PM',
        popularity: 'High',
        tags: ['ancient', 'unique-worship', 'radha'],
        rating: 4.9,
        isActive: true
    },
    {
        name: 'Shahji Temple',
        description: 'Known as the "Marble Temple", it features stunning white marble architecture and huge pillars. Famous for its Rasmandal or Vasanti Kamra.',
        category: 'Temple',
        subcategory: 'Architecture',
        city: 'Vrindavan',
        location: 'Near Godhuli Puram',
        address: { street: 'Shahji Temple Road', city: 'Vrindavan', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.5780, lng: 77.6920 },
        popularity: 'Medium',
        tags: ['marble', 'design', 'luxurious', 'history'],
        rating: 4.5,
        isActive: true
    },
    {
        name: 'Gopeshwar Mahadev',
        description: 'The only temple in Vrindavan where Lord Shiva is worshipped as a Gopi (cowherd girl), symbolizing his desire to enter the Raslila.',
        category: 'Temple',
        subcategory: 'Shiva',
        city: 'Vrindavan',
        location: 'Vrindavan City',
        address: { street: 'Bansighat', city: 'Vrindavan', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.5860, lng: 77.7000 },
        popularity: 'High',
        tags: ['shiva', 'legend', 'gopi', 'spiritual'],
        rating: 4.8,
        isActive: true
    },
    {
        name: 'Kusum Sarovar',
        description: 'A beautiful historical sandstone monument on the Govardhan Parikrama path, known for its serene pond and intricate architecture.',
        category: 'Attraction',
        subcategory: 'Heritage',
        city: 'Govardhan',
        location: 'Parikrama Marg',
        address: { street: 'Govardhan-Radha Kund Road', city: 'Govardhan', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.5020, lng: 77.4850 },
        popularity: 'High',
        tags: ['heritage', 'pond', 'architecture', 'photo-worthy'],
        rating: 4.7,
        isActive: true
    },
    {
        name: 'Radha Rani Temple (Barsana)',
        description: 'The birthplace of Radha Devi, situated on a hill. It requires a climb of about 250 steps and offers panoramic views.',
        category: 'Temple',
        subcategory: 'Radha Bhakti',
        city: 'Barsana',
        location: 'Hilltop',
        address: { street: 'Barsana Hill', city: 'Barsana', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.6400, lng: 77.3800 },
        popularity: 'Very High',
        tags: ['radha-birthplace', 'hilltop', 'legend', 'barsana'],
        rating: 4.9,
        isActive: true
    }
];

const seedRealData = async () => {
    try {
        console.log('🚀 Starting real data seeding process...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-city-guide');
        console.log('📦 Connected to MongoDB.');

        // Clear existing data to ensure "real only" data
        await Place.deleteMany({ isActive: true });
        console.log('🧹 Cleared existing active places.');

        // Insert new real data
        const inserted = await Place.insertMany(realPlaces);
        console.log(`✅ Successfully inserted ${inserted.length} real locations into the database!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding real data:', error);
        process.exit(1);
    }
};

seedRealData();
