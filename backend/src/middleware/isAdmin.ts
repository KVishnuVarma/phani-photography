import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest'; // adjust path
import User from '../models/User'; // adjust import path

export const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized. No user attached to request.' });
      return;
    }

    const user = await User.findById(userId);

    if (!user || user.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admins only.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin check', error });
    return;
  }
};

