// models/Package.ts
import mongoose, { Schema, Document } from 'mongoose';
import { string } from 'zod';

export interface IPackage extends Document {
  title: string;
  description: string;
  price: number;
  photosIncluded: number;
  category: 'Wedding' | 'Birthday' | 'Outdoor';
  features: string[];
  thumbnailUrl?: string;
}

const packageSchema: Schema = new Schema<IPackage>({
  title: { type: String, required: true },
  category: { type: String, enum: ['Wedding', 'Birthday', 'Outdoor'], required: true },
  photosIncluded: { type: Number, required: true},
  price: { type: Number, required: true },
  description: { type: String, required: true },
  features: { type: [String], required: true },
  thumbnailUrl: { type: String, default: '' },
});

export default mongoose.model<IPackage>('Package', packageSchema);
