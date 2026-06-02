import React from 'react';
import {
  Smile,
  Shield,
  Palette,
  Leaf,
  Eye,
  Lightbulb,
  Trophy,
  GraduationCap,
  CheckCircle2
} from 'lucide-react';
import { ValueItem } from '../types';
import { motion } from 'motion/react';

// Maps dynamic iconName values to real component layers
function getValueIcon(iconName: string) {
  switch (iconName) {
    case 'SmileIcon':
      return <Smile className="w-5 h-5 text-accent" />;
    case 'ShieldIcon':
      return <Shield className="w-5 h-5 text-accent" />;
    case 'PaletteIcon':
      return <Palette className="w-5 h-5 text-accent" />;
    case 'LeafIcon':
      return <Leaf className="w-5 h-5 text-accent" />;
    case 'EyeIcon':
      return <Eye className="w-5 h-5 text-accent" />;
    case 'LightbulbIcon':
      return <Lightbulb className="w-5 h-5 text-accent" />;
    case 'TrophyIcon':
      return <Trophy className="w-5 h-5 text-accent" />;
    case 'GraduationCapIcon':
      return <GraduationCap className="w-5 h-5 text-accent" />;
    case 'CheckCircleIcon':
      return <CheckCircle2 className="w-5 h-5 text-accent" />;
    default:
      return <Smile className="w-5 h-5 text-accent" />;
  }
}

interface ValuesProps {
  values: ValueItem[];
}

export default function Values({ values }: ValuesProps) {
  return (
    <section id="values-section" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header bar */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Our Core Ethics
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            What We Stand For
          </h2>
          <p className="mt-4 text-base text-muted">
            The values guiding our operations, caregiver allocations, and software metrics every day at Nepa Health.
          </p>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        {/* 9 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {values.map((val, index) => {
            // Alternating backgrounds: even is white with border, odd is light cream/beige
            const isCream = index % 2 !== 0;
            return (
              <motion.div
                key={val.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-md border ${
                  isCream
                    ? 'bg-secondary/40 border-primary/5 hover:border-primary/15'
                    : 'bg-white border-primary/10 hover:border-primary/20 shadow-sm'
                } flex flex-col items-start`}
              >
                {/* Icon Container */}
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-primary/10 mb-5">
                  {getValueIcon(val.iconName)}
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-dark text-lg mb-2">
                  {val.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
