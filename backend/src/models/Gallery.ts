import mongoose from "mongoose";

export interface IGallery extends Document {
  imageUrl: string;
  caption?: string;
  uploadedAt: Date;
}

const gallerySchema = new mongoose.Schema<IGallery>({
  imageUrl: { type: String, required: true},
  caption: String,
  uploadedAt: {type: Date, default: Date.now },
});

export default mongoose.model<IGallery>('Gallery', gallerySchema);