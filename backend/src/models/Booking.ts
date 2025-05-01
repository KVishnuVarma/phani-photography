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
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
