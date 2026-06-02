import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  Database,
  UserCheck, 
  Trash2, 
  Edit3, 
  Plus, 
  Check, 
  TrendingUp, 
  Activity, 
  ShoppingBag,
  Settings,
  Archive,
  RefreshCw,
  FolderLock
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ServiceItem, 
  BlogPost, 
  ProductItem, 
  TestimonialItem, 
  ContactSubmission, 
  SelfAssessmentResult 
} from '../types';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface AdminDashboardProps {
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  products: ProductItem[];
  setProducts: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  testimonials: TestimonialItem[];
  setTestimonials: React.Dispatch<React.SetStateAction<TestimonialItem[]>>;
  contactSubmissions: ContactSubmission[];
  setContactSubmissions: React.Dispatch<React.SetStateAction<ContactSubmission[]>>;
  assessmentResults: SelfAssessmentResult[];
  setAssessmentResults: React.Dispatch<React.SetStateAction<SelfAssessmentResult[]>>;
  onLogout: () => void;
}

type AdminViewType = 'services' | 'blogs' | 'products' | 'testimonials' | 'submissions' | 'assessments' | 'analytics';

export default function AdminDashboard({
  services, setServices,
  blogs, setBlogs,
  products, setProducts,
  testimonials, setTestimonials,
  contactSubmissions, setContactSubmissions,
  assessmentResults,
  setAssessmentResults,
  onLogout
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminViewType>('submissions');

  // Defensive cleanup: remove any stray full-screen overlay/backdrop elements
  // that may have remained from modals or mobile drawers. This ensures the
  // admin workspace is interactive after route transitions.
  React.useEffect(() => {
    const removeOverlays = () => {
      try {
        const candidates = Array.from(document.querySelectorAll('div')) as HTMLElement[];
        candidates.forEach((el) => {
          const cls = el.className || '';
          if (cls.includes('fixed') && cls.includes('inset-0')) {
            const style = window.getComputedStyle(el);
            const z = parseInt(style.zIndex || '0', 10) || 0;
            const bg = style.backgroundColor || '';
            // target dark translucent full-screen overlays with high z-index
            if (z >= 30 && (bg.includes('rgb(0,') || bg.includes('rgba(0,') || cls.includes('backdrop-blur') || cls.includes('bg-dark') || cls.includes('bg-black'))) {
              el.remove();
            }
          }
        });
        // ensure body scroll/clicks are enabled
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
      } catch (err) {
        // ignore
        // eslint-disable-next-line no-console
        console.warn('Overlay cleanup failed', err);
      }
    };

    removeOverlays();
    // also run after a short delay to catch animated exits
    const t = setTimeout(removeOverlays, 300);
    return () => clearTimeout(t);
  }, []);

  // Local helper states for editing/creating items
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormData, setServiceFormData] = useState<Partial<ServiceItem>>({});

  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState<Partial<BlogPost>>({
    title: '', category: 'Anxiety', excerpt: '', content: '', coverImage: 'https://images.unsplash.com/photo-1474418397713-7dedd1186594?auto=format&fit=crop&q=80&w=500', author: 'Staff Caregiver', date: 'June 2026', readTime: '4 min read'
  });

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productFormData, setProductFormData] = useState<Partial<ProductItem>>({
    name: '', description: '', price: 1000, imageUrl: 'https://images.unsplash.com/photo-1611079830570-cc390901f600?auto=format&fit=crop&q=80&w=400', isComingSoon: false, category: 'Therapeutic Kits'
  });

  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);
  const [testimonialFormData, setTestimonialFormData] = useState<Partial<TestimonialItem>>({
    name: '', location: 'Kathmandu, Nepal', quote: '', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100', profession: 'Wellness Patron'
  });

  // Services CRUD operations - with API integration
  const handleEditServiceClick = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setServiceFormData({ ...srv });
  };

  const handleSaveService = async () => {
    if (!serviceFormData.title || !serviceFormData.shortDesc) {
      alert('Please complete the Title and description before saving.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/services/${editingServiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceFormData)
      });
      if (response.ok) {
        setServices((prev) => 
          prev.map((s) => (s.id === editingServiceId ? (serviceFormData as ServiceItem) : s))
        );
        setEditingServiceId(null);
        setServiceFormData({});
      }
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service. Updates may be local-only.');
    }
  };

  // Blogs CRUD operations - with API integration
  const handleEditBlogClick = (b: BlogPost) => {
    setEditingBlogId(b.id);
    setBlogFormData({ ...b });
    setIsCreatingBlog(false);
  };

  const handleSaveBlog = async () => {
    if (!blogFormData.title || !blogFormData.content) {
      alert('Content fields are required.');
      return;
    }
    try {
      if (isCreatingBlog) {
        const response = await fetch(`${API_URL}/api/blogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogFormData)
        });
        if (response.ok) {
          const newBlog = await response.json();
          setBlogs((prev) => [newBlog, ...prev]);
        }
      } else {
        const response = await fetch(`${API_URL}/api/blogs/${editingBlogId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogFormData)
        });
        if (response.ok) {
          setBlogs((prev) => 
            prev.map((b) => (b.id === editingBlogId ? (blogFormData as BlogPost) : b))
          );
        }
      }
      setEditingBlogId(null);
      setIsCreatingBlog(false);
      setBlogFormData({
        title: '', category: 'Anxiety', excerpt: '', content: '', coverImage: 'https://images.unsplash.com/photo-1474418397713-7dedd1186594?auto=format&fit=crop&q=80&w=500', author: 'Staff Caregiver', date: 'June 2026', readTime: '4 min read'
      });
    } catch (error) {
      console.error('Failed to save blog:', error);
      alert('Failed to save blog. Updates may be local-only.');
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (confirm('Delete this article?')) {
      try {
        const response = await fetch(`${API_URL}/api/blogs/${blogId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setBlogs((prev) => prev.filter((b) => b.id !== blogId));
        }
      } catch (error) {
        console.error('Failed to delete blog:', error);
        alert('Failed to delete blog. Deletion may be local-only.');
      }
    }
  };

  // Products CRUD operations - with API integration
  const handleEditProductClick = (p: ProductItem) => {
    setEditingProductId(p.id);
    setProductFormData({ ...p });
    setIsCreatingProduct(false);
  };

  const handleSaveProduct = async () => {
    if (!productFormData.name || !productFormData.price) {
      alert('Price and Name are required.');
      return;
    }
    try {
      if (isCreatingProduct) {
        const response = await fetch(`${API_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productFormData)
        });
        if (response.ok) {
          const newProd = await response.json();
          setProducts((prev) => [...prev, newProd]);
        }
      } else {
        const response = await fetch(`${API_URL}/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productFormData)
        });
        if (response.ok) {
          setProducts((prev) => 
            prev.map((p) => (p.id === editingProductId ? (productFormData as ProductItem) : p))
          );
        }
      }
      setEditingProductId(null);
      setIsCreatingProduct(false);
      setProductFormData({
        name: '', description: '', price: 1000, imageUrl: 'https://images.unsplash.com/photo-1611079830570-cc390901f600?auto=format&fit=crop&q=80&w=400', isComingSoon: false, category: 'Therapeutic Kits'
      });
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Updates may be local-only.');
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (confirm('Delete this product?')) {
      try {
        const response = await fetch(`${API_URL}/api/products/${prodId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setProducts((prev) => prev.filter((p) => p.id !== prodId));
        }
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Deletion may be local-only.');
      }
    }
  };

  // Testimonials CRUD operations - with API integration
  const handleCreateTestimonial = async () => {
    if (!testimonialFormData.name || !testimonialFormData.quote) {
      alert('Quote and Name are required.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialFormData)
      });
      if (response.ok) {
        const newTestimonial = await response.json();
        setTestimonials((prev) => [newTestimonial, ...prev]);
      }
      setIsCreatingTestimonial(false);
      setTestimonialFormData({
        name: '', location: 'Kathmandu, Nepal', quote: '', rating: 5, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100', profession: 'Wellness Patron'
      });
    } catch (error) {
      console.error('Failed to create testimonial:', error);
      alert('Failed to create testimonial. Changes may be local-only.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      try {
        const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setTestimonials((prev) => prev.filter((t) => t.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete testimonial:', error);
        alert('Failed to delete testimonial. Deletion may be local-only.');
      }
    }
  };

  // Submissions status toggle - with API integration
  const toggleSubmissionStatus = async (id: string, status: 'contacted' | 'archived') => {
    try {
      const response = await fetch(`${API_URL}/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setContactSubmissions((prev) => 
          prev.map((sub) => (sub.id === id ? { ...sub, status } : sub))
        );
      }
    } catch (error) {
      console.error('Failed to update submission status:', error);
      alert('Failed to update status. Changes may be local-only.');
    }
  };

  const deleteSubmission = async (id: string) => {
    if (confirm('Are you sure you want to delete this submission log permanently?')) {
      try {
        const response = await fetch(`${API_URL}/api/submissions/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setContactSubmissions((prev) => prev.filter(sub => sub.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete submission:', error);
        alert('Failed to delete submission. Deletion may be local-only.');
      }
    }
  };

  const resetGeneratedData = async () => {
    if (!confirm('Reset generated data? This will clear all assessment and submission records from the database.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/reset-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Reset request failed');
      }

      const result = await response.json();
      setContactSubmissions([]);
      setAssessmentResults([]);
      alert(`Reset completed. Deleted ${result.deletedAssessments || 0} assessments and ${result.deletedSubmissions || 0} submissions.`);
    } catch (error) {
      console.error('Failed to reset generated data:', error);
      alert('Unable to reset generated data. Please try again later.');
    }
  };

  // Assessment results calculators
  const getAvgTestScore = (testName: 'PHQ-9' | 'GAD-7' | 'PSS-10') => {
    const matched = assessmentResults.filter(r => r.testName === testName);
    if (matched.length === 0) return 0;
    const sum = matched.reduce((acc, current) => acc + current.scores.score, 0);
    return parseFloat((sum / matched.length).toFixed(1));
  };

  const getAssessmentCounts = () => {
    const counts = {
      minimal: 0,
      mild: 0,
      moderate: 0,
      moderately_severe: 0,
      severe: 0,
      low: 0,
      high: 0
    };
    assessmentResults.forEach((result) => {
      counts[result.scores.bandCode] = (counts[result.scores.bandCode] ?? 0) + 1;
    });
    return counts;
  };

  const getHighRiskCount = () => {
    return assessmentResults.filter((result) => {
      if (result.testName === 'PSS-10') {
        return result.scores.bandCode === 'high';
      }
      return ['moderate', 'moderately_severe', 'severe'].includes(result.scores.bandCode);
    }).length;
  };

  const getModeratePlusPercentage = () => {
    if (assessmentResults.length === 0) return 0;
    return parseFloat(((getHighRiskCount() / assessmentResults.length) * 100).toFixed(1));
  };

  const getAssessmentsInWindow = (days: number) => {
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    return assessmentResults.filter((result) => new Date(result.submittedAt).getTime() >= threshold);
  };

  const getRecentHighRisk = () => {
    return assessmentResults
      .filter((result) => {
        if (result.testName === 'PSS-10') {
          return result.scores.bandCode === 'high';
        }
        return ['moderate', 'moderately_severe', 'severe'].includes(result.scores.bandCode);
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5);
  };

  const filterTabList = [
    { code: 'submissions', label: 'Consult Inquiries', icon: MessageSquare, badge: contactSubmissions.filter(s => s.status === 'new').length },
    { code: 'analytics', label: 'Screener Analytics', icon: TrendingUp, badge: assessmentResults.length },
    { code: 'assessments', label: 'Screening Metrics', icon: Activity, badge: assessmentResults.length },
    { code: 'services', label: 'Offerings Content', icon: Database },
    { code: 'blogs', label: 'Resources & Blogs', icon: BookOpen },
    { code: 'products', label: 'Well-Mart Items', icon: ShoppingBag },
    { code: 'testimonials', label: 'Healing Stories', icon: Users }
  ];

  return (
    <div id="admin-main-section" className="pt-24 sm:pt-28 min-h-screen bg-bggray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Admin Dashboard header */}
        <div className="bg-[#1C2B2B] text-white p-6 sm:p-8 rounded-3xl border border-white/10 mb-8 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="space-y-1.5">
            <span className="inline-flex items-center text-[10px] font-bold text-accent px-2 py-0.5 rounded bg-amber-400/10 border border-accent/20 uppercase tracking-widest">
              Security Safe Environment
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black flex items-center">
              <FolderLock className="w-6 h-6 text-accent mr-2.5" />
              Nepa Health CMS & CRM Cabin
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Real-time synchronization with active components. Add blog contents, coordinate consultation tickets, and evaluate anonymous screening dashboards in real-time.
            </p>
          </div>

          <div className="bg-white/5 py-3 px-5 rounded-2xl border border-white/10 text-left flex flex-col justify-between min-h-20">
            <div>
              <span className="text-[9px] font-bold text-primary font-mono block uppercase">Authenticated Session</span>
              <span className="text-xs font-mono font-bold block text-accent mt-0.5">Admin Level Access</span>
            </div>
            <div className="space-y-3 mt-3">
              <button
                onClick={resetGeneratedData}
                className="w-full text-center bg-red-500/15 hover:bg-red-500/30 text-red-500 hover:text-white text-xs font-bold py-2 rounded-lg transition-all border border-red-500/20"
              >
                Reset Generated Data
              </button>
              <button
                onClick={onLogout}
                className="w-full text-center bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold py-2 rounded-lg transition-all border border-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column Admin Menu bar */}
          <div className="lg:col-span-3 space-y-2 bg-white p-4 rounded-2xl border border-primary/10 shadow-sm">
            <div className="pb-3 border-b border-primary/5 mb-3 hidden lg:block">
              <span className="text-[10px] text-muted font-bold font-mono uppercase tracking-wider">
                Management Modules
              </span>
            </div>

            {filterTabList.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.code}
                  onClick={() => {
                    setActiveTab(tab.code as AdminViewType);
                    setIsCreatingBlog(false);
                    setIsCreatingProduct(false);
                    setIsCreatingTestimonial(false);
                    setEditingServiceId(null);
                    setEditingBlogId(null);
                    setEditingProductId(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm flex items-center justify-between cursor-pointer ${
                    activeTab === tab.code
                      ? 'bg-primary text-white shadow-md'
                      : 'text-muted hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <TabIcon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column Core Workspaces */}
          <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-primary/10 shadow-sm min-h-[500px]">
            
            {/* WORKSPACE 1: CONTACT SUBMISSIONS TICKETS VIEW */}
            {activeTab === 'submissions' && (
              <div className="space-y-6">
                <div className="border-b border-primary/5 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-dark">Consultation & B2B Inquiries Feed</h2>
                    <p className="text-xs text-muted">Customer query lines retrieved dynamically from landing page forms.</p>
                  </div>
                  
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {contactSubmissions.length} Total Logs
                  </span>
                </div>

                {contactSubmissions.length === 0 ? (
                  <div className="text-center py-16 text-muted font-serif">
                    No submitted messages found. Fill out the contact form below to test!
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                    {contactSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className={`p-5 rounded-2xl border ${
                          sub.status === 'new'
                            ? 'bg-primary/5 border-primary/10'
                            : 'bg-white border-neutral-200 opacity-75'
                        } space-y-3`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div>
                            <span className="font-serif font-black text-dark text-base sm:text-lg block">
                              {sub.name}
                            </span>
                            <span className="text-xs text-muted block mt-0.5 font-mono">
                              Email: {sub.email} | Phone: {sub.phone || 'N/A'}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {sub.serviceInterest}
                            </span>
                            
                            {sub.status === 'new' ? (
                              <button
                                onClick={() => toggleSubmissionStatus(sub.id, 'contacted')}
                                className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer hover:bg-primary-hover flex items-center space-x-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Mark contacted</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-muted bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                                Contacted
                              </span>
                            )}

                            <button
                              onClick={() => deleteSubmission(sub.id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg border border-red-200/40 cursor-pointer"
                              aria-label="Delete submission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-primary/5 text-sm text-dark/90 leading-relaxed italic">
                          "{sub.message}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WORKSPACE 2: SCREENER ANALYTICS PANEL */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="border-b border-primary/5 pb-4">
                  <h2 className="text-xl font-serif font-bold text-dark">Screener Analytics</h2>
                  <p className="text-xs text-muted">Real-time assessment intelligence for clinical trends, severity signals, and product recommendation effectiveness.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="bg-bggray p-6 rounded-3xl border border-primary/10 space-y-4">
                    <span className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">Data Coverage</span>
                    <p className="text-4xl font-black text-dark">{assessmentResults.length}</p>
                    <p className="text-sm text-muted leading-relaxed">Total screener records collected across PHQ-9, GAD-7, and PSS-10.</p>
                  </div>

                  <div className="bg-bggray p-6 rounded-3xl border border-primary/10 space-y-4">
                    <span className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">Moderate+ risk</span>
                    <p className="text-4xl font-black text-dark">{getHighRiskCount()}</p>
                    <p className="text-sm text-muted leading-relaxed">High-risk assessments in the dataset ({getModeratePlusPercentage()}%).</p>
                  </div>

                  <div className="bg-bggray p-6 rounded-3xl border border-primary/10 space-y-4">
                    <span className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">Last 7 days</span>
                    <p className="text-4xl font-black text-dark">{getAssessmentsInWindow(7).length}</p>
                    <p className="text-sm text-muted leading-relaxed">Assessments submitted in the last 7 days.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl border border-primary/10 p-6 shadow-sm">
                    <h3 className="font-semibold text-dark text-lg mb-4">Average Scores by Test</h3>
                    <div className="space-y-4">
                      {(['PHQ-9', 'GAD-7', 'PSS-10'] as const).map((test) => (
                        <div key={test} className="space-y-1">
                          <div className="flex items-center justify-between text-sm text-muted">
                            <span>{test}</span>
                            <span className="font-semibold text-dark">{getAvgTestScore(test)}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.min(100, (getAvgTestScore(test) / (test === 'PSS-10' ? 40 : test === 'GAD-7' ? 21 : 27)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-primary/10 p-6 shadow-sm">
                    <h3 className="font-semibold text-dark text-lg mb-4">Severity Distribution</h3>
                    <div className="space-y-3">
                      {Object.entries(getAssessmentCounts()).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-[1fr_auto] gap-3 items-center">
                          <span className="text-xs font-semibold text-dark uppercase tracking-[0.12em]">{key.replace('_', ' ')}</span>
                          <span className="text-sm font-bold text-dark">{value}</span>
                          <div className="col-span-2 h-2 rounded-full bg-primary/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${assessmentResults.length ? (value / assessmentResults.length) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="bg-bggray p-6 rounded-3xl border border-primary/10 space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent font-mono">Top Clinical Insights</h3>
                    <ul className="space-y-2 text-sm text-dark/80">
                      <li>- Monitor severe cases closely and enable urgent outreach.</li>
                      <li>- Consider early counseling for moderate-risk assessments.</li>
                      <li>- Use score trends to optimize product recommendations over time.</li>
                    </ul>
                  </div>

                  <div className="bg-bggray p-6 rounded-3xl border border-primary/10 space-y-4 xl:col-span-2">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-accent font-mono">Recent High-Risk Assessments</h3>
                    <div className="space-y-3">
                      {getRecentHighRisk().length === 0 ? (
                        <p className="text-sm text-muted">No recent moderate or severe cases found.</p>
                      ) : (
                        getRecentHighRisk().map((result) => (
                          <div key={result.id} className="p-4 rounded-2xl bg-white border border-primary/10 flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-dark">{result.userName || result.id}</p>
                              <p className="text-xs text-muted">{result.testName} • {result.scores.bandLabel}</p>
                            </div>
                            <span className="text-xs font-bold text-primary">{new Date(result.submittedAt).toLocaleDateString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WORKSPACE 2: CLINICAL SCREENING TESTS METRICS PANEL */}
            {activeTab === 'assessments' && (
              <div className="space-y-8">
                <div className="border-b border-primary/5 pb-4">
                  <h2 className="text-xl font-serif font-bold text-dark">Psychometric Screener Metrics</h2>
                  <p className="text-xs text-muted">Aggregated analytics and submission logs from validated screening assessments.</p>
                </div>

                {/* Score Charts / Aggregations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div className="bg-bggray p-5 rounded-2xl border border-primary/5 text-center">
                    <span className="text-xs text-muted block font-mono">PHQ-9 (Depression)</span>
                    <span className="block text-3xl font-serif font-black text-dark mt-2">
                      {getAvgTestScore('PHQ-9') || '0.0'}
                    </span>
                    <p className="text-[10px] text-muted font-mono uppercase mt-1 leading-none">
                      Active average score
                    </p>
                  </div>

                  <div className="bg-bggray p-5 rounded-2xl border border-primary/5 text-center">
                    <span className="text-xs text-muted block font-mono">GAD-7 (Anxiety)</span>
                    <span className="block text-3xl font-serif font-black text-dark mt-2">
                      {getAvgTestScore('GAD-7') || '0.0'}
                    </span>
                    <p className="text-[10px] text-muted font-mono uppercase mt-1 leading-none">
                      Active average score
                    </p>
                  </div>

                  <div className="bg-bggray p-5 rounded-2xl border border-primary/5 text-center">
                    <span className="text-xs text-muted block font-mono">PSS-10 (Perceived Stress)</span>
                    <span className="block text-3xl font-serif font-black text-dark mt-2">
                      {getAvgTestScore('PSS-10') || '0.0'}
                    </span>
                    <p className="text-[10px] text-muted font-mono uppercase mt-1 leading-none">
                      Active average score
                    </p>
                  </div>

                </div>

                {/* Patient submissions catalog */}
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-dark text-base">Individual Screener Scorecard Logs</h3>
                  
                  {assessmentResults.length === 0 ? (
                    <div className="text-center py-10 text-muted italic font-serif">
                      No screener tests completed inside the current session yet. Find "Assessments" menu to take one!
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-primary/10">
                      <table className="w-full text-sm text-left border-collapse text-dark">
                        <thead className="bg-bggray text-xs text-muted uppercase font-mono border-b border-primary/15">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Taker / ID</th>
                            <th className="px-4 py-3 font-semibold">Test Item</th>
                            <th className="px-4 py-3 font-semibold">Score Sum</th>
                            <th className="px-4 py-3 font-semibold">Result Scale</th>
                            <th className="px-4 py-3 font-semibold">Submitted Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                          {assessmentResults.map(res => (
                            <tr key={res.id} className="hover:bg-primary/5 transition-colors">
                              <td className="px-4 py-3.5 font-bold">{res.userName || res.id}</td>
                              <td className="px-4 py-3.5">
                                <span className="bg-primary/10 text-xs px-2 py-0.5 rounded font-mono font-bold text-primary">
                                  {res.testName}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <strong className="text-dark/95 text-base">{res.scores.score}</strong> / {res.scores.maxScore}
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${res.scores.bandColor}`}>
                                  {res.scores.bandLabel}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-xs text-muted font-mono">
                                {new Date(res.submittedAt).toLocaleTimeString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WORKSPACE 3: SERVICES CMS MANAGER */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="border-b border-primary/5 pb-4">
                  <h2 className="text-xl font-serif font-bold text-dark">Digital Services CMS Manager</h2>
                  <p className="text-xs text-muted">Edit descriptions, CTAs, categories, and bullets of the 6 key service panels.</p>
                </div>

                <div className="space-y-6 max-h-[580px] overflow-y-auto pr-2">
                  {services.map(srv => {
                    const isEditing = editingServiceId === srv.id;
                    return (
                      <div key={srv.id} className="p-5 rounded-2xl border border-primary/10 bg-bggray/30 space-y-4">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-2 font-mono">Service Title</label>
                                <input
                                  type="text"
                                  value={serviceFormData.title || ''}
                                  onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                                  className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-2 font-mono">Category Code</label>
                                <input
                                  type="text"
                                  value={serviceFormData.category || ''}
                                  onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                                  className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-2 font-mono">Short Description</label>
                              <textarea
                                value={serviceFormData.shortDesc || ''}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, shortDesc: e.target.value })}
                                rows={2}
                                className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none resize-none"
                              />
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={handleSaveService}
                                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
                              >
                                <Check className="w-4 h-4" />
                                <span>Save Card</span>
                              </button>
                              <button
                                onClick={() => setEditingServiceId(null)}
                                className="bg-[#E8E8E4] hover:bg-neutral-200 text-dark px-4 py-2 rounded-lg text-xs font-bold transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-mono font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                                {srv.category}
                              </span>
                              <h3 className="font-serif font-bold text-lg text-dark mt-1.5">{srv.title}</h3>
                              <p className="text-sm text-muted mt-1 leading-normal max-w-xl">{srv.shortDesc}</p>
                            </div>

                            <button
                              onClick={() => handleEditServiceClick(srv)}
                              className="text-primary hover:bg-primary/10 border border-primary/20 p-2 rounded-xl flex items-center space-x-1 cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                              <span className="text-xs font-semibold">Edit Description</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WORKSPACE 4: BLOGS CMS MANAGER */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                <div className="border-b border-primary/5 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-dark">Resources & Blogs Publisher</h2>
                    <p className="text-xs text-muted">Create new medical blogs, modify text logs or delete existing entries.</p>
                  </div>

                  {!isCreatingBlog && !editingBlogId && (
                    <button
                      onClick={() => {
                        setIsCreatingBlog(true);
                        setEditingBlogId(null);
                        setBlogFormData({
                          title: '', category: 'Anxiety', excerpt: '', content: '', coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=500', author: 'Staff Caregiver', date: 'June 2026', readTime: '5 min read'
                        });
                      }}
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer flex items-center space-x-1 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write New Post</span>
                    </button>
                  )}
                </div>

                {isCreatingBlog || editingBlogId ? (
                  <div className="space-y-4 bg-bggray/50 p-6 rounded-2xl border border-primary/15">
                    <h3 className="font-serif font-bold text-dark text-base">
                      {isCreatingBlog ? 'Publishing a new mental health blog' : 'Editing educational blog post'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Blog Title</label>
                        <input
                          type="text"
                          value={blogFormData.title || ''}
                          onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Category Tag</label>
                        <select
                          value={blogFormData.category || 'Anxiety'}
                          onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        >
                          <option value="Anxiety">Anxiety</option>
                          <option value="Mindfulness">Mindfulness</option>
                          <option value="Anti-Stigma">Anti-Stigma</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Clinician Author</label>
                        <input
                          type="text"
                          value={blogFormData.author || ''}
                          onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Unsplash Image URL</label>
                        <input
                          type="text"
                          value={blogFormData.coverImage || ''}
                          onChange={(e) => setBlogFormData({ ...blogFormData, coverImage: e.target.value })}
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Short Excerpt Summary</label>
                      <input
                        type="text"
                        value={blogFormData.excerpt || ''}
                        onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                        className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none animate-pulse-once"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Blog Markdown/Text Content</label>
                      <textarea
                        value={blogFormData.content || ''}
                        onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                        rows={6}
                        placeholder="Double click to write custom guidelines..."
                        className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={handleSaveBlog}
                        className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Publish Post
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingBlog(false);
                          setEditingBlogId(null);
                        }}
                        className="bg-[#E8E8E4] hover:bg-neutral-200 text-dark px-5 py-2.5 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
                    {blogs.map(b => (
                      <div key={b.id} className="p-4 border border-primary/10 rounded-2xl flex items-center justify-between gap-4 bg-bggray/20">
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={b.coverImage}
                            alt={b.title}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-lg object-cover border border-primary/10 bg-neutral-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded uppercase">{b.category}</span>
                            <h4 className="font-serif font-bold text-dark text-sm sm:text-base mt-1.5 truncate max-w-sm sm:max-w-md">{b.title}</h4>
                            <p className="text-xs text-muted font-mono mt-0.5">Author: {b.author} | {b.readTime}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            onClick={() => handleEditBlogClick(b)}
                            className="p-2 border rounded-xl hover:bg-primary/5 text-primary border-primary/25 cursor-pointer"
                            aria-label="Edit blog"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(b.id)}
                            className="p-2 border rounded-xl hover:bg-red-50 text-red-500 border-red-200/50 cursor-pointer"
                            aria-label="Delete blog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WORKSPACE 5: WELL-MART CMS MANAGER */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="border-b border-primary/5 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-dark">Therapeutic Products Catalog CMS</h2>
                    <p className="text-xs text-muted">Add new sensory toys, stress balls, essential oils, and update prices in NPR.</p>
                  </div>

                  {!isCreatingProduct && !editingProductId && (
                    <button
                      onClick={() => {
                        setIsCreatingProduct(true);
                        setEditingProductId(null);
                        setProductFormData({
                          name: '', description: '', price: 1000, imageUrl: 'https://images.unsplash.com/photo-1611079830570-cc390901f600?auto=format&fit=crop&q=80&w=400', isComingSoon: false, category: 'Sensory Relief'
                        });
                      }}
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Release Product</span>
                    </button>
                  )}
                </div>

                {isCreatingProduct || editingProductId ? (
                  <div className="space-y-4 bg-bggray/50 p-6 rounded-2xl border border-primary/15">
                    <h3 className="font-serif font-bold text-dark text-base">
                      {isCreatingProduct ? 'Releasing a new Well-Mart therapeutic' : 'Modifying product properties'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Product Title</label>
                        <input
                          type="text"
                          value={productFormData.name || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Category Code</label>
                        <input
                          type="text"
                          value={productFormData.category || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Price (NPR) *</label>
                        <input
                          type="number"
                          value={productFormData.price || 0}
                          onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Marketplace Cover photo (Unsplash)</label>
                        <input
                          type="text"
                          value={productFormData.imageUrl || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Detail Description</label>
                      <textarea
                        value={productFormData.description || ''}
                        onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                        rows={2}
                        className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={handleSaveProduct}
                        className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Release Now
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingProduct(false);
                          setEditingProductId(null);
                        }}
                        className="bg-[#E8E8E4] hover:bg-neutral-200 text-dark px-5 py-2.5 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
                    {products.map(p => (
                      <div key={p.id} className="p-4 border border-primary/10 rounded-2xl flex items-center justify-between gap-4 bg-bggray/20">
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-lg object-cover border border-primary/10 bg-neutral-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{p.category}</span>
                            <h4 className="font-serif font-bold text-dark text-sm sm:text-base mt-1.5 truncate max-w-sm sm:max-w-md">{p.name}</h4>
                            <p className="text-xs text-muted font-mono mt-0.5">Price: NPR {p.price}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-2 border rounded-xl hover:bg-primary/5 text-primary border-primary/25 cursor-pointer"
                            aria-label="Edit product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 border rounded-xl hover:bg-red-50 text-red-500 border-red-200/50 cursor-pointer"
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WORKSPACE 6: TESTIMONIALS CMS MANAGER */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="border-b border-primary/5 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-dark">Healing Stories Publisher Desk</h2>
                    <p className="text-xs text-muted">Manage patient testimonials, support scores, anonymous credentials, and quotes.</p>
                  </div>

                  {!isCreatingTestimonial && (
                    <button
                      onClick={() => setIsCreatingTestimonial(true)}
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post Story</span>
                    </button>
                  )}
                </div>

                {isCreatingTestimonial ? (
                  <div className="space-y-4 bg-bggray/50 p-6 rounded-2xl border border-primary/15">
                    <h3 className="font-serif font-bold text-dark text-base">Write new review quote</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Patient initials / name</label>
                        <input
                          type="text"
                          value={testimonialFormData.name || ''}
                          onChange={(e) => setTestimonialFormData({ ...testimonialFormData, name: e.target.value })}
                          placeholder="e.g. Aadesh S."
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Location Context</label>
                        <input
                          type="text"
                          value={testimonialFormData.location || ''}
                          onChange={(e) => setTestimonialFormData({ ...testimonialFormData, location: e.target.value })}
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Profession / Biography</label>
                        <input
                          type="text"
                          value={testimonialFormData.profession || ''}
                          onChange={(e) => setTestimonialFormData({ ...testimonialFormData, profession: e.target.value })}
                          placeholder="e.g. Customer, HR Leader"
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Rating Stars (1-5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={testimonialFormData.rating || 5}
                          onChange={(e) => setTestimonialFormData({ ...testimonialFormData, rating: Number(e.target.value) })}
                          className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-1 font-mono">Review Quote Content *</label>
                      <textarea
                        value={testimonialFormData.quote || ''}
                        onChange={(e) => setTestimonialFormData({ ...testimonialFormData, quote: e.target.value })}
                        rows={3}
                        className="w-full bg-white text-dark px-3 py-2 rounded-xl text-sm border focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={handleCreateTestimonial}
                        className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Publish Testimonial
                      </button>
                      <button
                        onClick={() => setIsCreatingTestimonial(false)}
                        className="bg-[#E8E8E4] hover:bg-neutral-200 text-dark px-5 py-2.5 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
                    {testimonials.map(t => (
                      <div key={t.id} className="p-4 border border-primary/10 rounded-2xl flex items-center justify-between gap-4 bg-bggray/20">
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={t.avatarUrl}
                            alt={t.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover border border-primary/10 shrink-0"
                          />
                          <div className="min-w-0 leading-tight">
                            <h4 className="font-serif font-bold text-dark text-base truncate">{t.name}</h4>
                            <p className="text-xs text-muted font-mono">{t.profession} | {t.location}</p>
                            <p className="text-xs text-dark/85 italic mt-1 line-clamp-1">"{t.quote}"</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="p-2 border rounded-xl hover:bg-red-50 text-red-500 border-red-200/50 cursor-pointer shrink-0"
                          aria-label="Delete testimonial"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
