import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import {
  getAllReviews,
  getUserReviews,
  createReview,
  deleteReview,
  updateReview,
} from '../controllers/review.controller';

const reviewRoutes = Router();

// Public routes
reviewRoutes.get('/', getAllReviews);
reviewRoutes.get('/user/:userId', getUserReviews);

// Protected routes (requires authentication)
reviewRoutes.post('/', verifyToken, createReview);
reviewRoutes.put('/:reviewId', verifyToken, updateReview);

// Admin routes (requires authentication + admin role)
reviewRoutes.delete('/:reviewId', verifyToken, deleteReview);

export default reviewRoutes;
