import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isComingSoon: boolean;
  category: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    isComingSoon: { type: Boolean, default: false },
    category: { type: String, required: true, index: true },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

// Indexes for quick lookups
ProductSchema.index({ category: 1 });
ProductSchema.index({ isComingSoon: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
