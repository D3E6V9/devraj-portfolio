import React from 'react';
import { Brain, FileCheck, MapPin, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhoWeServe() {
  const personas = [
    {
      id: 'p-1',
      name: 'Individuals with Undiagnosed Concerns',
      desc: 'People feeling unusual exhaustion, persistent anxiety, or mild changes in mood who are looking for clear guidance.',
      icon: Brain
    },
    {
      id: 'p-2',
      name: 'Those with a Formal Diagnosis Needing Support',
      desc: 'Patients holding medically documented diagnoses who seek persistent care, prescription audits, or routine therapy chats.',
      icon: FileCheck
    },
    {
      id: 'p-3',
      name: 'Underserved Communities Far from Core Care',
      desc: 'Individuals residing outside city clusters who struggle to meet qualified psychiatrists in physical proximity.',
      icon: MapPin
    },
    {
      id: 'p-4',
      name: 'Busy Professionals Needing Flexible Care Slots',
      desc: 'Active workers who require secure, encrypted counseling options on late nights or custom schedules.',
      icon: Briefcase
    },
    {
      id: 'p-5',
      name: 'Students Under Academic & Social Pressure',
      desc: 'Young learners attempting to manage stress from examinations, college admissions, and interpersonal dynamics.',
      icon: GraduationCap
    },
    {
      id: 'p-6',
      name: 'Organizations Building Healthier Workplaces',
      desc: 'CEOs, founders, and HR leaders looking to shield their teams from clinical burnout through workshops.',
      icon: Building2
    }
  ];

  return (
    <section id="who-we-serve-section" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Fit Matrix
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            Who Is Nepa Health For?
          </h2>
          <p className="mt-4 text-base text-muted">
            We target diverse layers of Nepalese society. Whether you seek self-awareness, deep clinical matching, or institutional support, we have an option.
          </p>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {personas.map((persona, index) => {
            const IconComp = persona.icon;
            return (
              <motion.div
                key={persona.id}
                id={`persona-card-${persona.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-secondary/40 p-6 sm:p-8 rounded-2xl border border-primary/5 hover:border-primary/20 hover:bg-secondary/60 hover:shadow-md transition-all duration-300 flex flex-col items-start"
              >
                {/* Sage Green Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center mb-6 shadow-md shadow-primary/10">
                  <IconComp className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-serif font-bold text-dark mb-2.5">
                  {persona.name}
                </h3>

                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {persona.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
