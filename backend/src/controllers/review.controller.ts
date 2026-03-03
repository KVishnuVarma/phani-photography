import { Response } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import Review from '../models/Review';

// ✅ Get all reviews (Public)
export const getAllReviews = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

// ✅ Get reviews by user (Public)
export const getUserReviews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reviews', error });
  }
};

// ✅ Create a review (Authenticated)
export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { rating, reviewText, bookingId } = req.body;

    if (!rating || !reviewText) {
      res.status(400).json({ message: 'Rating and review text are required' });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    const newReview = new Review({
      userId: req.user?.id,
      username: req.user?.username,
      rating,
      reviewText,
      bookingId: bookingId || null,
    });

    const savedReview = await newReview.save();
    res.status(201).json({
      message: 'Review created successfully',
      review: savedReview,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
};

// ✅ Delete review (Admin only)
export const deleteReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const user = req.user;

    // Check if user is admin
    if (user?.role !== 'admin') {
      res.status(403).json({ message: 'Only admins can delete reviews' });
      return;
    }

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    res.status(200).json({
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
};

// ✅ Update review (User or Admin)
export const updateReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    // Check if user owns the review or is admin
    if (review.userId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'You can only edit your own reviews' });
      return;
    }

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating: rating || review.rating, reviewText: reviewText || review.reviewText },
      { new: true }
    );

    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
};
