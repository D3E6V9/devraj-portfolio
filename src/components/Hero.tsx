import React from 'react';
import { ArrowRight, Sparkles, Smile, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onNavigate: (path: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <div id="hero-section" className="relative min-h-screen pt-24 sm:pt-28 flex items-center overflow-hidden bg-[#FAFAF7]">
      {/* Decorative Custom Animated Blobs */}
      <div className="absolute top-20 right-[-100px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-blob pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10 animate-blob-delayed pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full w-fit mb-6 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest">
                Mental Health Initiative
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-[64px] font-serif leading-[1.1] font-bold text-dark -tracking-tight"
            >
              Mental Wellbeing, <br />
              <span className="text-primary italic font-normal">Made Accessible</span> <br className="hidden sm:inline" />
              for Every Nepali.
            </motion.h1>

            {/* Subheadline detailing the 0.06 stat constraint */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 text-xl text-muted leading-relaxed max-w-xl"
            >
              Nepal has only <strong className="text-dark bg-accent/10 px-1 font-semibold rounded">0.06 psychiatrists per 100,000 people</strong>. 
              We are changing that—one life at a time. Explore our holistic care system from online virtual counseling to certified therapeutics.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <button
                onClick={() => {
                  const el = document.getElementById('services-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('assessments')}
                className="px-8 py-4 bg-white text-primary border border-primary/20 rounded-2xl font-bold hover:bg-bggray transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Take Online Self-Test</span>
              </button>
            </motion.div>

            {/* Floating Stat Cards below text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="bg-white/80 p-4 rounded-xl border border-primary/10 shadow-sm backdrop-blur-sm hover:border-primary/25 transition-colors">
                <span className="block text-2xl font-serif font-bold text-accent">0.06</span>
                <span className="text-xs text-muted leading-tight block mt-1">Psychiatrists per 100K citizens in Nepal</span>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-primary/10 shadow-sm backdrop-blur-sm hover:border-primary/25 transition-colors">
                <span className="block text-2xl font-serif font-bold text-primary">E² + A²</span>
                <span className="text-xs text-muted leading-tight block mt-1">Four holistic clinical and support pillars</span>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-primary/10 shadow-sm backdrop-blur-sm hover:border-primary/25 transition-colors">
                <span className="block text-2xl font-serif font-bold text-dark">First Mover</span>
                <span className="text-xs text-muted leading-tight block mt-1">Dedicated mental wellness marketplace and care system</span>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Column - Beautiful Image Overlay */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative w-full max-w-[400px] lg:max-w-none aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"
            >
              {/* Stunning Unsplash placeholder for Nepali mental wellness/nature aspect */}
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=620"
                alt="Mindfulness yoga meditation in nature visual representative of Himalayan calm"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
              
              {/* Overlay Badge for support availability */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-primary/10 flex items-center space-x-3">
                <div id="badge-heart-pulse" className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Smile className="w-5 h-5 fill-accent/10" />
                </div>
                <div>
                  <span className="text-xs text-muted block">Direct Counseling Services</span>
                  <p className="text-sm font-bold text-dark leading-tight">Safe, Certified, 100% Confidential</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
