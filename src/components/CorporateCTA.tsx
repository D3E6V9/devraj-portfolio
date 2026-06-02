import React from 'react';
import { Building, GraduationCap, FileText, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CorporateCTAProps {
  onQuoteRequested: (interest: string) => void;
}

export default function CorporateCTA({ onQuoteRequested }: CorporateCTAProps) {
  return (
    <section
      id="corporate-cta-section"
      className="py-20 sm:py-24 bg-gradient-to-r from-[#3D7A5F] to-[#1C3A2D] text-white overflow-hidden relative"
    >
      {/* Absolute design overlays */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center sm:text-left">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs sm:text-sm font-bold font-mono text-secondary uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full w-fit block mx-auto sm:mx-0">
              B2B & Academic Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-white leading-tight">
              Is Your Organization Ready to Prioritize Mental Health?
            </h2>
            <p className="text-secondary/80 text-base sm:text-lg max-w-2xl leading-relaxed">
              Equip your staff or students with 100% confidential professional therapy, proactive evaluations, and resilience training. Work with the first mover in Nepal's institutional mental wellness ecosystem.
            </p>

            {/* Side-by-Side Cards/Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              
              <div 
                onClick={() => onQuoteRequested('Corporate Wellness Programs')}
                className="bg-white/10 hover:bg-white/15 border border-white/10 p-5 rounded-2xl transition-all duration-200 cursor-pointer text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-secondary mb-3 group-hover:scale-105 transition-transform">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-semibold text-white text-base flex items-center justify-between">
                  <span>Corporate Wellness</span>
                  <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h4>
                <p className="text-xs text-secondary/75 mt-1">
                  EAPs, diagnostic dashboards, and executive retreats.
                </p>
              </div>

              <div 
                onClick={() => onQuoteRequested('Student Intervention Programs')}
                className="bg-white/10 hover:bg-white/15 border border-white/10 p-5 rounded-2xl transition-all duration-200 cursor-pointer text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-secondary mb-3 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-semibold text-white text-base flex items-center justify-between">
                  <span>Student Interventions</span>
                  <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h4>
                <p className="text-xs text-secondary/75 mt-1">
                  Accredited high school seminars and crisis caregiver allocations.
                </p>
              </div>

            </div>

            {/* Secondary Stats Footer */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-3 sm:space-y-0 pt-4 font-mono text-xs text-secondary/70">
              <div>
                <strong className="text-white text-sm font-sans">319,900+</strong> Companies Registered in Nepal
              </div>
              <div className="hidden sm:block text-white/20">|</div>
              <div>
                <strong className="text-white text-sm font-sans">1,467+</strong> Colleges Requiring Support Solutions
              </div>
            </div>

          </div>

          {/* Call to Action Quote Button Panel */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="bg-white text-dark p-8 rounded-3xl shadow-2xl relative border border-primary/10 max-w-sm w-full text-center">
              <span className="text-[10px] font-bold text-primary font-mono block uppercase tracking-widest mb-1">
                Direct Inquiry
              </span>
              <h3 className="font-serif font-bold text-2xl mb-4 text-dark">
                Request custom consultation
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Receive customized cost estimates, schedules, and structural guides for your physical and online programs.
              </p>
              
              <button
                onClick={() => onQuoteRequested('Institutional General Inquiry')}
                className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-2xl font-bold text-base transition-transform duration-200 shadow-lg cursor-pointer hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>Get a Cost Quote</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
