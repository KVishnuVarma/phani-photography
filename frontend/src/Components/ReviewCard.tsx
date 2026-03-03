import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { deleteReview } from '../api';

interface Review {
  _id: string;
  username: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
  onDeleteSuccess?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDeleteSuccess }) => {
  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!token || !isAdmin) return;

    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteReview(review._id, token);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition relative group"
    >
      {/* Admin Delete Button */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm font-semibold transition opacity-0 group-hover:opacity-100"
          title="Delete review (Admin only)"
        >
          {isDeleting ? '...' : '✕'}
        </button>
      )}

      {/* Star Rating */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, index) => (
          <span key={index} className="text-lg">
            {index < review.rating ? '⭐' : '☆'}
          </span>
        ))}
      </div>

      {/* Review Text */}
      <p className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed text-sm sm:text-base">
        "{review.reviewText}"
      </p>

      {/* User Info & Date */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div>
          <p className="text-neutral-900 dark:text-white font-semibold text-sm sm:text-base">
            {review.username}
          </p>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            {formatDate(review.createdAt)}
          </p>
        </div>
        <div className="text-primary-600 dark:text-primary-400 font-bold text-lg">
          {review.rating}/5
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
