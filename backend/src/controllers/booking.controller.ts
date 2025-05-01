import { Request, Response } from 'express';
import Booking, { IBooking } from '../models/Booking';

// ✅ Create a new booking
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, packageId, amount, sessionDate, contactInfo } = req.body;

    const newBooking: IBooking = new Booking({
      userId,
      packageId,
      amount,
      sessionDate,
      status: 'Pending',
      contactInfo,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);  // Handling response directly
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });  // Handling error directly
  }
};


// ✅ Get all bookings (Admin)
export const getBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'username email')
      .populate('packageId', 'name description');
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

// ✅ Get bookings for a specific user (User)
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('packageId', 'name description');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

// ✅ Get a single booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('packageId', 'name description');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching booking', error });
  }
};

// ✅ Update booking status
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Scheduled'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating booking status', error });
  }
};

// ✅ Delete a booking
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting booking', error });
  }
};
