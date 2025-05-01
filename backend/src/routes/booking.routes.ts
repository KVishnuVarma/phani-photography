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
router.post('/bookings', verifyToken, async (req, res) => {
  try {
    await createBooking(req, res); // Call the controller without returning anything
  } catch (error) {
    res.status(500).json({ message: 'Error in creating booking', error });
  }
});

// 🔐 Get all bookings (Admin only)
router.get('/bookings', verifyToken, isAdmin, async (req, res) => {
  try {
    await getBookings(req, res); // Call the controller and handle the response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
});

// 🔐 Get bookings for a specific user
router.get('/bookings/user/:userId', verifyToken, async (req, res) => {
  try {
    await getUserBookings(req, res); // Call the controller for getting user bookings
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings', error });
  }
});

// 🔐 Get a specific booking by ID
router.get('/bookings/:id', verifyToken, async (req, res) => {
  try {
    await getBookingById(req, res); // Call the controller for fetching booking by ID
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error });
  }
});

// 🔐 Update booking status
router.patch('/bookings/:id/status', verifyToken, async (req, res) => {
  try {
    await updateBookingStatus(req, res); // Call the controller to update booking status
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error });
  }
});

// 🔐 Delete a booking (Admin only)
router.delete('/bookings/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await deleteBooking(req, res); // Call the controller to delete the booking
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
});

export default router;
