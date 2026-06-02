import { ServiceItem, BlogPost, TestimonialItem, ValueItem, ProductItem, ContactSubmission, SelfAssessmentResult } from './types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    category: 'Clinical',
    iconName: 'MessageSquareIcon',
    title: 'Mental Health Counseling',
    shortDesc: 'Virtual and offline therapy sessions with certified Nepali caregivers, therapists, and psychiatrists.',
    longDesc: 'Access highly confidential, specialized mental health therapy over high-quality video call, audio, or secure messaging. We match you with vetted counselors who understand our cultural contexts and language nuances.',
    points: [
      'Virtual Therapy (high-quality video, phone, chat)',
      'Self-assessment toolkit backed by expert clinical oversight',
      'Specialized care pathways for teens, college students, couples, and organizations'
    ],
    ctaText: 'Book a Session'
  },
  {
    id: 'srv-2',
    category: 'Self-Care',
    iconName: 'HeartIcon',
    title: 'Emotional & Wellness Tools',
    shortDesc: 'Mood logging, mental fatigue checks, and a library of mindfulness guides adapted for Nepal.',
    longDesc: 'Take control of your day-to-day wellbeing. Use our interactive digital mood recorders, journal your private thoughts in an encrypted locker, and practice tailored meditations featuring traditional sounds from the Himalayas.',
    points: [
      'Daily mood tracking & secure wellness journaling',
      'Scientifically-validated screening quizzes for depression, anxiety & work burnout',
      'Bilingual Nepali/English mindfulness audio sessions, deep breathing practices and sleeping aids'
    ],
    ctaText: 'Explore Tools'
  },
  {
    id: 'srv-3',
    category: 'Education',
    iconName: 'BookIcon',
    title: 'Educational Resources',
    shortDesc: 'Culturally informed courses, gamified certificates, and myth-busting resources to destigmatize mental health.',
    longDesc: 'Stigma is our biggest enemy. We curate rich, beautifully interactive resources specifically tailored to the Nepali social fabric, educating communities from Kathmandu to the far-reaches of Nepal.',
    points: [
      'Expert-verified editorial health articles, podcasts, and infographics in Nepali and English',
      'Gamified awareness pathways with personalized learning badges and certificates',
      'Holistic physical wellness, nutrition guides, and Himalayan yoga exercises'
    ],
    ctaText: 'Start Learning'
  },
  {
    id: 'srv-4',
    category: 'Marketplace',
    iconName: 'ShoppingBagIcon',
    title: 'Well-Mart (E-Marketplace)',
    shortDesc: 'Curated wellness items, calming therapeutics, and focus-enhancing tools accessible across Nepal.',
    longDesc: 'Nepal’s premier online wellness hub. Procure high-quality sensory tools, stress relief resources, natural remedies, and self-care subscription packs curated by mental health clinicians.',
    points: [
      'Clinician-approved therapeutic sensory items, essential oils & focus logs',
      'Curated monthly subscriber boxes designed to cultivate lasting wellbeing habits',
      'Secure transaction processing with direct eSewa, Khalti, and domestic digital wallets'
    ],
    ctaText: 'Shop Well-Mart'
  },
  {
    id: 'srv-5',
    category: 'Institutional',
    iconName: 'BuildingIcon',
    title: 'Corporate & Student Wellbeing',
    shortDesc: 'Mental resilience programs, employee assistance programs, and academic crisis interventions.',
    longDesc: 'Prevent burnout in workplaces and cultivate high-support systems in colleges. We offer direct B2B corporate care tiers, workshops, leadership feedback pathways, and designated student caregiver allocations.',
    points: [
      'Fully-customized Corporate Care Subscriptions & Employee Assistance Plans (EAP)',
      'Anti-stigma campus seminars, stress relief camps, and diagnostic clinics for colleges',
      'Proactive leadership metrics dashboards reporting aggregated anonymous stress scores'
    ],
    ctaText: 'Partner With Us'
  },
  {
    id: 'srv-6',
    category: 'Home Care',
    iconName: 'HomeIcon',
    title: 'Home Health Services',
    shortDesc: 'Dedicated physical psychiatric nursing, senior home care, and in-person recovery assistance.',
    longDesc: 'Care shouldn’t be bounded by clinic walls. Our mobile healthcare professionals conduct home visits in Kathmandu Valley, offering dedicated senior care, physical rehab support, and active recovery monitoring.',
    points: [
      'In-home clinical mental health visits and senior cognitive status check-ups',
      'Certified medical and nurse escorts for physical therapy and specialized senior care',
      'Progress metrics dashboard for remote relatives, keeping distant families linked to care'
    ],
    ctaText: 'Book Home Visit'
  }
];

export const INITIAL_VALUES: ValueItem[] = [
  { id: 'v-1', name: 'Happiness', iconName: 'SmileIcon', description: 'Cultivating sustainable emotional resilience, joy, and peace in daily Nepali life.' },
  { id: 'v-2', name: 'Integrity', iconName: 'ShieldIcon', description: 'Upholding strict medical standards, client privacy, data encryption, and transparent operations.' },
  { id: 'v-3', name: 'Creativity', iconName: 'PaletteIcon', description: 'Applying innovative interactive visual designs, and dynamic formats to mental education.' },
  { id: 'v-4', name: 'Sustainability', iconName: 'LeafIcon', description: 'Enduring social systems that nourish local caregivers and build persistent care infrastructures.' },
  { id: 'v-5', name: 'Transparency', iconName: 'EyeIcon', description: 'Absolute clarity about professional qualifications, pricing tiers, and treatment parameters.' },
  { id: 'v-6', name: 'Innovation', iconName: 'LightbulbIcon', description: 'Pioneering ML matchmaking, virtual consultations, and smart home-health dispatch across Nepal.' },
  { id: 'v-7', name: 'Celebrate Success', iconName: 'TrophyIcon', description: 'Honoring small and large milestones of mental recovery, habit formations, and caregiver contributions.' },
  { id: 'v-8', name: 'Learning', iconName: 'GraduationCapIcon', description: 'Consistently updating clinical knowledge bases, user methodologies, and research.' },
  { id: 'v-9', name: 'Accountability', iconName: 'CheckCircleIcon', description: 'Standing firmly by our clients, with ethical duties, reliable schedules, and emergency safety support.' }
];

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Aayush S.',
    location: 'Lalitpur, Nepal',
    quote: 'Nepa Health literally transformed how I handle academic pressure. Being able to secure a virtual counseling slot with a psychiatrist who speaks Nepali was smooth, cultural-aware, and extremely validating.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    profession: 'Engineering Student, Pulchowk Campus'
  },
  {
    id: 't-2',
    name: 'Punya D.',
    location: 'Jhapa, Nepal (Online)',
    quote: 'Living outside Kathmandu, finding qualified psychiatrists who can consult remotely is nearly impossible. Nepa Health bridged this gap gorgeously. I took my stress assessments offline and continued regular home prescriptions online.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    profession: 'High School Administrator'
  },
  {
    id: 't-3',
    name: 'Shraddha K.',
    location: 'Kathmandu, Nepal',
    quote: 'As an HR Coordinator, integrating Nepa Health’s Corporate Wellbeing programs drastically reduced sick leaves. Our staff feels deeply supported — particularly knowing there is a confidential, zero-stigma care pathway.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    profession: 'Corporate Recruiter'
  }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Mental Health Kit (Monthly Box)',
    description: 'An expert-curated physical kit containing therapeutic sensory sand, stress stones, guided journal prompts, and herbal Himalayan teas.',
    price: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1611079830570-cc390901f600?auto=format&fit=crop&q=80&w=400',
    isComingSoon: false,
    category: 'Therapeutic Kits',
    tags: ['depression', 'anxiety', 'stress', 'self-care', 'kit']
  },
  {
    id: 'prod-2',
    name: 'Aromatherapy Self-Care Pack',
    description: 'Calming essential lavender and cedarwood oils infused with extracts native to the foothills of the Mustang region, complete with a ceramic diffuser.',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=400',
    isComingSoon: false,
    category: 'Sensory Relief',
    tags: ['anxiety', 'sleep', 'calm', 'aromatherapy', 'relaxation']
  },
  {
    id: 'prod-3',
    name: 'Stress Relief Bundle',
    description: 'Includes our premium ergonomic squeeze grip tracker, customized Himalayan therapeutic salt lamp, and guided mindfulness logs.',
    price: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400',
    isComingSoon: false,
    category: 'Sensory Relief',
    tags: ['stress', 'mindfulness', 'relaxation', 'calming', 'sensory']
  },
  {
    id: 'prod-4',
    name: 'Self-Help Books Bundle',
    description: 'A curated set of three books in Nepali and English focusing on cognitive strategies, coping mechanisms, and personal habit formation.',
    price: 950,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    isComingSoon: false,
    category: 'Literary Care',
    tags: ['mental health', 'self-help', 'habits', 'coping', 'book']
  },
  {
    id: 'prod-5',
    name: 'Organic Himalayan Herbal Infusions',
    description: 'All-natural sleep and calm chamomile, nettle, and lemongrass loose teas ethically harvested high in the cold regions of Solukhumbu.',
    price: 600,
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400',
    isComingSoon: false,
    category: 'Organic Nutrition',
    tags: ['calm', 'sleep', 'tea', 'herbal', 'relaxation']
  },
  {
    id: 'prod-6',
    name: 'Premium Mindfulness Journal',
    description: 'Beautifully crafted paper journal using local lokta-wood fibers, with 90 days of structured daily habits, gratitude lists, and clinical coping exercises.',
    price: 850,
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=400',
    isComingSoon: false,
    category: 'Literary Care',
    tags: ['journal', 'mindfulness', 'gratitude', 'coping', 'self-care']
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    category: 'Anxiety',
    title: 'Understanding Anxiety: A Nepali Cultural Perspective',
    excerpt: 'Anxiety presents differently across mental frameworks and languages. We explore how cultural idioms such as â€œTension Bhoâ€ relate to standard stress metrics.',
    content: `
Anxiety from a clinical perspective measures a sustained feeling of worry and physical muscle tension. However, in Nepal, mental frameworks are tightly interwoven with family dynamics and community environments. Rather than saying "I have Generalized Anxiety Disorder," people often use the phrase "Tension Bho" or describe physical symptoms with local context.

### Idioms of Distress: The "Tension Bho" phenomenon
Often, a mental distress statement like "Tension ko dukhbe" represents somatic anxiety expressions. These include:
- Sleep disturbances.
- Sensation of heat climbing through the back or shoulders.
- Feelings of heavy responsibility ("Jimmebaari").

### Culturing the Coping Mechanism
Addressing anxiety isn't merely about personal cognitive drills. In Kathmandu and surrounding rural neighborhoods, healing involves:
1. Destigmatizing discussions at tea shops and family dining tables.
2. Promoting the balance of personal space within communal family structures.
3. Engaging accredited therapists who respect local values.

Our research shows that simple GAD-7 assessments help contextualize these somatic symptoms, mapping them to validated treatment plans that respect traditional support systems while introducing evidence-based tools.
    `,
    coverImage: 'https://images.unsplash.com/photo-1474418397713-7dedd1186594?auto=format&fit=crop&q=80&w=500',
    author: 'Dr. Niranjan Subedi',
    date: 'May 12, 2026',
    readTime: '5 min read'
  },
  {
    id: 'blog-2',
    category: 'Mindfulness',
    title: '5 Mindfulness Techniques for Busy Professionals in Kathmandu',
    excerpt: 'Kathmandu commute and work culture can induce high mental fatigue. Here are five simple traditional and scientific habits to preserve your calm.',
    content: `
Kathmandu is beautiful, vibrant, but can be overwhelming with traffic noise, pollution, and fast-paced professional demands. Overriding professional stress requires deliberate, short mental interventions.

### 1. Himalayan Mountain Visualizations (3 minutes)
During your morning commute, sit comfortably, close your eyes (if not driving), and visualize the immovable stillness of Mount Annapurna. Focus on breathing uniformly.

### 2. Lock-Step Breathing (Samavritti)
Standardize your inhale and exhale ratios to 4 seconds each. Perform this prior to opening your workplace inbox. This downregulates your sympathetic nervous system instantly.

### 3. Digitally Detoxify by the Bagmati
Set aside 1 hour on Saturday mornings near nature spots, such as Shivapuri Forest, completely offline. Observe surrounding birds and ambient sound without reaching for your phone.

### 4. Hydration with Intention
Assign mental check-ins to water breaks. Every time you finish a glass of tea or water, check your posture, drop your shoulders, and loosen your jaw.

### 5. Somatic Body Scans
Lie down on an even floor before sleeping. Focus attention sequentially from your toes to your forehead, letting go of cached stress in major muscle groups.
    `,
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=500',
    author: 'Samikshya Adhikari',
    date: 'May 20, 2026',
    readTime: '4 min read'
  },
  {
    id: 'blog-3',
    category: 'Anti-Stigma',
    title: 'Breaking the Mental Health Stigma in Nepal’s Education Systems',
    excerpt: 'Academic pressure on students causes severe underlying anxiety. Learn how modern student intervention models are making school environments psychological safe zones.',
    content: `
Youth face incredible pressure—from SEE exams to tuition, parental expectations, and digital fatigue. The stigma of seeking guidance often keeps valuable young minds in isolated pain.

### The Source of Academic Burnout
Students are constantly evaluated by quantitative metrics, with minimal space allocated for qualitative mental safety checks. The cultural habit of keeping struggles silent prevents timely discovery.

### What Caregivers Can Do
1. Establish peer support programs where pupils can talk anonymously.
2. Conduct regular clinical workshops with experts to humanize mental health care.
3. Place validated screening toolkits like GAD-7 and PHQ-9 easily inside school portals without tracking personal identifiers publicly.

### Bridging the Care Gap
By training local teachers to recognize secondary warning signals (withdrawal, grades dip, sudden absences), we can allocate professionals timely. Let’s change the educational environment together.
    `,
    coverImage: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=500',
    author: 'Prof. Ramesh Bhattarai',
    date: 'May 28, 2026',
    readTime: '6 min read'
  }
];

export interface TestQuestion {
  id: string;
  text: string;
}

export const PHQ9_QUESTIONS: TestQuestion[] = [
  { id: 'q1', text: 'Little interest or pleasure in doing things?' },
  { id: 'q2', text: 'Feeling down, depressed, or hopeless?' },
  { id: 'q3', text: 'Trouble falling or staying asleep, or sleeping too much?' },
  { id: 'q4', text: 'Feeling tired or having little energy?' },
  { id: 'q5', text: 'Poor appetite or overeating?' },
  { id: 'q6', text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down?' },
  { id: 'q7', text: 'Trouble concentrating on things, such as reading the newspaper or watching television?' },
  { id: 'q8', text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?' },
  { id: 'q9', text: 'Thoughts that you would be better off dead or of hurting yourself in some way?' }
];

export const GAD7_QUESTIONS: TestQuestion[] = [
  { id: 'q1', text: 'Feeling nervous, anxious, or on edge?' },
  { id: 'q2', text: 'Not being able to stop or control worrying?' },
  { id: 'q3', text: 'Worrying too much about different things?' },
  { id: 'q4', text: 'Trouble relaxing?' },
  { id: 'q5', text: 'Being so restless that it is hard to sit still?' },
  { id: 'q6', text: 'Becoming easily annoyed or irritable?' },
  { id: 'q7', text: 'Feeling afraid as if something awful might happen?' }
];

export const PSS10_QUESTIONS: TestQuestion[] = [
  { id: 'q1', text: 'In the last month, how often have you been upset because of something that happened unexpectedly?' },
  { id: 'q2', text: 'In the last month, how often have you felt that you were unable to control the important things in your life?' },
  { id: 'q3', text: 'In the last month, how often have you felt nervous and "stressed"?' },
  { id: 'q4', text: 'In the last month, how often have you felt confident about your ability to handle your personal problems? (Positive item)' },
  { id: 'q5', text: 'In the last month, how often have you felt that things were going your way? (Positive item)' },
  { id: 'q6', text: 'In the last month, how often have you found that you could not cope with all the things that you had to do?' },
  { id: 'q7', text: 'In the last month, how often have you been able to control irritations in your life? (Positive item)' },
  { id: 'q8', text: 'In the last month, how often have you felt that you were on top of things? (Positive item)' },
  { id: 'q9', text: 'In the last month, how often have you been angered because of things that were outside of your control?' },
  { id: 'q10', text: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?' }
];

export const REVERSE_PSS10_KEYS = ['q4', 'q5', 'q7', 'q8'];

// Seed data for database initialization
export const SEED_SUBMISSIONS: ContactSubmission[] = [
  {
    id: 'sub-seed-1',
    name: 'Manoj Khadka',
    email: 'manoj.khadka@outlook.com',
    phone: '9841556622',
    serviceInterest: 'Corporate Wellness Programs',
    message: 'Hello, we are looking for a mental resilience diagnostic workshop for 140 developers at our tech startup in Kathmandu (Baneshwor). Do you provide localized physical guides?',
    submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'new'
  },
  {
    id: 'sub-seed-2',
    name: 'Priyanka Shrestha',
    email: 'priya08@gmail.com',
    phone: '9801223344',
    serviceInterest: 'Mental Health Counseling',
    message: 'Does Nepa Health offer direct virtual consultations for teenagers facing high parental strain? My younger sister is experiencing burnout from exams.',
    submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'new'
  }
];

export const SEED_ASSESSMENTS: SelfAssessmentResult[] = [
  {
    id: 'asmt-seed-1',
    testName: 'GAD-7',
    userName: 'Kiran B. (Lalitpur)',
    scores: {
      score: 11,
      maxScore: 21,
      bandCode: 'moderate',
      bandLabel: 'Moderate Anxiety Severity',
      bandColor: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    answers: {},
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    recommendations: ['Adopt the Lok-Step breathing loop hourly', 'Practice Himalayan visualization'],
    analysisSummary: 'Your score shows moderate anxiety. This result means it would help to use calming routines and connect with a counselor if symptoms continue.'
  },
  {
    id: 'asmt-seed-2',
    testName: 'PHQ-9',
    userName: 'Sunita D. (Pokhara)',
    scores: {
      score: 6,
      maxScore: 27,
      bandCode: 'mild',
      bandLabel: 'Mild Depression Severity',
      bandColor: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    },
    answers: {},
    submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    recommendations: ['Consider journaling', 'Read blog articles about sleep hygiene'],
    analysisSummary: 'Your score is in the mild depression range. Keep tracking your mood and seek guidance from a counselor if these feelings persist.'
  },
  {
    id: 'asmt-seed-3',
    testName: 'PSS-10',
    userName: 'Aayush S. (Kathmandu)',
    scores: {
      score: 18,
      maxScore: 40,
      bandCode: 'moderate',
      bandLabel: 'Moderate Stress Severity',
      bandColor: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    answers: {},
    submittedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    recommendations: ['Engage in morning meditation', 'Limit social media scrolls'],
    analysisSummary: 'Your score reflects moderate perceived stress. It is useful to build in recovery time and speak with a counselor if the pressure persists.'
  }
];
