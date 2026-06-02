import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    serviceInterest: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'archived'], default: 'new', index: true }
  },
  { timestamps: true }
);

// Indexes for CRM operations
SubmissionSchema.index({ submittedAt: -1 });
SubmissionSchema.index({ email: 1 });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
