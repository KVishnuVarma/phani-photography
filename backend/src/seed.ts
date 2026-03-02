import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Package from './models/Package';
import Gallery from './models/Gallery';
import connectDB from './config/db';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Check if data already exists
    const existingPackages = await Package.countDocuments();
    const existingGallery = await Gallery.countDocuments();

    if (existingPackages === 0) {
      const packages = [
        {
          title: 'Marriage',
          category: 'Wedding',
          photosIncluded: 500,
          price: 50000,
          description: 'Complete wedding day coverage with candid shots and posed portraits',
          features: [
            'Full day coverage (8-10 hours)',
            'Pre-wedding shoot',
            'Album design',
            'High-resolution photos',
            'Video highlights'
          ],
          thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=400&fit=crop'
        },
        {
          title: 'Engagement',
          category: 'Wedding',
          photosIncluded: 200,
          price: 25000,
          description: 'Celebrate your engagement with beautiful candid and posed photography',
          features: [
            '4-5 hours coverage',
            'Multiple location changes',
            'Edited and color-corrected photos',
            'Digital gallery access',
            'Print-ready high resolution'
          ],
          thumbnailUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=400&fit=crop'
        },
        {
          title: 'Pre-Wedding',
          category: 'Wedding',
          photosIncluded: 300,
          price: 35000,
          description: 'Beautiful pre-wedding photoshoot showcasing your love story',
          features: [
            'Multiple location shoots',
            'Costume/outfit changes',
            'Professional styling guidance',
            'Drone photography available',
            'Extended editing'
          ],
          thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=400&fit=crop'
        },
        {
          title: 'Birthday Bash',
          category: 'Birthday',
          photosIncluded: 150,
          price: 15000,
          description: 'Capture the joy and celebrations of your special birthday',
          features: [
            '4 hours coverage',
            'Candid moments captured',
            'Guest interactions included',
            'Fast turnaround editing',
            'Digital copy delivery'
          ],
          thumbnailUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&h=400&fit=crop'
        },
        {
          title: 'Kids Party',
          category: 'Birthday',
          photosIncluded: 100,
          price: 10000,
          description: 'Fun and playful photography of your child\'s birthday celebration',
          features: [
            '3 hours coverage',
            'Action shots and candids',
            'Party games documented',
            'Same-day editing available',
            'Online gallery sharing'
          ],
          thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=400&fit=crop'
        },
        {
          title: 'Nature & Wildlife',
          category: 'Outdoor',
          photosIncluded: 250,
          price: 20000,
          description: 'Stunning outdoor photography in natural light and scenic locations',
          features: [
            'Location scouting included',
            'Golden hour photography',
            'Landscape and portrait mix',
            'Weather contingency plan',
            'Professional retouching'
          ],
          thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop'
        },
        {
          title: 'Corporate Events',
          category: 'Outdoor',
          photosIncluded: 200,
          price: 30000,
          description: 'Professional photography for corporate events and conferences',
          features: [
            'Full day coverage',
            'Speaker and participant shots',
            'Venue and setup documentation',
            'Logo and branding compliance',
            'Express delivery'
          ],
          thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop'
        },
        {
          title: 'Family Portraits',
          category: 'Outdoor',
          photosIncluded: 120,
          price: 12000,
          description: 'Beautiful family portraits in your chosen outdoor setting',
          features: [
            '3 hours session',
            'Location of your choice',
            '3-5 outfit changes',
            'Candid and posed shots',
            'Album design'
          ],
          thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=400&fit=crop'
        }
      ];

      await Package.insertMany(packages);
      console.log('✓ Packages seeded successfully');
    } else {
      console.log(`ℹ ${existingPackages} packages already exist, skipping package seeding`);
    }

    if (existingGallery === 0) {
      const galleryImages = [
        {
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
          caption: 'Wedding Day Celebration'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
          caption: 'Engagement Photoshoot'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop',
          caption: 'Golden Hour Romance'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1519225421169-e0f3f4d9e69b?w=800&h=600&fit=crop',
          caption: 'Bride and Groom Moment'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop',
          caption: 'Wedding Reception'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop',
          caption: 'Birthday Celebration'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
          caption: 'Kids Party Fun'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          caption: 'Nature Photography'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
          caption: 'Family Portrait'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
          caption: 'Corporate Event'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop',
          caption: 'Sunset Shoot'
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop',
          caption: 'Candid Moment'
        }
      ];

      await Gallery.insertMany(galleryImages);
      console.log('✓ Gallery images seeded successfully');
    } else {
      console.log(`ℹ ${existingGallery} gallery images already exist, skipping gallery seeding`);
    }

    console.log('\n✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
