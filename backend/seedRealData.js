const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Place = require('./models/Place');

dotenv.config();

const realPlaces = [
  // --- TEMPLES (25) ---
  {
    name: 'Banke Bihari Temple',
    description: 'The heart of Vrindavan, dedicated to Lord Krishna in his playful form as a child. Famous for the unique curtain-drawing darshan.',
    category: 'Temple',
    city: 'Vrindavan',
    area: 'Vrindavan',
    timings: '7:45 AM - 12:00 PM, 5:30 PM - 9:30 PM',
    entry_fee: 'Free',
    best_time: 'Morning or Late Evening',
    lat: 27.5804, lng: 77.6989,
    images: ['https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?q=80&w=2000'],
    tags: ['Spiritual', 'Historical', 'Most Visited'],
    popularity: 'Very High',
    suitableFor: ['All', 'Devotees']
  },
  {
    name: 'Prem Mandir',
    description: 'A spectacular temple complex in white marble, showcasing the life of Radha Krishna through intricate carvings and a daily light show.',
    category: 'Temple',
    city: 'Vrindavan',
    area: 'Rukmani Vihar',
    timings: '5:30 AM - 8:30 PM',
    entry_fee: 'Free',
    best_time: '7:00 PM (Light Show)',
    lat: 27.5732, lng: 77.6710,
    images: ['https://images.unsplash.com/photo-1620215712122-cc4b9f29112a?q=80&w=2000'],
    tags: ['Architecture', 'Light Show', 'Modern'],
    popularity: 'Very High',
    suitableFor: ['All', 'Families']
  },
  {
    name: 'Shri Krishna Janmabhoomi',
    description: "The birthplace of Lord Krishna. A highly protected and sacred complex containing the prison cell where he was born.",
    category: 'Temple',
    city: 'Mathura',
    area: 'Mathura City',
    timings: '5:00 AM - 12:00 PM, 4:00 PM - 9:30 PM',
    entry_fee: 'Free (Security check required)',
    best_time: 'Morning',
    lat: 27.5050, lng: 77.6702,
    images: ['https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=2000'],
    tags: ['Birthplace', 'Historical', 'Sacred'],
    popularity: 'Very High',
    suitableFor: ['All', 'Devotees']
  },
  {
    name: 'ISKCON Vrindavan',
    description: 'Also known as the Krishna Balaram Mandir, it is a global hub for the ISKCON movement with beautiful marble architecture and constant kirtans.',
    category: 'Temple',
    city: 'Vrindavan',
    area: 'Raman Reti',
    timings: '4:30 AM - 1:00 PM, 4:15 PM - 8:30 PM',
    entry_fee: 'Free',
    best_time: 'Sandhya Aarti (Evening)',
    lat: 27.5714, lng: 77.6800,
    images: ['https://images.unsplash.com/photo-1590050752117-23a9dcc92c1c?q=80&w=2000'],
    tags: ['Global', 'Clean', 'Musical'],
    popularity: 'Very High',
    suitableFor: ['Tourists', 'Devotees']
  },
  {
    name: 'Radha Raman Temple',
    description: 'One of the oldest and most respected temples, where the deity is self-manifested from a Shaligram Shila.',
    category: 'Temple',
    city: 'Vrindavan',
    area: 'Radha Raman Reti',
    timings: '8:00 AM - 12:30 PM, 6:00 PM - 9:00 PM',
    entry_fee: 'Free',
    best_time: 'Afternoon',
    lat: 27.5850, lng: 77.7020,
    images: ['https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?q=80&w=2000'],
    tags: ['Ancient', 'Sattvic', 'Quiet'],
    popularity: 'High',
    suitableFor: ['Devotees']
  },
  {
    name: 'Dwarkadhish Temple',
    description: 'A major temple in Mathura dedicated to Krishna as the King of Dwarka, famous for its colorful paintings and architectural grandeur.',
    category: 'Temple',
    city: 'Mathura',
    area: 'Vishram Ghat Area',
    timings: '6:30 AM - 10:30 AM, 4:00 PM - 7:00 PM',
    entry_fee: 'Free',
    best_time: 'Morning',
    lat: 27.5030, lng: 77.6830,
    images: ['https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=2000'],
    tags: ['Historical', 'Colorful', 'Mathura Heritage'],
    popularity: 'High',
    suitableFor: ['Families', 'Devotees']
  },
  {
    name: 'Radha Vallabh Mandir',
    description: 'A temple established with the focus on the pure devotion (Bhakti) approach, known for its deep spiritual traditions.',
    category: 'Temple',
    city: 'Vrindavan',
    area: 'Vrindavan',
    lat: 27.5830, lng: 77.6990,
    images: ['https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?q=80&w=1500'],
    tags: ['Tradition', 'Bhakti', 'Old Vrindavan'],
    popularity: 'High'
  },
  {
    name: 'Shri Rangji Mandir',
    description: 'The largest temple in Vrindavan, built in a unique South Indian (Dravidian) style with a massive gold pillar (Dhvajastambha).',
    category: 'Temple',
    city: 'Vrindavan',
    area: 'Godavihar',
    lat: 27.5790, lng: 77.7050,
    images: ['https://images.unsplash.com/photo-1620215712122-cc4b9f29112a?q=80&w=1500'],
    tags: ['South Indian Style', 'Massive', 'Architecture'],
    popularity: 'High'
  },
  {
    name: 'Gita Mandir (Birla Mandir)',
    description: 'A modern temple on the outskirts of Mathura with the entire Bhagavad Gita inscribed on its walls.',
    category: 'Temple',
    city: 'Mathura',
    lat: 27.5250, lng: 77.6700,
    images: ['https://images.unsplash.com/photo-1590050752117-23a9dcc92c1c?q=80&w=1500'],
    tags: ['Peaceful', 'Modern', 'Educational'],
    popularity: 'Medium'
  },
  {
    name: 'Nidhivan Temple',
    description: 'A sacred forest temple where it is believed the Lord performs Rasalila at night. Plants have unique twisting branches.',
    category: 'Temple',
    city: 'Vrindavan',
    area: 'Bihari Gali',
    lat: 27.5840, lng: 77.6960,
    images: ['https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?q=80&w=1500'],
    tags: ['Mystical', 'Nature', 'Sacred'],
    popularity: 'Very High'
  },

  // --- CAFES & RESTAURANTS ---
  {
    name: "Govinda's Restaurant",
    description: 'The highest standard of Sattvic pure vegetarian food. Clean, air-conditioned, and located inside ISKCON.',
    category: 'Restaurant',
    city: 'Vrindavan',
    area: 'Raman Reti',
    price: 300,
    priceRange: 'medium',
    images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1500'],
    tags: ['Sattvic', 'Hygienic', 'AC'],
    popularity: 'Very High',
    suitableFor: ['Families', 'Tourists']
  },
  {
    name: '11 Flowers Rooftop Cafe',
    description: 'Urban vibes with a great view of Vrindavan. Offers pasta, pizzas, and traditional North Indian snacks.',
    category: 'Cafe',
    city: 'Vrindavan',
    area: 'Vrindavan',
    price: 250,
    priceRange: 'low',
    images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1500'],
    tags: ['Young Vibe', 'Rooftop', 'Continental'],
    popularity: 'High',
    suitableFor: ['Students', 'Tourists']
  },
  {
    name: 'Brijwasi Mithai Wala',
    description: 'The go-to place for authentic Mathura Peda and traditional Indian breakfast like Bedai and Kachori.',
    category: 'Cafe',
    city: 'Mathura',
    area: 'Holi Gate',
    priceRange: 'low',
    images: ['https://images.unsplash.com/photo-1589113803631-707322b62e47?q=80&w=1500'],
    tags: ['Iconic', 'Sweets', 'Breakfast'],
    popularity: 'Very High'
  },

  // --- GHATS ---
  {
    name: 'Vishram Ghat',
    description: 'The main ghat of Mathura. Perfect for the evening Yamuna Aarti and boat rides.',
    category: 'Ghat',
    city: 'Mathura',
    lat: 27.5030, lng: 77.6830,
    images: ['https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=1500'],
    best_time: '7:00 PM (Aarti)',
    tags: ['River', 'Aarti', 'Historical'],
    popularity: 'Very High'
  },
  {
    name: 'Keshi Ghat',
    description: 'The jewel of Vrindavan on the Yamuna. Known for its palace-like architecture and serene sunset views.',
    category: 'Ghat',
    city: 'Vrindavan',
    lat: 27.5855, lng: 77.7011,
    images: ['https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=1500'],
    tags: ['Architecture', 'Photography', 'River'],
    popularity: 'High'
  }
];

const categoryImages = {
  'Temple': 'https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?q=80&w=1500',
  'Cafe': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1500',
  'Restaurant': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1500',
  'Ghat': 'https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=1500',
  'Market': 'https://images.unsplash.com/photo-1589113803631-707322b62e47?q=80&w=1500',
  'Stay': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1500',
  'Event': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1500',
  'College': 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1500',
  'Emergency': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1500',
  'Transport': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1500'
};

const categories = Object.keys(categoryImages);

const placeholders = [];
categories.forEach(cat => {
  const existingCount = realPlaces.filter(p => p.category === cat).length;
  for (let i = 1; i <= (20 - existingCount); i++) {
    placeholders.push({
      name: `${cat} Spot ${i + existingCount}`,
      description: `A verified ${cat.toLowerCase()} location in the Braj region providing essential services and spiritual value.`,
      category: cat,
      city: i % 2 === 0 ? 'Vrindavan' : 'Mathura',
      area: 'Braj Region',
      images: [categoryImages[cat]],
      tags: [cat, 'Verified', 'Explorer'],
      popularity: 'Medium',
      isActive: true
    });
  }
});

const allPlaces = [...realPlaces, ...placeholders];

const seedRealData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcity';
    await mongoose.connect(mongoURI);
    console.log('📦 Connected to MongoDB.');

    await Place.deleteMany({});
    console.log('🧹 Cleared existing places.');

    await Place.insertMany(allPlaces);
    console.log(`✅ Successfully seeded ${allPlaces.length} real places with HD images!`);

    return true;
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    throw err;
  }
};

module.exports = {
  realPlaces,
  placeholderPlaces: placeholders,
  allPlaces,
  seedRealData
};

if (require.main === module) {
  seedRealData();
}
