import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createReview } from '../api';

interface ReviewFormProps {
  onSuccess?: () => void;
  bookingId?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSuccess, bookingId }) => {
  const { token, user } = useAuth();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('You must be logged in to submit a review');
      return;
    }

    if (!reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createReview(
        {
          rating,
          reviewText: reviewText.trim(),
          bookingId: bookingId || null,
        },
        token
      );

      setSuccess(true);
      setReviewText('');
      setRating(5);

      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Share Your Experience</h2>

      {error && (
        <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 text-green-700 dark:text-green-300 p-3 rounded-lg mb-4 text-sm">
          Review submitted successfully! Thank you for your feedback.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Rating (1-5 stars)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-3xl transition hover:scale-110"
              >
                {star <= rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            You selected: {rating}/5 stars
          </p>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write about your experience with us..."
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none"
            rows={5}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {reviewText.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !reviewText.trim()}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>

        {user && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
            Posting as <span className="font-semibold text-neutral-700 dark:text-neutral-300">{user.username}</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default ReviewForm;
