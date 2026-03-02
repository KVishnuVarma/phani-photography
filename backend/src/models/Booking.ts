import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  packageId: mongoose.Schema.Types.ObjectId;
  sessionDate: Date;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Scheduled';
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  paymentType?: 'Now' | 'Later';
  paymentStatus?: 'Not Started' | 'Pending' | 'Verified' | 'Rejected' | 'Refunded';
  paymentId?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookingSchema: Schema<IBooking> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Scheduled'],
      default: 'Pending',
    },
    contactInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    paymentType: {
      type: String,
      enum: ['Now', 'Later'],
      default: 'Later',
    },
    paymentStatus: {
      type: String,
      enum: ['Not Started', 'Pending', 'Verified', 'Rejected', 'Refunded'],
      default: 'Not Started',
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
