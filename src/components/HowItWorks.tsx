import React from 'react';
import { BookOpen, ClipboardList, Gauge, Workflow, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Educate',
      action: 'E¹',
      icon: BookOpen,
      desc: 'Conducting community campaigns, hosting free interactive online sessions, and dispersing accredited programs across schools and businesses.',
      color: 'border-l-primary',
      bg: 'hover:bg-primary/5'
    },
    {
      num: '02',
      title: 'Evaluate',
      action: 'E²',
      icon: ClipboardList,
      desc: 'Supplying rapid, scientifically validated psychometric screening tools alongside localized, physical mental state check-ins.',
      color: 'border-l-accent',
      bg: 'hover:bg-accent/5'
    },
    {
      num: '03',
      title: 'Assess',
      action: 'A¹',
      icon: Gauge,
      desc: 'Leveraging smart localized matching to pair individual profiles, cultural languages, and counseling goals with proper fit therapists.',
      color: 'border-l-primary',
      bg: 'hover:bg-primary/5'
    },
    {
      num: '04',
      title: 'Allocate',
      action: 'A²',
      icon: Workflow,
      desc: 'Expediting immediate routing to certified nearby professionals, customized therapeutic packages, or specialized home health systems.',
      color: 'border-l-accent',
      bg: 'hover:bg-accent/5'
    }
  ];

  return (
    <section id="how-it-works-section" className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Our Care Architecture
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            Our E² + A² Blueprint
          </h2>
          <p className="mt-4 text-base text-muted">
            Designed specifically to override structural deficits in Nepal’s mental health network. We don’t just offer therapy; we manage the entire care lifecycle.
          </p>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Horizontal dotted connector for desktop */}
          <div id="desktop-connecting-dots" className="hidden lg:block absolute top-[64px] left-[5%] right-[5%] h-[2px] border-t-2 border-dashed border-primary/20 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={step.num}
                  id={`how-it-works-step-${step.num}`}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className={`bg-bggray p-6 sm:p-8 rounded-2xl border-l-4 ${step.color} border-y border-r border-primary/10 shadow-sm transition-all duration-300 ${step.bg} hover:shadow-md group flex flex-col justify-between`}
                >
                  <div>
                    {/* Top indicator & Icons */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary group-hover:text-accent shadow-sm transition-colors">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xs font-bold text-muted bg-white px-2.5 py-1 rounded-full border border-primary/10">
                        {step.action} Pillar
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-xl font-serif font-bold text-dark mb-3 flex items-center">
                      <span className="text-accent/80 text-sm font-mono mr-2">{step.num}.</span>
                      {step.title}
                    </h3>

                    {/* Step description */}
                    <p className="text-sm text-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Flow footer indicator */}
                  <div className="mt-6 pt-4 border-t border-primary/5 flex items-center justify-between text-xs text-primary font-bold">
                    <span>Active Lifecycle Step</span>
                    {idx < 3 ? (
                      <ChevronRight className="w-4 h-4 text-primary/40 group-hover:text-accent transition-colors" />
                    ) : (
                      <span className="text-[10px] text-accent font-semibold tracking-wider font-mono uppercase bg-accent/10 px-2 py-0.5 rounded">
                        Target Met
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
