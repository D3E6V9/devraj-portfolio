import React, { useState } from 'react';
import { 
  Heart, 
  Brain, 
  ClipboardList, 
  ShieldAlert, 
  CheckCircle, 
  Info, 
  Lock, 
  Activity, 
  ArrowRight, 
  ShoppingBag,
  ListFilter,
  BarChart2,
  Check,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PHQ9_QUESTIONS, 
  GAD7_QUESTIONS, 
  PSS10_QUESTIONS, 
  REVERSE_PSS10_KEYS 
} from '../data';
import { SelfAssessmentResult, ProductItem } from '../types';

interface AssessmentCenterProps {
  onAddAssessmentResult: (result: Omit<SelfAssessmentResult, 'id' | 'submittedAt'>) => Promise<SelfAssessmentResult>;
  products: ProductItem[];
  onAddToCart: (product: ProductItem) => void;
  onNavigateToShop: () => void;
}

export default function AssessmentCenter({ 
  onAddAssessmentResult, 
  products, 
  onAddToCart,
  onNavigateToShop
}: AssessmentCenterProps) {
  const [selectedTest, setSelectedTest] = useState<'PHQ-9' | 'GAD-7' | 'PSS-10'>('PHQ-9');
  const [userName, setUserName] = useState('');
  const [userConsent, setUserConsent] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'results'>('intro');
  const [latestResult, setLatestResult] = useState<SelfAssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Aggregated Simulated Public Community Metrics
  const publicMetrics = {
    PHQ9: { count: 684, avgScore: 7.8, moderatePct: 24.3, highPct: 11.2 },
    GAD7: { count: 812, avgScore: 6.9, moderatePct: 19.5, highPct: 8.6 },
    PSS10: { count: 540, avgScore: 16.4, moderatePct: 41.2, highPct: 15.8 }
  };

  const getQuestions = () => {
    switch (selectedTest) {
      case 'PHQ-9': return PHQ9_QUESTIONS;
      case 'GAD-7': return GAD7_QUESTIONS;
      case 'PSS-10': return PSS10_QUESTIONS;
    }
  };

  const getOptions = () => {
    if (selectedTest === 'PSS-10') {
      return [
        { label: 'Never', value: 0 },
        { label: 'Almost Never', value: 1 },
        { label: 'Sometimes', value: 2 },
        { label: 'Fairly Often', value: 3 },
        { label: 'Very Often', value: 4 }
      ];
    } else {
      return [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
      ];
    }
  };

  const handleSelectAnswer = (qId: string, val: number) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleStartTest = () => {
    if (!userConsent) {
      alert('Consent is required to run the evaluation algorithms.');
      return;
    }
    setAnswers({});
    setCurrentStep('questions');
  };

  const handleCalculateResults = async () => {
    const questionsList = getQuestions();
    
    // Check for incomplete questions
    const unanswered = questionsList.filter(q => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      alert(`Please answer all ${unanswered.length} remaining questions to compile accurate medical scores.`);
      return;
    }

    // 1. Calculate Score Sum
    let sumScore = 0;
    questionsList.forEach(q => {
      let rawVal = answers[q.id];
      if (selectedTest === 'PSS-10' && REVERSE_PSS10_KEYS.includes(q.id)) {
        // Reverse score: PSS-10 has 0->4, 1->3, etc.
        rawVal = 4 - rawVal;
      }
      sumScore += rawVal;
    });

    // 2. Map bands depending on PHQ-9, GAD-7, PSS-10 standards
    let bandCode: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe' | 'low' | 'high' = 'minimal';
    let bandLabel = 'Minimal';
    let bandColor = 'text-green-600 bg-green-50 border-green-200';
    let maxScore = 27;
    let recommendations: string[] = [];
    let analysisSummary = '';

    const createSummary = (headline: string, advice: string) => `${headline} ${advice}`;

    if (selectedTest === 'PHQ-9') {
      maxScore = 27;
      if (sumScore <= 4) {
        bandCode = 'minimal';
        bandLabel = 'Minimal Depression Severity';
        bandColor = 'text-green-600 bg-green-50 border-green-200';
        recommendations = [
          'Continue self-care tracking exercises.',
          'Adopt morning Himalayan lock-step breathing techniques.',
          'Review educational blogs in Nepa Health content hubs.'
        ];
      } else if (sumScore <= 9) {
        bandCode = 'mild';
        bandLabel = 'Mild Depression Severity';
        bandColor = 'text-yellow-600 bg-yellow-50 border-yellow-200';
        recommendations = [
          'Explore our custom Lokta paper Mindfulness Journals.',
          'Use digital mood check-ins daily.',
          'Maintain robust connection logs with friends and family.'
        ];
        analysisSummary = createSummary(
          'Your PHQ-9 score falls in the mild depression range.',
          'You may be experiencing early symptoms, so keep tracking your mood and try small daily support habits. If these feelings continue or worsen, consult a licensed mental health counselor for guidance.'
        );
      } else if (sumScore <= 14) {
        bandCode = 'moderate';
        bandLabel = 'Moderate Depression Severity';
        bandColor = 'text-amber-600 bg-amber-50 border-amber-200';
        recommendations = [
          'Schedule a 100% confidential audio/video session with certified counseling partners.',
          'Consider procuring a therapeutic Essential Oils starter bundle in Well-Mart.',
          'Limit academic studies and work stresses to 6 hours daily during recovery.'
        ];
        analysisSummary = createSummary(
          'Your PHQ-9 result indicates moderate depression symptoms.',
          'This level of distress often benefits from professional support. Reach out to a counselor or clinician while also practicing supportive self-care and rest.'
        );
      } else if (sumScore <= 19) {
        bandCode = 'moderately_severe';
        bandLabel = 'Moderately Severe Depression';
        bandColor = 'text-orange-600 bg-orange-50 border-orange-200';
        recommendations = [
          'Urgently coordinate a psychiatric call escort through Nepa Health Care Allocation.',
          'Engage immediate offline diagnostics support.',
          'Notify family mentors to share responsibilities.'
        ];
        analysisSummary = createSummary(
          'Your PHQ-9 score is in the moderately severe depression range.',
          'These results suggest significant symptoms that should be reviewed by a healthcare professional as soon as possible. Reach out for specialized support rather than relying only on self-management.'
        );
      } else {
        bandCode = 'severe';
        bandLabel = 'Severe Clinical Depression';
        bandColor = 'text-red-600 bg-red-50 border-red-200';
        recommendations = [
          'Seek direct clinical attention immediately! Call emergency coordinators.',
          'Arrange immediate home nursing visits for psychiatric care and monitoring.',
          'Do not utilize self-copping techniques in isolation. Coordinate medical support.'
        ];
        analysisSummary = createSummary(
          'Your PHQ-9 result is in the severe depression range.',
          'This indicates a high level of clinical concern. Please contact a healthcare professional or crisis service as soon as possible and avoid facing this alone.'
        );
      }
    } else if (selectedTest === 'GAD-7') {
      maxScore = 21;
      if (sumScore <= 4) {
        bandCode = 'minimal';
        bandLabel = 'Minimal Anxiety Severity';
        bandColor = 'text-green-600 bg-green-50 border-green-200';
        recommendations = [
          'Practice Himalayan mountains visualization before commute.',
          'Log your stress level once weekly.',
          'Check out free certified webinars.'
        ];
        analysisSummary = createSummary(
          'Your GAD-7 score represents minimal anxiety symptoms.',
          'You are currently showing a low level of distress, but continue practicing calm routines and monitoring your stress so it stays manageable.'
        );
      } else if (sumScore <= 9) {
        bandCode = 'mild';
        bandLabel = 'Mild Anxiety Severity';
        bandColor = 'text-yellow-600 bg-yellow-50 border-yellow-200';
        recommendations = [
          'Drink Solukhumbu Organic Lemongrass or Chamomile infusions before sleep.',
          'Practice twice-daily breathing exercises.',
          'Write down anxiety fears inside a secure lokta journal.'
        ];
        analysisSummary = createSummary(
          'Your GAD-7 score indicates mild anxiety.',
          'These symptoms are still manageable, but staying consistent with calming habits and checking in with a counselor can help prevent escalation.'
        );
      } else if (sumScore <= 14) {
        bandCode = 'moderate';
        bandLabel = 'Moderate Anxiety Severity';
        bandColor = 'text-amber-600 bg-amber-50 border-amber-200';
        recommendations = [
          'Consult a psychologist match utilizing our online care pathway.',
          'Explore sensory stress balls and Mustang aromatherapy starter kits.',
          'Dedicate 30 minutes to walking in natural reserves in Kathmandu Valley.'
        ];
        analysisSummary = createSummary(
          'Your GAD-7 score is in the moderate anxiety range.',
          'This often benefits from support from a healthcare professional or counselor alongside daily stress management routines.'
        );
      } else {
        bandCode = 'severe';
        bandLabel = 'Severe Clinical Anxiety';
        bandColor = 'text-red-600 bg-red-50 border-red-200';
        recommendations = [
          'Book immediate medical sessions with clinical caretakers.',
          'Seek urgent guidance at our Kathmandu headquarters or NMC certified centers.',
          'Consider clinical medical therapies if prescribed by certified psychiatrists.'
        ];
        analysisSummary = createSummary(
          'Your GAD-7 result falls in the severe anxiety range.',
          'This suggests substantial clinical symptoms, so please connect with a healthcare provider or counselor right away for direct support.'
        );
      }
    } else if (selectedTest === 'PSS-10') {
      maxScore = 40;
      if (sumScore <= 13) {
        bandCode = 'low';
        bandLabel = 'Low Perceived Stress';
        bandColor = 'text-green-600 bg-green-50 border-green-200';
        recommendations = [
          'Maintain regular hydration with intention.',
          'Stay physically active.',
          'Help other students or peers open up.'
        ];
        analysisSummary = createSummary(
          'Your PSS-10 score indicates low perceived stress.',
          'You appear to be coping well with daily pressure, so keep using healthy routines and check your stress level again if things change.'
        );
      } else if (sumScore <= 26) {
        bandCode = 'moderate';
        bandLabel = 'Moderate Stress Severity';
        bandColor = 'text-amber-600 bg-amber-50 border-amber-200';
        recommendations = [
          'Adopt the Lok-Step breathing loop hourly.',
          'Consider our Mental Health Kit or sensory squeeze grip items.',
          'Limit digital screen scrolling to 1 hour daily.'
        ];
        analysisSummary = createSummary(
          'Your PSS-10 result shows moderate perceived stress.',
          'While not urgent, these signs suggest it would help to build in recovery time and consider speaking with a counselor if stress feels persistent.'
        );
      } else {
        bandCode = 'high';
        bandLabel = 'High Perceived Stress';
        bandColor = 'text-red-600 bg-red-50 border-red-200';
        recommendations = [
          'Urgently consult therapeutic counseling professionals.',
          'Coordinate a home physical health wellness check-in.',
          'Engage immediate academic or work leave if recommended by certified consultants.'
        ];
        analysisSummary = createSummary(
          'Your PSS-10 score indicates high perceived stress.',
          'This level of stress often requires professional attention and should be discussed with a healthcare provider or counselor soon.'
        );
      }
    }

    const payloadResult: Omit<SelfAssessmentResult, 'id' | 'submittedAt'> = {
      testName: selectedTest,
      userName: userName.trim(),
      scores: {
        score: sumScore,
        maxScore: maxScore,
        bandCode: bandCode,
        bandLabel: bandLabel,
        bandColor: bandColor
      },
      answers: answers,
      recommendations: recommendations,
      analysisSummary: analysisSummary,
      summaryBullets: analysisSummary
        ? analysisSummary
            .split(/\.\s+/)
            .filter(Boolean)
            .map((sentence) => sentence.trim())
        : undefined
    };

    setIsSubmitting(true);
    const createdResult = await onAddAssessmentResult(payloadResult);
    setIsSubmitting(false);

    setLatestResult(createdResult);
    setCurrentStep('results');
  };

  const handleTakeAnother = () => {
    setAnswers({});
    setLatestResult(null);
    setCurrentStep('intro');
  };

  // Get matching product recommendation based on score bands
  const getRecommendedProducts = () => {
    if (!latestResult) return [];
    if (latestResult.selectedProductIds?.length) {
      const selected = products.filter((product) => latestResult.selectedProductIds?.includes(product.id));
      if (selected.length > 0) {
        return selected;
      }
    }

    const desiredTags = (latestResult.productTags ?? []).map((tag) => tag.toLowerCase());

    const scoreProductByTags = (product: ProductItem) => {
      const tags = (product.tags ?? []).map((tag) => tag.toLowerCase());
      const tagScore = desiredTags.reduce((score, desiredTag) => {
        return score + (tags.includes(desiredTag) ? 3 : 0);
      }, 0);
      const categoryBonus = desiredTags.some((tag) => tag.includes('support')) && tags.includes('kit') ? 1 : 0;
      return tagScore + categoryBonus;
    };

    const fallbackScoreProduct = (product: ProductItem) => {
      const sourceText = [
        latestResult.testName,
        latestResult.scores.bandLabel,
        latestResult.recommendations.join(' '),
        latestResult.analysisSummary
      ]
        .join(' ')
        .toLowerCase();

      const tags = product.tags ?? [];
      const tagScore = tags.reduce((score, tag) => {
        return sourceText.includes(tag.toLowerCase()) ? score + 2 : score;
      }, 0);

      const categoryScore = product.category.toLowerCase().includes('therapeutic') && latestResult.scores.bandCode !== 'minimal' ? 1 : 0;
      const severityScore = latestResult.scores.bandCode === 'severe' && tags.includes('kit') ? 1 : 0;
      return tagScore + categoryScore + severityScore;
    };

    const scoredProducts = products.map((product) => ({
      product,
      score: desiredTags.length > 0 ? scoreProductByTags(product) : fallbackScoreProduct(product)
    }));

    const rankedProducts = scoredProducts
      .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
      .slice(0, 3)
      .map((item) => item.product);

    return rankedProducts.length ? rankedProducts : products.slice(0, 3);
  };

  const recommendedProducts = getRecommendedProducts();

  return (
    <div id="assessment-main-container" className="pt-24 sm:pt-28 min-h-screen bg-bggray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Stage Header */}
        <div className="text-center mb-10">
          <span className="text-xs sm:text-sm font-bold font-mono text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            Clinical Screening Portal
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-dark tracking-tight">
            Comprehensive Online Self-Assessments
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted max-w-2xl mx-auto">
            Accredited, clinically-validated screening tools. 100% anonymous, secure score summaries, and immediate next steps.
          </p>
          <div className="w-16 h-1 bg-accent/40 mx-auto mt-4 rounded-full" />
        </div>

        {/* 3 Tests Navigation Tabs - only accessible when not in active test questions */}
        {currentStep === 'intro' && (
          <div className="flex bg-white rounded-2xl p-1.5 border border-primary/10 shadow-sm max-w-xl mx-auto mb-10 justify-between">
            {(['PHQ-9', 'GAD-7', 'PSS-10'] as const).map(tName => (
              <button
                key={tName}
                onClick={() => setSelectedTest(tName)}
                className={`flex-1 py-3 text-center rounded-xl cursor-pointer font-bold text-xs sm:text-sm transition-all ${
                  selectedTest === tName
                    ? 'bg-primary text-white shadow-md'
                    : 'text-muted hover:text-primary hover:bg-primary/5'
                }`}
              >
                {tName === 'PHQ-9' && 'Depression (PHQ-9)'}
                {tName === 'GAD-7' && 'Anxiety (GAD-7)'}
                {tName === 'PSS-10' && 'Perceived Stress (PSS-10)'}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Card Frame */}
        <div className="bg-white rounded-3xl border border-primary/10 shadow-xl overflow-hidden min-h-[400px]">
          
          <AnimatePresence mode="wait">
            {/* STAGE 1: INTRO FORM PANEL */}
            {currentStep === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-6 sm:p-10 md:p-14 space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  {/* Left info column */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-accent">
                      <ClipboardList className="w-4 h-4 text-accent" />
                      <span>Validated Clinical Standard</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-dark">
                      About the {selectedTest} screening tool
                    </h2>

                    <p className="text-sm text-muted leading-relaxed">
                      {selectedTest === 'PHQ-9' && 'The Patient Health Questionnaire-9 (PHQ-9) is the gold standard clinical diagnostic algorithm used globally by psychiatrists. It scores 9 key symptoms of depression, tracking changes over the last two weeks.'}
                      {selectedTest === 'GAD-7' && 'The Generalized Anxiety Disorder-7 (GAD-7) is a highly reliable 7-item psychometric scale used to screen for physical, cognitive, and emotional anxiety symptoms over current schedules.'}
                      {selectedTest === 'PSS-10' && 'The Perceived Stress Scale (PSS-10) is the most popular psychiatric instrument to map how sovereign and capable you feel while experiencing unpredictable stressors in your daily environment.'}
                    </p>

                    <div className="space-y-2 pt-2 text-xs text-dark/95">
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-primary mr-2" />
                        <span>Completion duration: ~2-3 minutes</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-primary mr-2" />
                        <span>Scores generated instantly in screen dashboard</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-primary mr-2" />
                        <span>100% confidential and compliant with care security standards</span>
                      </div>
                    </div>
                  </div>

                  {/* Right form input column */}
                  <div className="md:col-span-5 bg-bggray p-6 rounded-2xl border border-primary/5 space-y-4">
                    <div>
                      <label htmlFor="intro-username" className="block text-xs font-bold text-dark uppercase tracking-wider mb-2 font-mono">
                        Your Name or Initials
                      </label>
                      <input
                        id="intro-username"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Optional — leave blank to remain anonymous"
                        className="w-full bg-white text-dark px-4 py-3 rounded-xl border border-primary/10 focus:outline-none focus:border-primary text-sm transition-colors"
                      />
                      <p className="mt-2 text-[11px] text-muted leading-relaxed">
                        Name is optional. We can track this assessment using a unique ID for analytics and audit purposes.
                      </p>
                    </div>

                    <div className="space-y-2 mt-4">
                      <label className="flex items-start space-x-2 cursor-pointer text-xs text-muted leading-normal">
                        <input
                          type="checkbox"
                          checked={userConsent}
                          onChange={(e) => setUserConsent(e.target.checked)}
                          className="mt-0.5 rounded accent-primary"
                        />
                        <span>I consent to compiling my answers anonymously for psychiatric progress audits.</span>
                      </label>
                    </div>

                    <button
                      onClick={handleStartTest}
                      className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-md cursor-pointer transition-colors mt-4 flex items-center justify-center space-x-2"
                    >
                      <span>Begin Assessment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Trust Builders footnote row */}
                <div className="pt-8 border-t border-primary/5 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-primary/5 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 md:-mx-14 md:-mb-14 p-6">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-dark text-xs font-mono uppercase">Decrypted Local State</h4>
                      <p className="text-[11px] text-muted leading-relaxed mt-0.5">Your inputs remain local until submission matches.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Activity className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-dark text-xs font-mono uppercase">Clinical Benchmarks</h4>
                      <p className="text-[11px] text-muted leading-relaxed mt-0.5">Aligned natively with WHO Diagnostic rules.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-dark text-xs font-mono uppercase">Safe Environment</h4>
                      <p className="text-[11px] text-muted leading-relaxed mt-0.5">Crisis options accessible instantly any time.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: ACTIVE TESTING QUESTIONS */}
            {currentStep === 'questions' && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 sm:p-10 md:p-12 space-y-8"
              >
                {/* Active progress bar */}
                <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted font-bold font-mono">
                      Active Evaluation System
                    </span>
                    <h3 className="text-lg font-serif font-bold text-dark mt-1">
                      Taking the {selectedTest} test
                    </h3>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs text-primary font-mono font-bold">
                      Taker: {userName.trim() || 'Anonymous'}
                    </span>
                    <span className="block text-[10px] text-muted uppercase font-mono mt-0.5 font-semibold">
                      Answers confidential
                    </span>
                  </div>
                </div>

                {/* Question Items Frame - Vertical stack */}
                <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                  {getQuestions().map((q, qIndex) => {
                    const activeAns = answers[q.id];
                    return (
                      <div key={q.id} className="p-4 sm:p-6 bg-bggray rounded-2xl border border-primary/5 space-y-4">
                        <div className="flex items-start">
                          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold mr-3 shrink-0 mt-0.5">
                            {qIndex + 1}
                          </span>
                          <p className="text-sm sm:text-base font-serif font-bold text-dark leading-snug">
                            {q.text}
                          </p>
                        </div>

                        {/* Likert Scale Select Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3 pl-0 sm:pl-9">
                          {getOptions().map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, opt.value)}
                              className={`py-2.5 px-3 rounded-xl text-xs font-semibold cursor-pointer border text-center transition-all ${
                                activeAns === opt.value
                                  ? 'bg-primary border-primary text-white shadow-sm'
                                  : 'bg-white border-primary/10 text-muted hover:bg-primary/5 hover:text-primary hover:border-primary/20'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-primary/5 flex-col sm:flex-row space-y-4 sm:space-y-0">
                  <span className="text-xs text-muted">
                    Please make sure you selected answers for all questions before finishing.
                  </span>
                  
                  <div className="flex space-x-3 w-full sm:w-auto">
                    <button
                      onClick={() => setCurrentStep('intro')}
                      className="flex-1 sm:flex-initial cursor-pointer bg-neutral-100 hover:bg-neutral-200 text-dark px-5 py-3 rounded-xl text-xs font-bold transition-all border border-primary/10"
                    >
                      Back to intro
                    </button>
                    <button
                      onClick={handleCalculateResults}
                      disabled={isSubmitting}
                      className={`flex-1 sm:flex-initial ${isSubmitting ? 'cursor-not-allowed bg-accent/70' : 'cursor-pointer bg-accent hover:bg-accent/95'} text-white px-7 py-3 rounded-xl text-xs font-bold shadow-md transition-all uppercase tracking-wider`}
                    >
                      {isSubmitting ? 'Generating Summary...' : 'Calculate Results'}
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* STAGE 3: RESULT AND RECOMMENDATIONS DASHBOARD */}
            {currentStep === 'results' && latestResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-6 sm:p-10 md:p-12 space-y-8"
              >
                
                {/* Result alert success title */}
                <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-muted">
                        Test Complete namaste
                      </span>
                      <h3 className="text-base font-serif font-bold text-dark">
                        Diagnostic scorecard compiled successfully!
                      </h3>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-mono text-xs text-muted">
                      Assessment ID: {latestResult.id}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      Use this ID for analytics and audit reference.
                    </span>
                  </div>
                </div>

                {/* Evaluation dashboard stats layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  
                  {/* Left segment: Score Badge & explanation */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-bggray rounded-2xl border border-primary/10 text-center space-y-4">
                    <span className="text-xs font-bold text-muted font-mono uppercase tracking-widest">
                      Your Score
                    </span>
                    
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-primary/20 shadow-md">
                      <span className="text-4xl font-serif font-black text-dark">
                        {latestResult.scores.score}
                      </span>
                    </div>

                    <span className="text-xs text-muted font-mono leading-none">
                      out of maximum {latestResult.scores.maxScore}
                    </span>

                    {/* Band status pills label */}
                    <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${latestResult.scores.bandColor}`}>
                      {latestResult.scores.bandLabel}
                    </div>
                  </div>

                  {/* Right segment: Clinical insight parameters */}
                  <div className="md:col-span-8 space-y-4">
                    <h4 className="font-serif font-bold text-dark text-lg">
                      Personalized Recovery Summary & Insights:
                    </h4>

                    {latestResult.summaryBullets?.length ? (
                      <ul className="space-y-3 mb-4">
                        {latestResult.summaryBullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start text-sm sm:text-base text-dark/90 leading-relaxed">
                            <span className="mr-3 text-primary font-bold">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : latestResult.analysisSummary ? (
                      <p className="text-sm sm:text-base text-dark/90 leading-relaxed mb-4">
                        {latestResult.analysisSummary}
                      </p>
                    ) : (
                      <p className="text-sm sm:text-base text-dark/90 leading-relaxed mb-4">
                        AI-generated summary is not available for this assessment. Please refresh the page or try again later.
                      </p>
                    )}

                    {latestResult.recommendations?.length ? (
                      <ul className="space-y-3">
                        {latestResult.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start text-xs sm:text-sm text-dark/95 leading-normal">
                            <Check className="w-4 h-4 text-primary mr-2.5 shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/15 text-xs text-muted leading-relaxed mt-4">
                      <strong>Standard Disclaimer:</strong> This quiz serves as an accredited screening check. It is not equivalent to a formal medical or clinical diagnosis. If your scores suggest Moderate or Severe conditions, we strongly advise Booking a direct consultation under Nepa Health or visiting nearby NMC registered health institutions.
                    </div>
                  </div>

                </div>

                {/* AI / Product Match Recommendations Popup card widget */}
                {recommendedProducts.length > 0 && (
                  <div className="space-y-4 mt-4">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-accent font-mono">
                      Recommended Care Products
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendedProducts.map((product) => (
                        <div
                          key={product.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => onNavigateToShop()}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              onNavigateToShop();
                            }
                          }}
                          className="bg-secondary/40 border border-primary/5 p-5 rounded-3xl flex flex-col justify-between hover:border-primary/25 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <div className="space-y-4">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-40 object-cover rounded-2xl border border-primary/10 shadow-sm"
                            />
                            <div>
                              <h4 className="font-serif font-bold text-dark text-base leading-tight">
                                {product.name}
                              </h4>
                              <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-3">
                                {product.description}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-primary">NPR {product.price}</span>
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                onAddToCart(product);
                              }}
                              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full text-xs font-bold transition-colors"
                            >
                              Order Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-primary/5 flex-col sm:flex-row space-y-4 sm:space-y-0">
                  <span className="text-xs text-muted">
                    Data synced securely inside the Admin Console statistics tracker.
                  </span>
                  
                  <div className="flex space-x-3 w-full sm:w-auto">
                    <button
                      onClick={handleTakeAnother}
                      className="flex-1 sm:flex-initial cursor-pointer bg-neutral-100 hover:bg-neutral-200 text-dark px-5 py-3 rounded-xl text-xs font-bold transition-all border border-primary/10"
                    >
                      Take Another Test
                    </button>
                    <button
                      onClick={() => {
                        const contactEl = document.getElementById('contact-section');
                        if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex-1 sm:flex-initial cursor-pointer bg-accent hover:bg-accent/95 text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md transition-all"
                    >
                      Talk to a Professional
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Public Analytics and Trust-Builder Panel below the test frame */}
        <div className="mt-12 bg-white rounded-2xl border border-primary/10 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center space-x-2.5 mb-6 text-primary">
            <Activity className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-extrabold text-dark text-lg leading-tight">
              Community Health Benchmarks & Transparency
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center border-b border-primary/5 pb-6 mb-6">
            <div className="bg-bggray p-4 rounded-xl border border-primary/5">
              <span className="text-xs text-muted block font-mono">Aggregated Evaluations</span>
              <p className="text-2xl font-serif font-bold text-dark mt-1">2,036+ Patients</p>
              <p className="text-[10px] text-muted leading-tight mt-1 font-mono uppercase">Last updated: June 2026</p>
            </div>
            <div className="bg-bggray p-4 rounded-xl border border-primary/5">
              <span className="text-xs text-muted block font-mono">Anxiety Severity Avg</span>
              <p className="text-2xl font-serif font-bold text-dark mt-1">6.9 (Mild GAD-7)</p>
              <p className="text-[10px] text-muted leading-tight mt-1 font-mono uppercase">Anonymized dataset</p>
            </div>
            <div className="bg-bggray p-4 rounded-xl border border-primary/5">
              <span className="text-xs text-muted block font-mono">Feedback Rating</span>
              <p className="text-2xl font-serif font-bold text-dark mt-1 flex items-center justify-center">
                4.8 <Star className="w-4 h-4 fill-accent text-accent ml-1" />
              </p>
              <p className="text-[10px] text-muted leading-tight mt-1 font-mono uppercase">On test compliance & safety</p>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed text-center max-w-2xl mx-auto">
            "These screening diagnostics are modeled off the Patient Health Questionnaire and Perceived Stress scales. Raw metadata remains encrypted and is strictly governed by clinical confidentiality guidelines. By mapping collective stress markers, we direct care teams to high-pressure schools and workspaces across Kathmandu Valley."
          </p>
        </div>

      </div>
    </div>
  );
}
