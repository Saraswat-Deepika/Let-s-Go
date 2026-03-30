const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./models/Place');

dotenv.config();

const vrindavanPlaces = [
  {
    name: 'Banke Bihari Temple',
    description: 'One of the most famous and revered Krishna temples in the world, known for the unique darshan style.',
    category: 'Temple',
    area: 'Vrindavan',
    bestTime: 'Morning and evening aarti',
    suitableFor: ['Devotees', 'Families'],
    estimatedBudget: 'Free',
    mapsKeyword: 'Banke Bihari Temple Vrindavan',
    tags: ['Spiritual', 'Historical', 'Important'],
    popularity: 'Very High',
    address: { city: 'Vrindavan', state: 'Uttar Pradesh' },
    coordinates: { lat: 27.5804, lng: 77.6989 }
  },
  {
    name: 'Prem Mandir',
    description: 'A massive white marble temple complex dedicated to Radha Krishna and Sita Ram, famous for its light show.',
    category: 'Temple',
    area: 'Vrindavan',
    bestTime: 'Evening (during the light show)',
    suitableFor: ['Tourists', 'Families', 'Devotees'],
    estimatedBudget: 'Free',
    mapsKeyword: 'Prem Mandir Vrindavan',
    tags: ['Architecture', 'Light Show', 'Spiritual'],
    popularity: 'Very High',
    address: { city: 'Vrindavan', state: 'Uttar Pradesh' },
    coordinates: { lat: 27.5732, lng: 77.6710 }
  },
  {
    name: 'ISKCON Vrindavan',
    description: 'Also known as Sri Sri Krishna Balaram Mandir, it is a major ISKCON temple with beautiful ceremonies and chanting.',
    category: 'Temple',
    area: 'Vrindavan',
    bestTime: '4:30 AM (Mangala Aarti) or Evening',
    suitableFor: ['Tourists', 'Devotees', 'Students'],
    estimatedBudget: 'Free',
    mapsKeyword: 'ISKCON Vrindavan',
    tags: ['Spiritual', 'International', 'Culture'],
    popularity: 'Very High',
    address: { city: 'Vrindavan', state: 'Uttar Pradesh' },
    coordinates: { lat: 27.5714, lng: 77.6800 }
  },
  {
    name: 'Nidhivan',
    description: 'A sacred forest where it is believed that Radha and Krishna perform Rasalila at night. The trees are twisted and unique.',
    category: 'Attraction',
    area: 'Vrindavan',
    bestTime: 'Daytime (closes before sunset)',
    suitableFor: ['Devotees', 'Tourists'],
    estimatedBudget: 'Free',
    mapsKeyword: 'Nidhivan Vrindavan',
    tags: ['Mystery', 'Spiritual', 'Nature'],
    popularity: 'High',
    address: { city: 'Vrindavan', state: 'Uttar Pradesh' },
    coordinates: { lat: 27.5840, lng: 77.6960 }
  },
  {
    name: 'Kesi Ghat',
    description: 'The principal ghat in Vrindavan, on the banks of the Yamuna River, where Lord Krishna is said to have killed the Kesi demon.',
    category: 'Ghat',
    area: 'Vrindavan',
    bestTime: 'Early morning or sunset',
    suitableFor: ['Devotees', 'Tourists', 'Students'],
    estimatedBudget: 'Free (Boat ride extra)',
    mapsKeyword: 'Kesi Ghat Vrindavan',
    tags: ['River', 'Sunset', 'Historical'],
    popularity: 'High',
    address: { city: 'Vrindavan', state: 'Uttar Pradesh' },
    coordinates: { lat: 27.5855, lng: 77.7011 }
  },
  {
    name: '11 Flowers Rooftop Cafe',
    description: 'A popular rooftop cafe offering a mix of Indian and Continental food with a great view of the town.',
    category: 'Cafe',
    area: 'Vrindavan',
    bestTime: 'Evening',
    suitableFor: ['Students', 'Tourists', 'Families'],
    estimatedBudget: 'Moderate',
    mapsKeyword: '11 Flowers Rooftop Cafe Vrindavan',
    tags: ['Food', 'Rooftop', 'View'],
    popularity: 'High',
    address: { city: 'Vrindavan', state: 'Uttar Pradesh' },
    coordinates: { lat: 27.5815, lng: 77.6970 }
  },
  {
    name: 'Sri Krishna Janmasthan',
    description: 'The birthplace of Lord Krishna. A highly significant spiritual and historical site.',
    category: 'Temple',
    area: 'Mathura',
    bestTime: 'Morning or Evening',
    suitableFor: ['Devotees', 'Families', 'Tourists'],
    estimatedBudget: 'Free',
    mapsKeyword: 'Krishna Janmabhoomi Mathura',
    tags: ['Birthplace', 'Historical', 'Spiritual'],
    popularity: 'Very High',
    address: { city: 'Mathura', state: 'Uttar Pradesh' },
    coordinates: { lat: 27.5050, lng: 77.6702 }
  },
  {
    name: 'Vishram Ghat',
    description: 'A major ghat on the banks of the Yamuna in Mathura, where Lord Krishna is said to have rested after killing Kansa.',
    category: 'Ghat',
    area: 'Mathura',
    bestTime: 'Evening Aarti',
    suitableFor: ['Devotees', 'Tourists'],
    estimatedBudget: 'Free',
    mapsKeyword: 'Vishram Ghat Mathura',
    tags: ['River', 'Aarti', 'Historical'],
    popularity: 'High',
    address: { city: 'Mathura', state: 'Uttar Pradesh' },
    coordinates: { lat: 27.5030, lng: 77.6830 }
  },
  {
    name: 'Nidhivan Sarovar Portico',
    description: 'A premium stay option in Vrindavan providing comfort and proximity to major temples.',
    category: 'Stay',
    area: 'Vrindavan',
    bestTime: 'Any time',
    suitableFor: ['Families', 'Tourists'],
    estimatedBudget: 'Higher',
    mapsKeyword: 'Nidhivan Sarovar Portico Vrindavan',
    tags: ['Hotel', 'Stay', 'Comfort'],
    popularity: 'Medium',
    address: { city: 'Vrindavan', state: 'Uttar Pradesh' },
    coordinates: { lat: 27.5650, lng: 77.6750 }
  }
];

const seedVrindavanData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcity';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('📦 Connected to MongoDB.');

    // Delete existing places to avoid duplicates during seeding
    await Place.deleteMany({});
    console.log('🧹 Cleared existing places.');

    await Place.insertMany(vrindavanPlaces);
    console.log('✅ Successfully seeded Vrindavan & Mathura places database for Agents!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedVrindavanData();
