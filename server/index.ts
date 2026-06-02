import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from './db';
import { seedDatabase } from './seed';

// Import models
import Service from './models/Service';
import BlogPost from './models/BlogPost';
import Product from './models/Product';
import Testimonial from './models/Testimonial';
import Submission from './models/Submission';
import AssessmentResult from './models/AssessmentResult';
import { INITIAL_PRODUCTS } from '../src/data';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const getOpenAIOptions = () => ({
  apiKey: process.env.OPENAI_API_KEY,
  apiUrl: process.env.OPENAI_API_URL,
  model: process.env.OPENAI_MODEL
});

const formatProductMetadata = (products: Array<{ id: string; name: string; category: string; tags?: string[] }>) => {
  return products
    .map((product) => {
      const tagText = product.tags?.length ? ` tags: ${product.tags.join(', ')}` : '';
      return `${product.id}: ${product.name} (${product.category})${tagText}`;
    })
    .join('\n');
};

const createAssessmentPrompt = (assessment: any, products: Array<{ id: string; name: string; category: string; tags?: string[] }>) => {
  const productListText = formatProductMetadata(products);
  const recommendationText = Array.isArray(assessment.recommendations) && assessment.recommendations.length
    ? `Recommendations: ${assessment.recommendations.join('. ')}`
    : '';

  return `You are a compassionate clinical assistant for Nepa Health. Review the assessment below and available products, then return only valid JSON with exactly three keys:
  - summary_bullets: an array of exactly three short, patient-friendly sentence strings.
  - product_tags: an array of 1 to 4 concise tags selected from the list below.
  - selected_product_ids: an array of 0 to 3 product IDs from the available product list.

Do not include any headings, explanation, or other text outside the JSON object.

Use these tags when relevant:
- depression-support
- anxiety-relief
- stress-management
- sleep-support
- mindfulness-journal
- aromatherapy
- self-care
- coping-tools
- clinical-care

Available products:
${productListText}

Assessment Type: ${assessment.testName}
Score: ${assessment.scores.score} out of ${assessment.scores.maxScore}
Severity: ${assessment.scores.bandLabel}

${recommendationText}
Choose the most relevant products by ID based on score severity and user care needs. If no product is appropriate, return an empty array for selected_product_ids. Keep the summary bullets action-focused and supportive. If severity is moderate or higher, include one bullet that explicitly advises consulting a healthcare professional or counselor.`;
};

const parseAiSummaryResponse = (text: string) => {
  const trimmed = text.trim();
  let payload: any = null;

  const jsonMatch = trimmed.match(/(\{[\s\S]*\})/);
  if (jsonMatch) {
    try {
      payload = JSON.parse(jsonMatch[1]);
    } catch (_error) {
      payload = null;
    }
  }

  if (!payload) {
    try {
      payload = JSON.parse(trimmed);
    } catch (_error) {
      payload = null;
    }
  }

  const knownTags = [
    'depression-support',
    'anxiety-relief',
    'stress-management',
    'sleep-support',
    'mindfulness-journal',
    'aromatherapy',
    'self-care',
    'coping-tools',
    'clinical-care'
  ];

  const fallbackBullets = trimmed
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .slice(0, 3)
    .map(line => line.replace(/^[-*]\s*/, ''));

  const fallbackTags = new Set<string>();
  const normalized = trimmed.toLowerCase();
  knownTags.forEach((tag) => {
    if (normalized.includes(tag)) {
      fallbackTags.add(tag);
    }
  });

  return {
    summaryBullets: Array.isArray(payload?.summary_bullets)
      ? payload.summary_bullets.map(String).slice(0, 3)
      : fallbackBullets,
    productTags: Array.isArray(payload?.product_tags)
      ? Array.from(new Set(payload.product_tags.map(String))).slice(0, 4)
      : Array.from(fallbackTags).slice(0, 4),
    selectedProductIds: Array.isArray(payload?.selected_product_ids)
      ? Array.from(new Set(payload.selected_product_ids.map(String))).slice(0, 3)
      : []
  };
};

const fetchAiSummary = async (
  assessment: any,
  products: Array<{ id: string; name: string; category: string; tags?: string[] }>
): Promise<{ summaryBullets: string[]; productTags: string[]; selectedProductIds: string[] } | null> => {
  const { apiKey, apiUrl, model } = getOpenAIOptions();
  if (!apiKey || !apiUrl || !model) {
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        input: [
          { role: 'system', content: 'You are a clinical assistant that summarizes mental health assessment results.' },
          { role: 'user', content: createAssessmentPrompt(assessment, products) }
        ]
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const text = data?.output?.[0]?.content?.[0]?.text || data?.output_text;
    if (typeof text !== 'string') {
      return null;
    }

    return parseAiSummaryResponse(text);
  } catch (error) {
    console.error('✗ AI summary generation failed:', error);
    return null;
  }
};

// ============================================
// ADMIN AUTHENTICATION ENDPOINT
// ============================================
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nepahealth.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials.' });
});

app.post('/api/admin/reset-data', async (req: Request, res: Response) => {
  try {
    const assessmentResult = await AssessmentResult.deleteMany({});
    const submissionResult = await Submission.deleteMany({});

    return res.status(200).json({
      success: true,
      deletedAssessments: assessmentResult.deletedCount,
      deletedSubmissions: submissionResult.deletedCount
    });
  } catch (error) {
    console.error('✗ Failed to reset generated data:', error);
    return res.status(500).json({ error: 'Failed to reset generated data' });
  }
});

// ============================================
// SERVICES API ENDPOINTS
// ============================================
app.get('/api/services', async (req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ category: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.put('/api/services/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Service.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// ============================================
// BLOGS API ENDPOINTS
// ============================================
app.get('/api/blogs', async (req: Request, res: Response) => {
  try {
    const blogs = await BlogPost.find().sort({ date: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

app.post('/api/blogs', async (req: Request, res: Response) => {
  try {
    const newBlog = new BlogPost({
      ...req.body,
      id: 'blog-' + Date.now()
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

app.put('/api/blogs/:id', async (req: Request, res: Response) => {
  try {
    const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

app.delete('/api/blogs/:id', async (req: Request, res: Response) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// ============================================
// PRODUCTS API ENDPOINTS
// ============================================
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ category: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const newProduct = new Product({
      ...req.body,
      id: 'prod-' + Date.now()
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============================================
// TESTIMONIALS API ENDPOINTS
// ============================================
app.get('/api/testimonials', async (req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.find().sort({ rating: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.post('/api/testimonials', async (req: Request, res: Response) => {
  try {
    const newTestimonial = new Testimonial({
      ...req.body,
      id: 't-' + Date.now()
    });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.delete('/api/testimonials/:id', async (req: Request, res: Response) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ============================================
// SUBMISSIONS (CONTACTS/CRM) API ENDPOINTS
// ============================================
app.get('/api/submissions', async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

app.post('/api/submissions', async (req: Request, res: Response) => {
  try {
    const newSubmission = new Submission({
      ...req.body,
      id: 'sub-' + Date.now(),
      submittedAt: new Date().toISOString(),
      status: 'new'
    });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

app.patch('/api/submissions/:id', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update submission status' });
  }
});

app.delete('/api/submissions/:id', async (req: Request, res: Response) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

// ============================================
// ASSESSMENTS API ENDPOINTS
// ============================================
app.get('/api/assessments', async (req: Request, res: Response) => {
  try {
    const assessments = await AssessmentResult.find().sort({ submittedAt: -1 });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

app.post('/api/assessments', async (req: Request, res: Response) => {
  try {
    const assessmentPayload = req.body;
    const dbProducts = await Product.find().lean();
    const promptProducts = dbProducts.length && dbProducts.some((p: any) => Array.isArray(p.tags) && p.tags.length)
      ? dbProducts
      : INITIAL_PRODUCTS;

    const generatedSummary = await fetchAiSummary(assessmentPayload, promptProducts as any);
    const summaryBullets = generatedSummary?.summaryBullets ?? [];
    const productTags = generatedSummary?.productTags ?? [];
    const selectedProductIds = generatedSummary?.selectedProductIds ?? [];
    const analysisSummary = summaryBullets.length
      ? summaryBullets.map((line) => `- ${line}`).join('\n')
      : '';

    const newAssessment = new AssessmentResult({
      ...assessmentPayload,
      analysisSummary,
      summaryBullets,
      productTags,
      selectedProductIds,
      id: 'asmt-' + Date.now(),
      submittedAt: new Date().toISOString()
    });

    await newAssessment.save();
    res.status(201).json(newAssessment);
  } catch (error) {
    console.error('✗ Failed to create assessment:', error);
    res.status(500).json({ error: 'Failed to create assessment' });
  }
});

// ============================================
// STATIC FILE SERVING (Production Mode)
// ============================================
if (NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../dist');
  app.use(express.static(publicPath));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// SERVER INITIALIZATION
// ============================================
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Seed database if needed
    await seedDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n✓ Server is running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${NODE_ENV}`);
      console.log(`✓ API available at http://localhost:${PORT}/api/*\n`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await disconnectDB();
  process.exit(0);
});

startServer();

export default app;
