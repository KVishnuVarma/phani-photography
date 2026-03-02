import { Request, Response } from 'express';
import Payment, { IPayment } from '../models/Payment';
import Booking from '../models/Booking';

// ✅ Create a new payment (when user submits advance payment)
export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId, userId, amount, paymentMethod, upiId, displayName, screenshot, transactionId } = req.body;

    // Validate required fields
    if (!bookingId || !userId || !amount || !paymentMethod || !upiId || !displayName) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Create payment record
    const newPayment: IPayment = new Payment({
      bookingId,
      userId,
      amount,
      paymentMethod,
      upiId,
      displayName,
      screenshot,
      transactionId,
      status: 'Pending',
    });

    const savedPayment = await newPayment.save();

    // Update booking with payment reference
    await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: 'Pending', paymentId: savedPayment._id },
      { new: true }
    );

    res.status(201).json({
      message: 'Payment submitted successfully. Awaiting admin verification.',
      payment: savedPayment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error });
  }
};

// ✅ Get all pending payments (Admin)
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await Payment.find()
      .populate('bookingId', 'sessionDate contactInfo amount')
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

// ✅ Get payments by status (Admin)
export const getPaymentsByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    const payments = await Payment.find({ status })
      .populate('bookingId', 'sessionDate contactInfo amount')
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

// ✅ Get payments for a specific user
export const getPaymentsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId })
      .populate('bookingId', 'sessionDate contactInfo amount status')
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user payments', error });
  }
};

// ✅ Get payment by booking ID
export const getPaymentByBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const payment = await Payment.findOne({ bookingId })
      .populate('bookingId', 'sessionDate contactInfo amount status')
      .populate('userId', 'username email');
    
    if (!payment) {
      res.status(404).json({ message: 'No payment found for this booking' });
      return;
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error });
  }
};

// ✅ Update payment status (Admin - Verify/Reject)
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const { status, adminNotes, verifiedBy, scannerUrl } = req.body;

    if (!['Pending', 'Verified', 'Rejected', 'Refunded'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status,
        adminNotes,
        verifiedBy,
        scannerUrl: scannerUrl || undefined,
        verifiedAt: status === 'Verified' ? new Date() : null,
      },
      { new: true }
    ).populate('bookingId', 'sessionDate contactInfo amount')
      .populate('userId', 'username email');

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    // Update booking status if payment is verified
    if (status === 'Verified') {
      await Booking.findByIdAndUpdate(
        payment.bookingId,
        { paymentStatus: 'Verified' },
        { new: true }
      );
    }

    res.status(200).json({
      message: `Payment ${status.toLowerCase()} successfully`,
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error });
  }
};

// ✅ Get payment statistics (Admin)
export const getPaymentStats = async (_req: Request, res: Response) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const pendingPayments = await Payment.countDocuments({ status: 'Pending' });
    const verifiedPayments = await Payment.countDocuments({ status: 'Verified' });
    const rejectedPayments = await Payment.countDocuments({ status: 'Rejected' });

    const totalAmount = await Payment.aggregate([
      { $match: { status: 'Verified' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({
      totalPayments,
      pendingPayments,
      verifiedPayments,
      rejectedPayments,
      totalAmountCollected: totalAmount[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment stats', error });
  }
};

// ✅ Delete a payment (Admin)
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findByIdAndDelete(paymentId);

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error });
  }
};
