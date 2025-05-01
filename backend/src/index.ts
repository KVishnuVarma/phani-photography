// src/index.ts
import app from './app';  // Import the app instance
import connectDB from './config/db';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
