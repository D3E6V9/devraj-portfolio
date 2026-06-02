import Service from './models/Service';
import BlogPost from './models/BlogPost';
import Product from './models/Product';
import Testimonial from './models/Testimonial';
import Submission from './models/Submission';
import AssessmentResult from './models/AssessmentResult';

// Import initial data from frontend
import {
  INITIAL_SERVICES,
  INITIAL_BLOGS,
  INITIAL_PRODUCTS,
  INITIAL_TESTIMONIALS,
  SEED_SUBMISSIONS,
  SEED_ASSESSMENTS
} from '../src/data';

export const seedDatabase = async () => {
  try {
    // Check if collections already have data
    const serviceCount = await Service.countDocuments();
    if (serviceCount > 0) {
      console.log('✓ Database already seeded, skipping seed operations');
      return;
    }

    console.log('🌱 Seeding database with initial data...');

    // Seed Services
    await Service.insertMany(INITIAL_SERVICES);
    console.log(`✓ Seeded ${INITIAL_SERVICES.length} services`);

    // Seed Blogs
    await BlogPost.insertMany(INITIAL_BLOGS);
    console.log(`✓ Seeded ${INITIAL_BLOGS.length} blog posts`);

    // Seed Products
    await Product.insertMany(INITIAL_PRODUCTS);
    console.log(`✓ Seeded ${INITIAL_PRODUCTS.length} products`);

    // Seed Testimonials
    await Testimonial.insertMany(INITIAL_TESTIMONIALS);
    console.log(`✓ Seeded ${INITIAL_TESTIMONIALS.length} testimonials`);

    // Seed Submissions (CRM tickets)
    await Submission.insertMany(SEED_SUBMISSIONS);
    console.log(`✓ Seeded ${SEED_SUBMISSIONS.length} contact submissions`);

    // Seed Assessment Results
    await AssessmentResult.insertMany(SEED_ASSESSMENTS);
    console.log(`✓ Seeded ${SEED_ASSESSMENTS.length} assessment results`);

    console.log('✓ Database seeding completed successfully');
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    throw error;
  }
};
