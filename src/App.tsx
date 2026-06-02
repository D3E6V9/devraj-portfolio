import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemStatement from './components/ProblemStatement';
import HowItWorks from './components/HowItWorks';
import ServicesSection from './components/ServicesSection';
import ImpactStats from './components/ImpactStats';
import WhoWeServe from './components/WhoWeServe';
import WellMartPreview from './components/WellMartPreview';
import Testimonials from './components/Testimonials';
import Values from './components/Values';
import CorporateCTA from './components/CorporateCTA';
import BlogPreview from './components/BlogPreview';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AssessmentCenter from './components/AssessmentCenter';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import WellMartCatalog from './components/WellMartCatalog';

import { 
  INITIAL_SERVICES, 
  INITIAL_VALUES, 
  INITIAL_TESTIMONIALS, 
  INITIAL_PRODUCTS, 
  INITIAL_BLOGS 
} from './data';
import { 
  ServiceItem, 
  BlogPost, 
  ProductItem, 
  TestimonialItem, 
  ContactSubmission, 
  SelfAssessmentResult, 
  ValueItem 
} from './types';

// API base URL - falls back to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const normalizePath = (path: string) => {
  const cleaned = path.replace(/^\/+/g, '').toLowerCase();
  return cleaned === '' ? 'home' : cleaned;
};

const getInitialRoute = () => {
  const path = normalizePath(window.location.pathname);
  const token = localStorage.getItem('adminToken');
  if (path === 'admin' && !token) return 'admin-login';
  return path;
};

// Default mock ticket logs for realistic admin dashboards
const SEED_SUBMISSIONS: ContactSubmission[] = [
  {
    id: 'sub-seed-1',
    name: 'Manoj Khadka',
    email: 'manoj.khadka@outlook.com',
    phone: '9841556622',
    serviceInterest: 'Corporate Wellness Programs',
    message: 'Hello, we are looking for a mental resilience diagnostic workshop for 140 developers at our tech startup in Kathmandu (Baneshwor). Do you provide localized physical guides?',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'new'
  },
  {
    id: 'sub-seed-2',
    name: 'Priyanka Shrestha',
    email: 'priya08@gmail.com',
    phone: '9801223344',
    serviceInterest: 'Mental Health Counseling',
    message: 'Does Nepa Health offer direct virtual consultations for teenagers facing high parental strain? My younger sister is experiencing burnout from exams.',
    submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'new'
  }
];

const SEED_ASSESSMENTS: SelfAssessmentResult[] = [
  {
    id: 'asmt-seed-1',
    testName: 'GAD-7',
    userName: 'Kiran B. (Lalitpur)',
    scores: {
      score: 11,
      maxScore: 21,
      bandCode: 'moderate',
      bandLabel: 'Moderate Anxiety Severity',
      bandColor: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    answers: {},
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    recommendations: ['Adopt the Lok-Step breathing loop hourly', 'Practice Himalayan visualization'],
    analysisSummary: 'Your score shows moderate anxiety. This result means it would help to use calming routines and connect with a counselor if symptoms continue.'
  },
  {
    id: 'asmt-seed-2',
    testName: 'PHQ-9',
    userName: 'Sunita D. (Pokhara)',
    scores: {
      score: 6,
      maxScore: 27,
      bandCode: 'mild',
      bandLabel: 'Mild Depression Severity',
      bandColor: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    },
    answers: {},
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    recommendations: ['Consider journaling', 'Read blog articles about sleep hygiene'],
    analysisSummary: 'Your score is in the mild depression range. Keep tracking your mood and seek guidance from a counselor if these feelings persist.'
  },
  {
    id: 'asmt-seed-3',
    testName: 'PSS-10',
    userName: 'Aayush S. (Kathmandu)',
    scores: {
      score: 18,
      maxScore: 40,
      bandCode: 'moderate',
      bandLabel: 'Moderate Stress Severity',
      bandColor: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    answers: {},
    submittedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    recommendations: ['Engage in morning meditation', 'Limit social media scrolls'],
    analysisSummary: 'Your score reflects moderate perceived stress. It is useful to build in recovery time and speak with a counselor if the pressure persists.'
  }
];

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(getInitialRoute);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Check for existing admin token on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAdminToken(token);
    }
  }, []);

  // Sync app state with browser history / direct URL navigation
  useEffect(() => {
    const onPopState = () => {
      const path = normalizePath(window.location.pathname);
      const token = localStorage.getItem('adminToken');
      if (path === 'admin' && !token) {
        setCurrentPath('admin-login');
      } else {
        setCurrentPath(path);
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Interactive Live State Engines for components
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [values, setValues] = useState<ValueItem[]>(INITIAL_VALUES);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>(SEED_SUBMISSIONS);
  const [assessmentResults, setAssessmentResults] = useState<SelfAssessmentResult[]>(SEED_ASSESSMENTS);
  const [cart, setCart] = useState<ProductItem[]>([]);
  const [initialContactInterest, setInitialContactInterest] = useState<string>('Mental Health Counseling');

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [servicesRes, blogsRes, productsRes, testimonialsRes, submissionsRes, assessmentsRes] = await Promise.all([
          fetch(`${API_URL}/api/services`).catch(() => null),
          fetch(`${API_URL}/api/blogs`).catch(() => null),
          fetch(`${API_URL}/api/products`).catch(() => null),
          fetch(`${API_URL}/api/testimonials`).catch(() => null),
          fetch(`${API_URL}/api/submissions`).catch(() => null),
          fetch(`${API_URL}/api/assessments`).catch(() => null)
        ]);

        if (servicesRes?.ok) setServices(await servicesRes.json());
        if (blogsRes?.ok) setBlogs(await blogsRes.json());
        if (productsRes?.ok) setProducts(await productsRes.json());
        if (testimonialsRes?.ok) setTestimonials(await testimonialsRes.json());
        if (submissionsRes?.ok) setContactSubmissions(await submissionsRes.json());
        if (assessmentsRes?.ok) setAssessmentResults(await assessmentsRes.json());

        console.log('✓ Data fetched from API');
      } catch (error) {
        console.warn('⚠ API not available, using fallback data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Routing and Navigation handlers
  const handleNavigate = (path: string) => {
    const targetPath = path === 'home' ? '/' : `/${path}`;

    if (path === 'admin' && !adminToken) {
      window.history.pushState(null, '', '/admin-login');
      setCurrentPath('admin-login');
    } else {
      window.history.pushState(null, '', targetPath);
      setCurrentPath(path);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
    window.history.pushState(null, '', '/admin');
    setCurrentPath('admin');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    window.history.pushState(null, '', '/');
    setCurrentPath('home');
  };

  // Submission handles - now with API integration
  const handleNewSubmission = async (formSubset: Omit<ContactSubmission, 'id' | 'submittedAt' | 'status'>) => {
    try {
      const response = await fetch(`${API_URL}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formSubset)
      });

      if (response.ok) {
        const newSub = await response.json();
        setContactSubmissions((prev) => [newSub, ...prev]);
        console.log('✓ Submission saved to database');
      }
    } catch (error) {
      console.error('✗ Failed to save submission:', error);
      // Fallback: create locally (offline support)
      const newSub: ContactSubmission = {
        ...formSubset,
        id: 'sub-' + Date.now(),
        submittedAt: new Date().toISOString(),
        status: 'new'
      };
      setContactSubmissions((prev) => [newSub, ...prev]);
    }
  };

  const handleAddAssessmentResult = async (formSubset: Omit<SelfAssessmentResult, 'id' | 'submittedAt'>): Promise<SelfAssessmentResult> => {
    try {
      const response = await fetch(`${API_URL}/api/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formSubset)
      });

      if (response.ok) {
        const newAsmt = await response.json();
        setAssessmentResults((prev) => [newAsmt, ...prev]);
        console.log('✓ Assessment result saved to database');
        return newAsmt;
      }
    } catch (error) {
      console.error('✗ Failed to save assessment:', error);
    }

    const fallbackAsmt: SelfAssessmentResult = {
      ...formSubset,
      id: 'asmt-' + Date.now(),
      submittedAt: new Date().toISOString()
    };
    setAssessmentResults((prev) => [fallbackAsmt, ...prev]);
    return fallbackAsmt;
  };

  // E-Commerce cart handles
  const handleAddToCart = (product: ProductItem) => {
    if (cart.some(item => item.id === product.id)) {
      alert(`${product.name} is already in your checkout cart! Click "Checkout" at the top right to complete your order.`);
      return;
    }
    setCart((prev) => [...prev, product]);
    alert(`Added ${product.name} to checkout bag! Ready to checkout.`);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleQuoteRequestedFromCorporate = (interestTopic: string) => {
    setInitialContactInterest(interestTopic);
    // Smooth scroll down to Contact form
    const contactEl = document.getElementById('contact-section');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleNavigate('home');
      setTimeout(() => {
        const contactElSec = document.getElementById('contact-section');
        if (contactElSec) contactElSec.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-primary/20 selection:text-[#1C2B2B]">
      
      {/* Sticky Global Navigation bar */}
      <Navbar key={currentPath} currentPath={currentPath} onNavigate={handleNavigate} />

      {/* CORE PAGES RENDERING LOGIC */}
      <main className="flex-grow">
        {currentPath === 'home' && (
          <>
            {/* HERO SECTION */}
            <Hero onNavigate={handleNavigate} />

            {/* PROBLEM STATEMENT VIEW */}
            <ProblemStatement />

            {/* HOW IT WORKS / BLUEPRINT */}
            <HowItWorks />

            {/* LIVE SERVICES CMS GRID */}
            <ServicesSection services={services} onSelectService={handleNavigate} />

            {/* MOUNT IN-VALS STREAK COUNTERS */}
            <ImpactStats />

            {/* PERSONA SEGMENTATION */}
            <WhoWeServe />

            {/* WELL-MART PREVIEW */}
            <WellMartPreview 
              products={products} 
              onViewWellMart={() => handleNavigate('well-mart')} 
              onAddToCart={handleAddToCart}
            />

            {/* STORY SLIDER */}
            <Testimonials testimonials={testimonials} />

            {/* VALUES MASONRY GRI */}
            <Values values={values} />

            {/* SPECIAL B2B ACTION SECTOR */}
            <CorporateCTA onQuoteRequested={handleQuoteRequestedFromCorporate} />

            {/* INTERACTIVE INSIGHTS blogs preview */}
            <BlogPreview blogs={blogs} />

            {/* ACCORDION FAQS */}
            <FAQ />

            {/* CRM INPUT FORMS SECTION */}
            <ContactSection 
              initialInterest={initialContactInterest} 
              onNewSubmission={handleNewSubmission} 
            />
          </>
        )}

        {/* 1. CLINICAL SCREENING QUIZ BOARD */}
        {currentPath === 'assessments' && (
          <AssessmentCenter 
            onAddAssessmentResult={handleAddAssessmentResult}
            products={products}
            onAddToCart={handleAddToCart}
            onNavigateToShop={() => handleNavigate('well-mart')}
          />
        )}

        {/* 2. FULL BLOGS ARTICLES WORKSPACE */}
        {currentPath === 'blog' && (
          <div className="bg-white min-h-screen">
            <BlogPreview blogs={blogs} isFullRoute={true} />
            
            {/* CTA section directly attached to full resource view */}
            <div className="py-12 bg-bggray border-t border-primary/5 text-center px-4">
              <h3 className="font-serif font-black text-dark text-xl sm:text-2xl">Want structured advice about your scores?</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">Take an anonymous PHQ-9 or GAD-7 screening check-up instantly.</p>
              <button
                onClick={() => handleNavigate('assessments')}
                className="mt-5 bg-primary text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl cursor-pointer hover:bg-primary-hover shadow"
              >
                Launch Screener Center
              </button>
            </div>
          </div>
        )}

        {/* 3. FULL WELL-MART THERAPEUTICS E-MARKET */}
        {currentPath === 'well-mart' && (
          <WellMartCatalog 
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
          />
        )}

        {/* 4. ADMIN LOGIN PAGE */}
        {currentPath === 'admin-login' && (
          <AdminLogin onLoginSuccess={handleAdminLogin} />
        )}

        {/* 5. CRM & CMS ADMIN WORKSPACE */}
        {currentPath === 'admin' && adminToken && (
          <AdminDashboard 
            services={services}
            setServices={setServices}
            blogs={blogs}
            setBlogs={setBlogs}
            products={products}
            setProducts={setProducts}
            testimonials={testimonials}
            setTestimonials={setTestimonials}
            contactSubmissions={contactSubmissions}
            setContactSubmissions={setContactSubmissions}
            assessmentResults={assessmentResults}
            setAssessmentResults={setAssessmentResults}
            onLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Global Regulatory Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
