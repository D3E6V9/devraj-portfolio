import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  id: string;
  title: string;
  iconName: string;
  shortDesc: string;
  longDesc: string;
  points: string[];
  ctaText: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    iconName: { type: String, required: true },
    shortDesc: { type: String, required: true },
    longDesc: { type: String, required: true },
    points: [{ type: String, required: true }],
    ctaText: { type: String, required: true },
    category: { type: String, required: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', ServiceSchema);
