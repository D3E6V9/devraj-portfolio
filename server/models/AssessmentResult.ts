import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentResult extends Document {
  id: string;
  testName: 'PHQ-9' | 'GAD-7' | 'PSS-10';
  userName: string;
  scores: {
    score: number;
    maxScore: number;
    bandCode: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe' | 'low' | 'high';
    bandLabel: string;
    bandColor: string;
  };
  answers: Record<string, number>;
  submittedAt: string;
  recommendations: string[];
  analysisSummary: string;
  summaryBullets?: string[];
  productTags?: string[];
  selectedProductIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ScoresSchema = new Schema({
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  bandCode: { type: String, enum: ['minimal', 'mild', 'moderate', 'moderately_severe', 'severe', 'low', 'high'], required: true },
  bandLabel: { type: String, required: true },
  bandColor: { type: String, required: true }
}, { _id: false });

const AssessmentResultSchema = new Schema<IAssessmentResult>(
  {
    id: { type: String, unique: true, required: true },
    testName: { type: String, enum: ['PHQ-9', 'GAD-7', 'PSS-10'], required: true, index: true },
    userName: { type: String, required: true },
    scores: { type: ScoresSchema, required: true },
    answers: { type: Map, of: Number, default: {} },
    submittedAt: { type: String, required: true },
    recommendations: [{ type: String }],
    analysisSummary: { type: String, required: true },
    summaryBullets: [{ type: String }],
    productTags: [{ type: String }],
    selectedProductIds: [{ type: String }]
  },
  { timestamps: true }
);

// Indexes for clinical dashboards
AssessmentResultSchema.index({ submittedAt: -1 });

export default mongoose.model<IAssessmentResult>('AssessmentResult', AssessmentResultSchema);
