import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQ() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is Nepa Health confidential?',
      a: 'Absolutely. Client safety and medical confidentiality are our absolute values. All virtual counseling logs, audio, video transmissions, and local screen test outputs are 100% encrypted, ensuring neither coworkers, schools, nor family members can tap your records.'
    },
    {
      q: 'How do I book a therapy session?',
      a: 'Take one of our validated self-evaluation tests first! Once your score card is ready, our ML recommender allocates suitable registered therapists in Kathmandu or virtual consultants depending on your goals. You can book directly using domestic apps.'
    },
    {
      q: 'Do you offer services outside Kathmandu?',
      a: 'Yes, our online/virtual psychiatric consultations and psychometric evaluate tests are active across all regions in Nepal. However, physical "Home Health Care" nursing dispatches and emergency rehab monitoring are currently constrained to Kathmandu Valley.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We fully support direct local digital wallets like eSewa and Khalti, along with international processing via PayPal for Nepali non-residents buying subscription packages for family members living in Kathmandu.'
    },
    {
      q: 'How is Nepa Health different from other platforms?',
      a: 'Most directories only share lists of health coordinates. Nepa Health runs the complete holistic "E² + A²" cycle. We educate online, provide validated clinical tools to evaluate stress, match patients with vetted experts, and allocate immediate home health visits.'
    },
    {
      q: 'Are your therapists certified?',
      a: 'Yes, every caregiver, counselor, and clinical psychiatrist operating on Nepa Health holds active registrations with the Nepal Medical Council (NMC) or Nepal Health Professional Council (NHPC), with thorough credential audits completed.'
    }
  ];

  const handleToggle = (idx: number) => {
    setActiveIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq-section" className="py-20 sm:py-28 bg-[#FCFCF9] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header section */}
        <div className="text-center mb-16">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Inquiries
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            Common Questions
          </h2>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        {/* Accordions Frame */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-primary/5 overflow-hidden transition-all duration-200 shadow-sm hover:border-primary/20"
              >
                {/* Header click bar */}
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between text-dark hover:text-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5 pr-4">
                    <HelpCircle className="w-5 h-5 text-accent shrink-0" />
                    <span className="font-serif font-bold text-base sm:text-lg">
                      {faq.q}
                    </span>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-lg bg-bggray flex items-center justify-center text-dark/60 transition-transform duration-200 ${isOpen ? 'rotate-90 text-primary bg-primary/10' : ''}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Smooth Expandable Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-primary/5 text-sm text-muted leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Safety Disclaimer footnote */}
        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/15 mt-12 flex items-start space-x-4">
          <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0 animate-ping" />
          <p className="text-xs text-muted leading-relaxed">
            <strong>Urgent Safety Alert:</strong> Nepa Health is an outpatient care coordinate portal. If you or a loved one is in an active self-harm loop or facing severe psychiatric emergencies, please call the local government 24/7 hotline <strong>1166</strong> immediately. Do not delay professional help while completing online tests.
          </p>
        </div>

      </div>
    </section>
  );
}
