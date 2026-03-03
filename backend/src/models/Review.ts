import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  username: string;
  bookingId?: mongoose.Schema.Types.ObjectId;
  rating: number; // 1-5 stars
  reviewText: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema: Schema<IReview> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', reviewSchema);
