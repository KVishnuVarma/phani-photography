import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import packageRoutes from './routes/package.routes';
import dashboardRoutes from './routes/dashboard.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import scannerRoutes from './routes/scanner.routes';
import galleryRoutes from './routes/gallery.routes';
import workRoutes from './routes/work.routes';
import reviewRoutes from './routes/review.routes';

dotenv.config(); 

const app = express();

// Increase payload size limits to handle image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS middleware
const corsOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/scanners', scannerRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/works', workRoutes);
app.use('/api/reviews', reviewRoutes);

export default app;
