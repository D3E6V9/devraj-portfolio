import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Quote } from 'lucide-react';

export default function ImpactStats() {
  const compRef = useRef(null);
  const isVisible = useInView(compRef, { once: true, amount: 0.2 });

  const [gapReduction, setGapReduction] = useState(0.0);
  const [reduceProblemsVal, setReduceProblemsVal] = useState(0);
  const [corporationsQty, setCorporationsQty] = useState(0);
  const [individualsCcount, setIndividualsCcount] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Progression counters
      let s1 = 0.0;
      const t1 = setInterval(() => {
        s1 += 4.5;
        if (s1 >= 96.77) {
          setGapReduction(96.77);
          clearInterval(t1);
        } else {
          setGapReduction(parseFloat(s1.toFixed(2)));
        }
      }, 50);

      let s2 = 0;
      const t2 = setInterval(() => {
        s2 += 1;
        if (s2 >= 5) {
          setReduceProblemsVal(5);
          clearInterval(t2);
        } else {
          setReduceProblemsVal(s2);
        }
      }, 150);

      let s3 = 0;
      const t3 = setInterval(() => {
        s3 += 600;
        if (s3 >= 16000) {
          setCorporationsQty(16000);
          clearInterval(t3);
        } else {
          setCorporationsQty(s3);
        }
      }, 40);

      let s4 = 0;
      const t4 = setInterval(() => {
        s4 += 15000;
        if (s4 >= 419500) {
          setIndividualsCcount(419500);
          clearInterval(t4);
        } else {
          setIndividualsCcount(s4);
        }
      }, 45);

      return () => {
        clearInterval(t1);
        clearInterval(t2);
        clearInterval(t3);
        clearInterval(t4);
      };
    }
  }, [isVisible]);

  return (
    <section
      id="impact-stats-section"
      ref={compRef}
      className="py-24 sm:py-32 bg-primary text-white relative overflow-hidden"
    >
      {/* Visual embellishments */}
      <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Section title */}
        <div className="max-w-3xl mx-auto mb-16">
          <span className="text-secondary/85 text-xs sm:text-sm font-bold font-mono uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
            Our Goals
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-black text-white tracking-tight">
            Our Vision for Nepal by 2033
          </h2>
          <p className="mt-4 text-secondary/80 text-sm sm:text-base leading-relaxed">
            By scaling operations, investing in remote tele-psychiatry, and training student counselors, Nepa Health aims to set absolute milestones over the next decade.
          </p>
          <div className="w-12 h-1 bg-accent/60 mx-auto mt-4 rounded-full" />
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-20 text-center">
          
          <div className="p-4">
            <span className="block text-4xl sm:text-5xl font-black text-secondary tracking-tight font-serif">
              -{gapReduction}%
            </span>
            <span className="block text-sm font-medium text-white/90 uppercase tracking-widest font-mono mt-3">
              Care Gap Reduction
            </span>
            <span className="block text-xs text-white/70 mt-1">
              Expanding access channels
            </span>
          </div>

          <div className="p-4">
            <span className="block text-4xl sm:text-5xl font-black text-secondary tracking-tight font-serif">
              -{reduceProblemsVal}%
            </span>
            <span className="block text-sm font-medium text-white/90 uppercase tracking-widest font-mono mt-3">
              Overall Symptoms Drop
            </span>
            <span className="block text-xs text-white/70 mt-1">
              Through early discovery
            </span>
          </div>

          <div className="p-4">
            <span className="block text-4xl sm:text-5xl font-black text-secondary tracking-tight font-serif">
              {corporationsQty.toLocaleString()}+
            </span>
            <span className="block text-sm font-medium text-white/90 uppercase tracking-widest font-mono mt-3">
              Corporations Served
            </span>
            <span className="block text-xs text-white/70 mt-1">
              Building healthy workplaces
            </span>
          </div>

          <div className="p-4">
            <span className="block text-4xl sm:text-5xl font-black text-secondary tracking-tight font-serif">
              {individualsCcount.toLocaleString()}+
            </span>
            <span className="block text-sm font-medium text-white/90 uppercase tracking-widest font-mono mt-3">
              Individuals Reached
            </span>
            <span className="block text-xs text-white/70 mt-1">
              In Kathmandu Valley alone
            </span>
          </div>

        </div>

        {/* Mission Statement large italic Playfair Quote */}
        <div className="max-w-4xl mx-auto border-t border-white/10 pt-16 relative">
          <Quote className="w-12 h-12 text-secondary/15 absolute left-1/2 -top-6 -translate-x-1/2 fill-secondary/5 rotate-180" />
          <p className="text-xl sm:text-2xl font-serif italic text-secondary leading-relaxed font-light">
            "To bridge the mental healthcare divide in Nepal through Educating our neighborhoods, Evaluating clinical scores, Assessing matching frameworks scientifically, and Allocating treatment paths timely."
          </p>
          <span className="block font-sans font-bold text-xs uppercase tracking-wider text-accent mt-6 font-mono">
            Nepa Health Global Care Manifesto
          </span>
        </div>

      </div>
    </section>
  );
}
