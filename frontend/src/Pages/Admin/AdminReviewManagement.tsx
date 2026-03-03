import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getAllReviews, deleteReview } from '../../api';

interface Review {
  _id: string;
  username: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

const AdminReviewManagement: React.FC = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      setReviews(data);
    } catch (err) {
      setError('Failed to load reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!token) return;

    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setDeletingId(reviewId);
    try {
      await deleteReview(reviewId, token);
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      setError('Failed to delete review');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-neutral-600 dark:text-neutral-400">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary-700 dark:text-primary-400">Review Management</h2>

      {error && (
        <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
          <p className="text-lg">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Total reviews: <span className="font-bold text-primary-600 dark:text-primary-400">{reviews.length}</span>
          </p>

          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-lg p-5 shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-neutral-900 dark:text-white">{review.username}</h3>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">
                          {i < review.rating ? '⭐' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="text-neutral-700 dark:text-neutral-300 mb-3 text-sm sm:text-base">
                    "{review.reviewText}"
                  </p>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDate(review.createdAt)}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={deletingId === review._id}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold transition text-sm flex-shrink-0"
                >
                  {deletingId === review._id ? '...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewManagement;
