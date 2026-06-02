import React, { useState } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { TestimonialItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if(!testimonials || testimonials.length === 0) return null;

  const current = testimonials[activeIndex];

  return (
    <section id="testimonials-section" className="py-20 sm:py-28 bg-secondary/35 relative overflow-hidden">
      {/* Background quotation mark */}
      <div className="absolute top-10 left-10 text-primary/5 select-none pointer-events-none">
        <Quote className="w-64 h-64 fill-primary/5" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Words of Recovery
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            Stories of Healing
          </h2>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        {/* Interactive Carousel Frame */}
        <div className="relative bg-white rounded-3xl border border-primary/10 p-6 sm:p-10 md:p-14 shadow-xl">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Star rating */}
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < current.rating ? 'text-accent fill-accent' : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-lg sm:text-xl font-serif italic text-dark leading-relaxed">
                "{current.quote}"
              </p>

              {/* User Bio Line with Avatar */}
              <div className="flex items-center space-x-4 pt-6 border-t border-primary/5">
                <img
                  src={current.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                  alt={current.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-dark text-base">{current.name}</h4>
                  <p className="text-xs text-muted">
                    {current.profession} • <span className="font-mono text-primary">{current.location}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Buttons */}
          <div className="absolute right-6 sm:right-10 bottom-6 sm:bottom-10 flex space-x-2">
            <button
              onClick={handlePrev}
              className="p-2 sm:p-3 rounded-xl bg-bggray hover:bg-primary hover:text-white cursor-pointer transition-colors border border-primary/10 text-dark/75"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 sm:p-3 rounded-xl bg-bggray hover:bg-primary hover:text-white cursor-pointer transition-colors border border-primary/10 text-dark/75"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Trust disclaimer */}
        <div className="text-center mt-10">
          <p className="text-[11px] font-mono text-muted uppercase tracking-wider">
            All names and avatars in the stories of healing are anonymized or modified with full user consent to protect privacy.
          </p>
        </div>

      </div>
    </section>
  );
}
