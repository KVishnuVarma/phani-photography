import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentScanner extends Document {
  scannerUrl: string;
  scannerType: 'UPI' | 'QR' | 'BankDetails' | 'PhonePe' | 'GooglePay' | 'Paytm';
  description?: string;
  isActive: boolean;
  uploadedBy?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentScannerSchema: Schema<IPaymentScanner> = new mongoose.Schema(
  {
    scannerUrl: {
      type: String,
      required: true,
    },
    scannerType: {
      type: String,
      enum: ['UPI', 'QR', 'BankDetails', 'PhonePe', 'GooglePay', 'Paytm'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPaymentScanner>('PaymentScanner', paymentScannerSchema);
