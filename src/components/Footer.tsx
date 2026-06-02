import React, { useState } from 'react';
import { Leaf, Send, HelpCircle, AlertCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [emailText, setEmailText] = useState('');
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText) return;
    setNewsletterSubbed(true);
    setEmailText('');
    setTimeout(() => setNewsletterSubbed(false), 5000);
  };

  return (
    <footer id="global-footer" className="bg-dark text-[#CBD5D5] py-16 sm:py-20 border-t border-primary/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Top Segment: Logo, Links Columns, and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Tagline & Logo Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 fill-white/10" />
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                Nepa <span className="text-primary">Health</span>
              </span>
            </div>
            
            <p className="text-sm text-muted/95 leading-relaxed max-w-sm">
              Your Journey to Mental Wellbeing Starts Here. Educate, Evaluate, Assess, and Allocate. Breaking clinical silos and stigmas across all districts of Nepal.
            </p>

          </div>

          {/* Links Column 1: Services */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-serif font-bold text-base">Our Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('assessments')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Self-Assessments
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      const el = document.getElementById('services-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer text-left"
                >
                  Mental Counseling
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('well-mart')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Well-Mart Shop
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-primary transition-colors cursor-pointer text-left">
                  Himalayan Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Company */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-serif font-bold text-base">Organization</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      const el = document.getElementById('how-it-works-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer text-left"
                >
                  E² + A² Blueprint
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      const el = document.getElementById('values-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer text-left"
                >
                  Core Principles
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      const el = document.getElementById('impact-stats-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer text-left"
                >
                  Vision 2033 Goals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-primary font-bold text-accent transition-colors cursor-pointer text-left">
                  Admin Console
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Newsletter Signup */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white font-serif font-bold text-base">Care Updates</h4>
            <p className="text-xs text-muted/90 max-w-sm leading-relaxed">
              Subscribe to get seasonal mindfulness booklets, Himalayan breathing exercises and notifications on Well-Mart bundle releases.
            </p>
            
            {newsletterSubbed ? (
              <div className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 px-4 py-3 rounded-xl text-xs font-semibold">
                Success Namaste! You have subscribed safely.
              </div>
            ) : (
              <form onSubmit={handleSub} className="flex space-x-2">
                <input
                  type="email"
                  required
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder="name@gmail.com"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary flex-1 min-w-0"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover max-h-[40px] text-white p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  aria-label="Subscribe to newsletter updates"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            <span className="block text-[10px] text-[#A6B6B6] font-mono leading-none">
              Zero noise. No spam. Unsubscribe anytime.
            </span>
          </div>

        </div>

        {/* Bottom Segment: copyright & legal navigation links */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between text-xs text-muted space-y-4 md:space-y-0 text-center md:text-left">
          
          <p>© 2026 Nepa Health. All rights reserved. Nepal’s Premium Mental Wellbeing startups entry point.</p>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-6">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookie Configurations</a>
            <a href="#nmc" className="hover:text-white transition-colors flex items-center">
              <HelpCircle className="w-3.5 h-3.5 mr-1" />
              NMC Disclosures
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}
