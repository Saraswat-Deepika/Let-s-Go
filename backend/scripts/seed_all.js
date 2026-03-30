const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Place = require('../models/Place');

dotenv.config({ path: path.join(__dirname, '../.env') });

const allPlaces = [
  // --- VRINDAVAN ---
  {
    name: "Banke Bihari Temple",
    category: "Temple",
    city: "Vrindavan",
    timings: "7:30AM–12PM, 5:30PM–9:30PM",
    entry_fee: "Free",
    best_time: "Morning/Evening Aarti",
    rating: 4.9,
    lat: 27.5804,
    lng: 77.6989,
    description: "One of the most famous and revered Krishna temples in the world, known for the unique darshan style.",
    tags: ["krishna", "spiritual", "historical", "popular", "vrindavan"],
    popularity: "Very High",
    suitableFor: ["Devotees", "Families", "Tourists"]
  },
  {
    name: "Prem Mandir",
    category: "Temple",
    city: "Vrindavan",
    timings: "8:30AM–12PM, 4:30PM–8:30PM",
    entry_fee: "Free",
    best_time: "Evening",
    rating: 4.8,
    lat: 27.5732,
    lng: 77.6710,
    description: "A massive white marble temple complex dedicated to Radha Krishna and Sita Ram, famous for its light show.",
    tags: ["radha krishna", "light show", "family friendly", "architecture", "marble"],
    popularity: "Very High",
    suitableFor: ["Tourists", "Families", "Devotees"]
  },
  {
    name: "ISKCON Vrindavan",
    category: "Temple",
    city: "Vrindavan",
    timings: "4:30AM–1PM, 4PM–8:30PM",
    entry_fee: "Free",
    best_time: "Evening Aarti",
    rating: 4.8,
    lat: 27.5714,
    lng: 77.6800,
    description: "Also known as Sri Sri Krishna Balaram Mandir, it is a major ISKCON temple with beautiful ceremonies and chanting.",
    tags: ["spiritual", "international", "culture", "krishna", "vrindavan"],
    popularity: "Very High",
    suitableFor: ["Tourists", "Devotees", "Students"]
  },
  {
    name: "11 Flowers Rooftop Cafe",
    category: "Cafe",
    city: "Vrindavan",
    timings: "11:00AM–11:00PM",
    entry_fee: "₹500 for two",
    best_time: "Sunset/Evening",
    rating: 4.5,
    lat: 27.5815,
    lng: 77.6970,
    description: "A popular rooftop cafe offering a mix of Indian and Continental food with a great view of the town.",
    tags: ["food", "rooftop", "view", "cafe", "continental"],
    popularity: "High",
    suitableFor: ["Students", "Tourists", "Families"]
  },

  // --- MATHURA ---
  {
    name: "Shree Krishna Janmabhoomi Temple",
    category: "Temple",
    city: "Mathura",
    timings: "5:00AM–12PM, 4:00PM–9:00PM",
    entry_fee: "Free",
    best_time: "Morning/Janmashtami",
    rating: 4.9,
    lat: 27.5055,
    lng: 77.6713,
    description: "The holiest site in Mathura, believed to be the exact birthplace of Lord Krishna. Includes the Garbha Griha prison cell.",
    tags: ["krishna", "birthplace", "history", "holiest", "spiritual"],
    popularity: "Very High",
    suitableFor: ["Devotees", "Tourists", "Families"]
  },
  {
    name: "The Trunk Rooftop",
    category: "Restaurant",
    city: "Mathura",
    timings: "12:00PM–11:30PM",
    entry_fee: "₹800 for two",
    best_time: "Evening",
    rating: 4.4,
    lat: 27.4924,
    lng: 77.6737,
    description: "Rooftop restaurant with great views and a lounge vibe. Perfect for evening dining in Krishna Nagari.",
    tags: ["rooftop", "view", "lounge", "dining", "mathura"],
    popularity: "High",
    suitableFor: ["Students", "Tourists", "Families"]
  },
  {
    name: "Brijwasi Mithai Wala",
    category: "Restaurant",
    city: "Mathura",
    timings: "8:00AM–10:30PM",
    entry_fee: "Varies (Sweets)",
    best_time: "Morning/Evening",
    rating: 4.7,
    lat: 27.4950,
    lng: 77.6750,
    description: "Iconic sweet shop famous for Mathura Ke Pede and traditional North Indian snacks.",
    tags: ["pede", "sweets", "dairy", "traditional", "mathura"],
    popularity: "Very High",
    suitableFor: ["Families", "Tourists", "Devotees"]
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-city-guide';
    console.log(`Connecting to ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB.');

    // Clear existing data
    await Place.deleteMany({});
    console.log('🧹 Cleared existing places.');

    // In production, we'd handle images properly
    const processedPlaces = allPlaces.map(p => ({
      ...p,
      isActive: true,
      images: [`https://source.unsplash.com/featured/?${p.category.toLowerCase()},${p.name.split(' ')[0].toLowerCase()}`],
      price: p.entry_fee.includes('₹') ? parseInt(p.entry_fee.replace(/[^0-9]/g, '')) / 2 : 0, // Avg per person
      priceRange: p.entry_fee === 'Free' ? 'free' : (p.entry_fee.includes('₹') && parseInt(p.entry_fee.replace(/[^0-9]/g, '')) > 1000 ? 'high' : 'medium')
    }));

    await Place.insertMany(processedPlaces);
    console.log(`✅ Successfully seeded ${processedPlaces.length} places with the new flat schema!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
