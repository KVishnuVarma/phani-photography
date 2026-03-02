import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import packageRoutes from './routes/package.routes';
import dashboardRoutes from './routes/dashboard.routes';
import bookingRoutes from './routes/booking.routes';
import galleryRoutes from './routes/gallery.routes';
import workRoutes from './routes/work.routes';

dotenv.config(); 

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:5173' 
  ],
  credentials: true 
}));

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/works', workRoutes);

export default app;
