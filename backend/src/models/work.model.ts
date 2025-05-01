import mongoose, { Document, Schema } from 'mongoose';

export interface IWork extends Document {
  title: string;
  imageUrl: string;
}

const WorkSchema = new Schema<IWork>({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IWork>('Work', WorkSchema);
