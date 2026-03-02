import mongoose from 'mongoose';
import User from './src/models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@photography.com' });
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@photography.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✓ Admin user created');
    console.log('   Email: admin@photography.com');
    console.log('   Password: admin123');

    // Create test user
    const existingUser = await User.findOne({ email: 'user@photography.com' });
    if (!existingUser) {
      const userPassword = await bcrypt.hash('user123', 10);
      await User.create({
        username: 'testuser',
        email: 'user@photography.com',
        password: userPassword,
        role: 'user',
      });
      console.log('✓ Test user created');
      console.log('   Email: user@photography.com');
      console.log('   Password: user123');
    }

    await mongoose.connection.close();
    console.log('✓ Setup complete!');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

createAdminUser();
