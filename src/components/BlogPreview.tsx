import React, { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, X, ChevronRight } from 'lucide-react';
import { BlogPost } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BlogPreviewProps {
  blogs: BlogPost[];
  // If we are on the main blog route, we render a full category layout!
  isFullRoute?: boolean;
}

export default function BlogPreview({ blogs, isFullRoute = false }: BlogPreviewProps) {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Filter lists based on categories
  const categories = ['All', 'Anxiety', 'Mindfulness', 'Anti-Stigma'];
  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(b => b.category === activeCategory);

  // We show only the first 3 if it’s a preview on the home screen
  const displayBlogs = isFullRoute ? filteredBlogs : blogs.slice(0, 3);

  return (
    <section id="blogs-section" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Clinical Insights & Wellness
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            Learn, Grow, Heal
          </h2>
          <p className="mt-4 text-base text-muted">
            Explore articles and publications about emotional wellbeing, psychiatric science, and cultural stigmas compiled by our caregiver board.
          </p>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        {/* Category Toggles if Full page view */}
        {isFullRoute && (
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-bggray text-muted hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid Lists */}
        {displayBlogs.length === 0 ? (
          <div className="text-center py-12 text-muted">
            No articles found in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayBlogs.map((blog, idx) => (
              <motion.article
                key={blog.id}
                id={`blog-post-card-${blog.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-bggray rounded-2xl overflow-hidden border border-primary/5 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-200 mb-4">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm font-mono border border-primary/5">
                      {blog.category}
                    </span>
                  </div>

                  {/* Date & Read Time */}
                  <div className="flex items-center space-x-4 text-xs text-muted mb-3 font-mono">
                    <span className="flex items-center text-primary/70">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {blog.date}
                    </span>
                    <span className="flex items-center text-primary/70">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {blog.readTime}
                    </span>
                  </div>

                  {/* Blog Title */}
                  <h3 className="font-serif font-bold text-dark text-lg sm:text-xl leading-snug group-hover:text-primary transition-colors mb-2.5 line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3 mb-6">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Card CTA Footer */}
                <div className="pt-4 border-t border-primary/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-dark/70 flex items-center">
                    <User className="w-3.5 h-3.5 text-accent mr-1.5" />
                    By: {blog.author}
                  </span>
                  
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="text-xs font-semibold text-primary group-hover:text-accent transition-colors flex items-center cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>

      {/* Full-Page Article Reader Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlog(null)}
              className="fixed inset-0 bg-dark z-50 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="fixed inset-y-4 inset-x-4 sm:inset-6 md:inset-12 lg:inset-x-24 lg:inset-y-8 bg-bggray z-50 rounded-3xl shadow-2xl overflow-y-auto border border-primary/10 flex flex-col"
            >
              {/* Sticky Top Header bar inside Modal */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 sm:px-10 py-5 border-b border-primary/10 flex items-center justify-between z-10">
                <div className="flex items-center space-x-2 text-xs font-semibold text-primary uppercase font-mono">
                  <span>Reading:</span>
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-primary">{selectedBlog.category}</span>
                </div>
                
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="p-2 justify-center bg-bggray hover:bg-neutral-200 text-dark rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body content */}
              <div className="p-6 sm:p-10 md:p-16 max-w-4xl mx-auto space-y-8 bg-white flex-1 w-full">
                {/* Meta details */}
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold text-dark leading-tight">
                    {selectedBlog.title}
                  </h1>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-muted font-mono pt-2 border-b border-primary/5 pb-4">
                    <span className="flex items-center text-primary font-semibold">
                      <User className="w-4 h-4 mr-1 text-accent" />
                      Written by {selectedBlog.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {selectedBlog.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {selectedBlog.readTime}
                    </span>
                  </div>
                </div>

                {/* Big Banner cover Image */}
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-100 border border-primary/10">
                  <img
                    src={selectedBlog.coverImage}
                    alt={selectedBlog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Document Body Markdown Simulation */}
                <div 
                  className="text-base text-dark/95 leading-relaxed space-y-6 font-sans whitespace-pre-line"
                >
                  {selectedBlog.content}
                </div>

                {/* Footnotes */}
                <div className="pt-8 border-t border-primary/10 bg-primary/5 p-6 rounded-2xl mt-12">
                  <h4 className="font-serif font-bold text-dark text-base mb-2">Medical Disclaimer</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Nepa Health blog coordinates educational wellness guidelines. The articles are compiled by clinical board affiliates. If you are facing severe, immediate, or worsening psychiatric distress or clinical symptoms, please utilize our Screening tests or arrange a formal video session with localized medical providers promptly.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
