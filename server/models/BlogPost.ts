import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    readTime: { type: String, required: true }
  },
  { timestamps: true }
);

// Index for fast category and date lookups
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ date: -1 });

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
