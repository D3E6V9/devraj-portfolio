import React from 'react';
import {
  MessageSquare,
  Heart,
  Book,
  ShoppingBag,
  Building,
  Home,
  Check,
  Video,
  ArrowRight
} from 'lucide-react';
import { ServiceItem } from '../types';
import { motion } from 'motion/react';

// Help map text icon names to component elements
export function getServiceIcon(iconName: string) {
  switch (iconName) {
    case 'MessageSquareIcon':
      return <MessageSquare className="w-6 h-6 text-accent" />;
    case 'HeartIcon':
      return <Heart className="w-6 h-6 text-accent" />;
    case 'BookIcon':
      return <Book className="w-6 h-6 text-accent" />;
    case 'ShoppingBagIcon':
      return <ShoppingBag className="w-6 h-6 text-accent" />;
    case 'BuildingIcon':
      return <Building className="w-6 h-6 text-accent" />;
    case 'HomeIcon':
      return <Home className="w-6 h-6 text-accent" />;
    default:
      return <Heart className="w-6 h-6 text-accent" />;
  }
}

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (servicePath: string) => void;
}

export default function ServicesSection({ services, onSelectService }: ServicesSectionProps) {
  return (
    <section id="services-section" className="py-20 sm:py-28 bg-[#FCFCF9] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Our Offerings
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            Everything You Need for Mental Wellbeing
          </h2>
          <p className="mt-4 text-base text-muted">
            One platform. All the support we can assemble. Discover which core pillars of Nepa Health match your current path.
          </p>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        {/* 3-Column Services Grid */}
        <div id="services-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            return (
              <motion.div
                key={service.id}
                id={`services-card-${service.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-primary/5 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group"
              >
                <div>
                  {/* Icon & Category Category */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <span className="text-xs font-semibold text-primary font-mono bg-primary/5 px-2.5 py-1 rounded-full">
                      {service.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>

                  {/* Points / Bullets */}
                  <ul className="space-y-2.5 mb-8">
                    {service.points.map((point, indexVal) => (
                      <li key={indexVal} className="flex items-start text-xs text-dark/90 leading-normal">
                        <Check className="w-4 h-4 text-primary shrink-0 mr-2" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card footer CTA */}
                <button
                  onClick={() => {
                    // Navigate to appropriate sections
                    if (service.title.includes('Counseling')) {
                      onSelectService('assessments');
                    } else if (service.title.includes('Tools')) {
                      onSelectService('assessments');
                    } else if (service.title.includes('Mart')) {
                      onSelectService('well-mart');
                    } else if (service.title.includes('Resources')) {
                      onSelectService('blog');
                    } else {
                      // fallback scroll to contact
                      const ctc = document.getElementById('contact-section');
                      if (ctc) ctc.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full text-center py-3 bg-bggray hover:bg-primary hover:text-white cursor-pointer rounded-xl font-semibold text-sm text-dark transition-all duration-300 flex items-center justify-center space-x-1 border border-primary/5 group-hover:border-primary/20"
                >
                  <span>{service.ctaText || 'Get Started'}</span>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
