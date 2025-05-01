import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import packageRoutes from './routes/package.routes';
import dashboardRoutes from './routes/dashboard.routes';
import bookingRoutes from './routes/booking.routes';
import galleryRoutes from './routes/gallery.routes';

dotenv.config(); 

const app = express();


app.use(express.json());


app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://your-lovable-preview-domain.lovable.app' 
  ],
  credentials: true 
}));


app.use('/api/auth', authRoutes);
app.use('/api/auth', packageRoutes);
app.use('/api/auth', dashboardRoutes);
app.use('/api/auth', bookingRoutes);
app.use('/api/auth', galleryRoutes);

export default app;
