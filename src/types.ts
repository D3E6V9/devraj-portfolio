export interface ServiceItem {
  id: string;
  title: string;
  iconName: string; // Lucide icon key
  shortDesc: string;
  longDesc: string;
  points: string[];
  ctaText: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatarUrl: string;
  profession: string;
}

export interface ValueItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'archived';
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isComingSoon: boolean;
  category: string;
  tags?: string[];
}

export interface SelfAssessmentResult {
  id: string;
  testName: 'PHQ-9' | 'GAD-7' | 'PSS-10';
  userName: string;
  scores: {
    score: number;
    maxScore: number;
    bandCode: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe' | 'low' | 'high';
    bandLabel: string;
    bandColor: string; // CSS hex or Tailwind class
  };
  answers: Record<string, number>;
  submittedAt: string;
  recommendations: string[];
  analysisSummary: string;
  summaryBullets?: string[];
  productTags?: string[];
  selectedProductIds?: string[];
}
