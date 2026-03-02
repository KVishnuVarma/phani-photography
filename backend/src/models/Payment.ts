import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  bookingId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  amount: number;
  paymentMethod: 'Phonepe' | 'Paytm' | 'GooglePay' | 'BankTransfer' | 'UPI';
  upiId: string;
  displayName: string;
  status: 'Pending' | 'Verified' | 'Rejected' | 'Refunded';
  transactionId?: string;
  screenshot?: string;
  adminNotes?: string;
  scannerUrl?: string;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema: Schema<IPayment> = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 100,
    },
    paymentMethod: {
      type: String,
      enum: ['Phonepe', 'Paytm', 'GooglePay', 'BankTransfer', 'UPI'],
      required: true,
    },
    upiId: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'Refunded'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
      default: '',
    },
    screenshot: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    scannerUrl: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', paymentSchema);
