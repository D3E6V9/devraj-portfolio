import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatarUrl: string;
  profession: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    avatarUrl: { type: String, required: true },
    profession: { type: String, required: true }
  },
  { timestamps: true }
);

// Index for rating lookups
TestimonialSchema.index({ rating: -1 });

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
