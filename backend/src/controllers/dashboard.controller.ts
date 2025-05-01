import { Request, Response } from "express";
import Booking from "../models/Booking";
import User from "../models/User";

export const getDashboardMetrics = async (req: Request, res: Response) =>{
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBookings = await Booking.countDocuments({
      bookingDate: { $gte: today, $lt: tomorrow },
    });

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() -7);

    const weeklyBookings = await Booking.countDocuments({
      bookingDate: { $gte: last7Days },
    });

    const monthlyRevenueAgg = await Booking.aggregate([
      {
        $match: {
          bookingDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount'}
        },
      },
    ]);

    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;
    const totalClients = await User.countDocuments();

    res.json({
      todayBookings,
      weeklyBookings,
      monthlyRevenue,
      totalClients,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard metrics', error});
  }
};

export const getRecentBookings = async (_: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name')
      .populate('packageId', 'name');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent bookings', error });
  }
};

export const getUpcomingPhotoshoots = async (_: Request, res: Response) => {
  try {
    const today = new Date();
    const upcoming = await Booking.find({ bookingDate: { $gt: today } })
      .sort({ bookingDate: 1 })
      .populate('userId', 'name')
      .populate('packageId', 'name')
      .limit(5);

    res.status(200).json(upcoming);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch upcoming photoshoots', error });
  }
};
