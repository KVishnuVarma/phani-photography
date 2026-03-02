import mongoose from 'mongoose';
import Package from './src/models/Package';
import Gallery from './src/models/Gallery';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Package.deleteMany({});
    await Gallery.deleteMany({});

    // Seed packages
    const packages = await Package.insertMany([
      {
        title: 'Wedding Photography Package',
        category: 'Wedding',
        photosIncluded: 500,
        price: 2999,
        description: 'Complete wedding coverage with pre-wedding shoot, ceremony, and reception',
        features: ['Full day coverage (8 hours)', 'Professional editing', 'Online gallery', 'USB with all photos'],
        thumbnailUrl: 'https://via.placeholder.com/400x300?text=Wedding+Photography',
      },
      {
        title: 'Birthday Celebration Package',
        category: 'Birthday',
        photosIncluded: 300,
        price: 1499,
        description: 'Capture all the joy and moments from your special birthday celebration',
        features: ['4 hours coverage', '300+ edited photos', 'Same day edits', 'Digital copies'],
        thumbnailUrl: 'https://via.placeholder.com/400x300?text=Birthday+Package',
      },
      {
        title: 'Outdoor Portrait Session',
        category: 'Outdoor',
        photosIncluded: 100,
        price: 799,
        description: 'Beautiful outdoor photography session in natural light and scenic locations',
        features: ['2 hours session', '100+ photos', 'Location scouting', 'Professional editing'],
        thumbnailUrl: 'https://via.placeholder.com/400x300?text=Outdoor+Portraits',
      },
      {
        title: 'Premium Wedding Package',
        category: 'Wedding',
        photosIncluded: 800,
        price: 4999,
        description: 'Luxury wedding photography with videography and drone shots included',
        features: ['Full day + pre-wedding', '4K video', 'Drone footage', 'Premium album', 'Engagement shoot'],
        thumbnailUrl: 'https://via.placeholder.com/400x300?text=Premium+Wedding',
      },
      {
        title: 'Family Portrait Package',
        category: 'Outdoor',
        photosIncluded: 150,
        price: 899,
        description: 'Professional family photography session capturing your bonds and memories',
        features: ['2.5 hours session', '150+ photos', 'Multiple locations', 'Digital & prints'],
        thumbnailUrl: 'https://via.placeholder.com/400x300?text=Family+Portraits',
      },
    ]);

    console.log(`✓ Created ${packages.length} packages`);

    // Seed gallery images
    const images = await Gallery.insertMany([
      {
        imageUrl: 'https://via.placeholder.com/600x400?text=Wedding+1',
        caption: 'Beautiful wedding ceremony moment',
      },
      {
        imageUrl: 'https://via.placeholder.com/600x400?text=Portrait+1',
        caption: 'Professional portrait photography',
      },
      {
        imageUrl: 'https://via.placeholder.com/600x400?text=Outdoor+1',
        caption: 'Stunning outdoor session',
      },
      {
        imageUrl: 'https://via.placeholder.com/600x400?text=Wedding+2',
        caption: 'Reception highlights',
      },
      {
        imageUrl: 'https://via.placeholder.com/600x400?text=Event+1',
        caption: 'Event photography coverage',
      },
    ]);

    console.log(`✓ Created ${images.length} gallery images`);

    await mongoose.connection.close();
    console.log('✓ Seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
