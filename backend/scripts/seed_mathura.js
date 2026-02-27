const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Place = require('../models/Place');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const mathuraPlaces = [
    // --- TEMPLES & SPIRITUAL ---
    // --- TEMPLES & SPIRITUAL ---
    {
        name: 'Shree Krishna Janmabhoomi Temple',
        description: 'The holiest site in Mathura, believed to be the exact birthplace of Lord Krishna. Part of the Sapta Puri (seven sacred cities). The complex includes the prison cell (Garbha Griha) where Krishna was born.',
        category: 'Temple',
        subcategory: 'Religious',
        city: 'Mathura',
        location: 'Deeg Gate area',
        address: { street: 'Deeg Gate Road', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001' },
        coordinates: { lat: 27.5055, lng: 77.6713 },
        price: 0, priceRange: 'free', tags: ['krishna', 'history', 'holiest', 'spiritual', 'sapta puri', 'janmashtami'], rating: 4.9, crowdLevel: 'high', isActive: true
    },
    {
        name: 'Dwarkadhish Temple',
        description: 'One of the oldest and largest temples in Mathura, famous for its amazing architecture and paintings. Dedicated to Lord Dwarkadheesh (Lord Krishna).',
        category: 'Temple',
        subcategory: 'Krishna Bhakti',
        city: 'Mathura',
        location: 'Near Vishram Ghat',
        address: { street: 'Pathwari Mandir', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001' },
        coordinates: { lat: 27.5065, lng: 77.6830 },
        price: 0, priceRange: 'free', tags: ['architecture', 'oldest', 'krishna', 'history'], rating: 4.8, crowdLevel: 'high', isActive: true
    },
    {
        name: 'Banke Bihari Temple',
        description: 'The most popular Krishna temple in Vrindavan. Known for its unique Seva and the practice of pulling curtains in front of the deity frequently. Famous for Holi celebrations.',
        category: 'Temple',
        subcategory: 'Krishna Bhakti',
        city: 'Vrindavan',
        location: 'Vrindavan',
        address: { street: 'Bihari Pura', city: 'Vrindavan', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5797, lng: 77.6906 },
        price: 0, priceRange: 'free', tags: ['krishna', 'vrindavan', 'popular', 'holi'], rating: 4.9, crowdLevel: 'high', isActive: true
    },
    {
        name: 'Prem Mandir',
        description: 'A spiritual complex maintained by Jagadguru Kripalu Parishat. Constructed entirely of Italian white marble, it showcases the life of Radha-Krishna and Lord Ram.',
        category: 'Temple',
        subcategory: 'Spiritual',
        city: 'Vrindavan',
        location: 'Chattikara Road',
        address: { street: 'Raman Reti', city: 'Vrindavan', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5725, lng: 77.6725 },
        price: 0, priceRange: 'free', tags: ['architecture', 'light show', 'vrindavan', 'marble'], rating: 4.8, crowdLevel: 'high', isActive: true
    },
    {
        name: 'Vishram Ghat',
        description: 'The main ghat in Mathura on the banks of Yamuna River. Legend says Lord Krishna rested here after killing Kamsa. Famous for the evening Yamuna Aarti.',
        category: 'Spiritual',
        subcategory: 'Ghat',
        city: 'Mathura',
        location: 'Yamuna Riverbank',
        address: { street: 'Vishram Bazar', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001' },
        coordinates: { lat: 27.5050, lng: 77.6850 },
        price: 0, priceRange: 'free', tags: ['yamuna', 'aarti', 'spiritual', 'legend'], rating: 4.7, crowdLevel: 'medium', isActive: true
    },
    {
        name: 'Govardhan Hill',
        description: 'A sacred 8km long hill that Lord Krishna is said to have lifted on his finger for seven days to protect the villagers from heavy rains. A major pilgrimage site for Parikrama.',
        category: 'Spiritual',
        subcategory: 'Sacred Hill',
        city: 'Govardhan',
        location: 'Mathura District',
        address: { street: 'Anyou Road', city: 'Govardhan', state: 'Uttar Pradesh', pincode: '281502' },
        coordinates: { lat: 27.4900, lng: 77.4600 },
        price: 0, priceRange: 'free', tags: ['legend', 'parikrama', 'spiritual', 'krishna'], rating: 4.8, crowdLevel: 'medium', isActive: true
    },
    {
        name: 'Nidhivan',
        description: 'A mysterious sacred grove in Vrindavan where it is believed Radha-Krishna still perform Raslila every night. The trees here have unique twisted shapes.',
        category: 'Spiritual',
        subcategory: 'Sacred Grove',
        city: 'Vrindavan',
        location: 'Gotam Nagar',
        address: { street: 'Nidhivan Road', city: 'Vrindavan', state: 'Uttar Pradesh', pincode: '281121' },
        coordinates: { lat: 27.5815, lng: 77.6970 },
        price: 0, priceRange: 'free', tags: ['legend', 'forest', 'spiritual', 'mystery'], rating: 4.6, crowdLevel: 'medium', isActive: true
    },
    {
        name: 'Mathura Refinery',
        description: 'One of the largest oil refineries in India, owned by Indian Oil Corporation. It is a major economic pillar of the region.',
        category: 'Historical',
        subcategory: 'Industrial',
        city: 'Mathura',
        location: 'Agra-Delhi Highway',
        address: { street: 'NH-19', city: 'Mathura', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.3900, lng: 77.6900 },
        price: 0, priceRange: 'free', tags: ['industry', 'economy', 'landmark'], rating: 4.0, isActive: true
    },

    // --- RESTAURANTS & CAFES ---
    {
        name: 'Brijwasi Mithai Wala',
        description: 'Iconic sweet shop famous for Mathura Ke Pede and traditional North Indian snacks. A must-visit for dairy lovers.',
        category: 'Restaurant',
        subcategory: 'Sweets & Snacks',
        city: 'Mathura',
        location: 'Tilak Dwar',
        address: { street: 'Holi Gate', city: 'Mathura', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.4950, lng: 77.6750 },
        price: 300, priceRange: 'low', tags: ['pede', 'sweets', 'dairy', 'braj-famed'], rating: 4.7, isActive: true
    },
    {
        name: 'The Trunk Rooftop',
        description: 'Rooftop restaurant with great views and a lounge vibe. Perfect for evening dining in Krishna Nagari.',
        category: 'Restaurant',
        subcategory: 'Rooftop',
        city: 'Mathura',
        location: 'Mathura City',
        address: { street: 'Junction Road', city: 'Mathura', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.4924, lng: 77.6737 },
        price: 800, priceRange: 'medium', tags: ['rooftop', 'view', 'lounge'], rating: 4.4, isActive: true
    },
    {
        name: 'Amritsari Rasoi',
        description: 'Highly rated Punjabi cuisine spot. Famous for its authentic North Indian flavors.',
        category: 'Restaurant',
        subcategory: 'Punjabi',
        city: 'Mathura',
        location: 'Mathura City',
        address: { street: 'Krishna Nagar', city: 'Mathura', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.4950, lng: 77.6700 },
        price: 500, priceRange: 'medium', tags: ['punjabi', 'north indian', 'food'], rating: 4.5, isActive: true
    },
    {
        name: 'Govinda\'s Restaurant',
        description: 'Pure vegetarian restaurant near Krishna Janmabhoomi. High-quality sattvic food inspired by ISKCON.',
        category: 'Restaurant',
        subcategory: 'Vegetarian',
        city: 'Mathura',
        location: 'Krishna Nagar',
        address: { street: 'NH2', city: 'Mathura', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.5000, lng: 77.6600 },
        price: 600, priceRange: 'medium', tags: ['veg', 'sattvic', 'iskcon style'], rating: 4.6, isActive: true
    },
    {
        name: 'Loft Cafe',
        description: 'Pure veg cafe with North Indian and Italian options. Trendy spot for youngsters in Braj Bhoomi.',
        category: 'Cafe',
        subcategory: 'Multi-cuisine',
        city: 'Mathura',
        location: 'Mathura City',
        address: { street: 'Dampier Nagar', city: 'Mathura', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.4920, lng: 77.6720 },
        price: 500, priceRange: 'medium', tags: ['cafe', 'italian', 'pure veg'], rating: 4.4, isActive: true
    },

    // --- FUN & CLUBS ---
    {
        name: 'Hype - Night Club',
        description: 'The premier night club in Mathura for disco and dancing. A rare nightlife spot in the religious city.',
        category: 'Entertainment',
        subcategory: 'Nightlife',
        city: 'Mathura',
        location: 'Mathura City',
        address: { street: 'Junction Road', city: 'Mathura', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.4850, lng: 77.6800 },
        price: 1500, priceRange: 'high', tags: ['disco', 'party', 'nightlife'], rating: 4.0, isActive: true
    },
    {
        name: 'ONE SHOT SNOOKER',
        description: 'Popular snooker and gaming club for sports enthusiasts.',
        category: 'Gaming',
        subcategory: 'Snooker',
        city: 'Mathura',
        location: 'Mathura City',
        address: { street: 'Krishna Nagar', city: 'Mathura', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.4970, lng: 77.6650 },
        price: 200, priceRange: 'low', tags: ['gaming', 'snooker', 'sports'], rating: 4.5, isActive: true
    },

    // --- OTHER ATTRACTIONS ---
    {
        name: 'Mathura Museum',
        description: 'Archaeological and art museum with ancient collections from Kushana and Gupta periods. Famous for the Mathura School of Art.',
        category: 'Museum',
        subcategory: 'History',
        city: 'Mathura',
        location: 'Dampier Nagar',
        address: { street: 'Museum Road', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001' },
        coordinates: { lat: 27.4920, lng: 77.6720 },
        price: 50, priceRange: 'low', tags: ['history', 'culture', 'art', 'kushana', 'sculpture'], rating: 4.5, isActive: true
    },
    {
        name: 'Tilak Dwar Market',
        description: 'Bustling local market area. Excellent for street shopping, handicrafts, and local culture.',
        category: 'Shopping',
        subcategory: 'Market',
        city: 'Mathura',
        location: 'Center of Mathura',
        address: { street: 'Tilak Dwar', city: 'Mathura', state: 'Uttar Pradesh', pincode: '281001' },
        coordinates: { lat: 27.5060, lng: 77.6820 },
        price: 0, priceRange: 'free', tags: ['shopping', 'local', 'market', 'handicrafts'], rating: 4.4, isActive: true
    },
    {
        name: 'Dolphin Water World',
        description: 'Large water park with rides and family fun. Located on the NH-19 highway towards Agra.',
        category: 'Entertainment',
        subcategory: 'Water Park',
        city: 'Mathura-Agra',
        location: 'NH-19 Highway',
        address: { street: 'Runkuta', city: 'Agra', state: 'Uttar Pradesh' },
        coordinates: { lat: 27.2200, lng: 77.8500 },
        price: 600, priceRange: 'medium', tags: ['water park', 'family', 'fun'], rating: 4.2, isActive: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-city-guide');
        console.log('Connected to DB...');

        // Clear existing Mathura/Vrindavan places to avoid duplicates during dev
        await Place.deleteMany({ city: { $in: ['Mathura', 'Vrindavan', 'Mathura-Agra'] } });
        console.log('Cleared old location data...');

        // Add city property to schema matching (if needed, though schema showed city in address)
        // Let's adjust mathuraPlaces to match the schema exactly
        const processedPlaces = mathuraPlaces.map(p => ({
            ...p,
            address: {
                ...p.address,
                city: p.city // Ensure city is in address
            },
            city: p.city // And as top level if script expects it
        }));

        await Place.insertMany(processedPlaces);
        console.log(`Inserted ${processedPlaces.length} Mathura area seed items! ✅`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();

