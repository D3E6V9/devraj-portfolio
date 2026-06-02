import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ShieldCheck, Info, Smile, Users } from 'lucide-react';

export default function ProblemStatement() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Custom simulation for counters
  const [urbanPct, setUrbanPct] = useState(0);
  const [psychologistRatio, setPsychologistRatio] = useState(0.0);
  const [globalBurden, setGlobalBurden] = useState(0.0);
  const [collegesTotal, setCollegesTotal] = useState(0);

  useEffect(() => {
    if (isInView) {
      // Counter speed configurations
      let step1 = 0;
      const t1 = setInterval(() => {
        step1 += 1;
        if (step1 >= 14) {
          setUrbanPct(14);
          clearInterval(t1);
        } else {
          setUrbanPct(step1);
        }
      }, 50);

      let step2 = 0.0;
      const t2 = setInterval(() => {
        step2 += 0.02;
        if (step2 >= 0.22) {
          setPsychologistRatio(0.22);
          clearInterval(t2);
        } else {
          setPsychologistRatio(parseFloat(step2.toFixed(2)));
        }
      }, 80);

      let step3 = 0.0;
      const t3 = setInterval(() => {
        step3 += 0.3;
        if (step3 >= 6.0) {
          setGlobalBurden(6.0);
          clearInterval(t3);
        } else {
          setGlobalBurden(parseFloat(step3.toFixed(1)));
        }
      }, 100);

      let step4 = 0;
      const t4 = setInterval(() => {
        step4 += 70;
        if (step4 >= 1467) {
          setCollegesTotal(1467);
          clearInterval(t4);
        } else {
          setCollegesTotal(step4);
        }
      }, 40);

      return () => {
        clearInterval(t1);
        clearInterval(t2);
        clearInterval(t3);
        clearInterval(t4);
      };
    }
  }, [isInView]);

  return (
    <section
      id="problem-statement-section"
      ref={containerRef}
      className="py-20 sm:py-28 bg-primary/5 relative overflow-hidden"
    >
      {/* Wave SVG Divider at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] text-white fill-current"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,87.05,25.92,154.67,43.11,224.5,58.74,321.39,56.44Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Header Label */}
        <div className="text-center mb-16">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/15 px-3 py-1 rounded-full">
            The Reality Call
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            The Mental Health Crisis in Nepal
          </h2>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Emotional Copy */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-serif text-dark leading-snug">
              Behind beautiful peaks lies a silent, growing struggle.
            </h3>
            
            <p className="text-base text-muted leading-relaxed">
              Mental wellbeing remains one of the most neglected topics in Nepal. Cultural barriers, acute stigma, and lack of systemic caregiver matching mean over 90% of our population handles internal struggles in isolation.
            </p>
            
            <p className="text-base text-muted leading-relaxed">
              Careseekers suffer from severe delays in diagnostic discovery, while the very few skilled caregivers are predominantly bottlenecked in major urban areas. Professional attention remains unreachable for people outside key pockets of Kathmandu Valley.
            </p>

            {/* Soft Quote Block */}
            <div className="bg-white/70 border-l-4 border-primary p-6 rounded-r-2xl shadow-sm backdrop-blur-sm mt-8">
              <p className="text-base font-serif italic text-dark leading-relaxed">
                "Our registered psychologists and mental health providers are heavily concentrated inside metropolitan settings. We bridge that exact gap — matching care seekers with accredited professionals no matter if they reside in Jhapa, Pokhara, or Kathmandu."
              </p>
              <div className="mt-3 flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-xs font-semibold text-muted font-mono uppercase tracking-wider">
                  Nepa Health Mission Statement
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Counter Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Stat Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm transition-transform hover:-translate-y-1 hover:border-primary/20 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                <Users className="w-5 h-5" />
              </div>
              <span className="block text-4xl font-serif font-black text-dark tracking-tight">
                {urbanPct}%+
              </span>
              <p className="text-sm font-semibold text-dark mt-2 leading-tight">
                Urban Mental Struggles
              </p>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Of Nepal’s urban community struggles with stress, anxiety, or depression regularly.
              </p>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm transition-transform hover:-translate-y-1 hover:border-primary/20 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Info className="w-5 h-5" />
              </div>
              <span className="block text-4xl font-serif font-black text-dark tracking-tight">
                {psychologistRatio}
              </span>
              <p className="text-sm font-semibold text-dark mt-2 leading-tight">
                Psychologists per 100K
              </p>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Extremely low density (WHO recommends 10 per 100,000 for safe core care distribution).
              </p>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm transition-transform hover:-translate-y-1 hover:border-primary/20 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Smile className="w-5 h-5" />
              </div>
              <span className="block text-4xl font-serif font-black text-dark tracking-tight">
                ${globalBurden}T
              </span>
              <p className="text-sm font-semibold text-dark mt-2 leading-tight">
                Global Economic Loss
              </p>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                By 2030, mental illnesses will represent a multi-trillion economic drag if left untreated.
              </p>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm transition-transform hover:-translate-y-1 hover:border-primary/20 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="block text-4xl font-serif font-black text-dark tracking-tight">
                {collegesTotal}
              </span>
              <p className="text-sm font-semibold text-dark mt-2 leading-tight">
                Nepali Colleges Targeted
              </p>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Institutions in urgent need of proactive young caregiver training and assessments.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
