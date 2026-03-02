import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/booking.controller';
import { verifyToken } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';

const router = Router();

// 🔐 Create a new booking (Authenticated users)
router.post('/', verifyToken, async (req, res) => {
  try {
    await createBooking(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error in creating booking', error });
  }
});

// 🔐 Get all bookings (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    await getBookings(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
});

// 🔐 Get bookings for a specific user
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    await getUserBookings(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings', error });
  }
});

// 🔐 Get a specific booking by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    await getBookingById(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error });
  }
});

// 🔐 Update booking status
router.put('/:id', verifyToken, async (req, res) => {
  try {
    await updateBookingStatus(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error });
  }
});

// 🔐 Delete a booking (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await deleteBooking(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
});

export default router;
