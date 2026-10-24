export type Pathway = {
  slug: string;
  title: string;
  short: string;
  description: string;
  outcome: string;
  color: string;
  steps: { title: string; focus: string; action: string; courseSearch: string }[];
};

export const pathways: Pathway[] = [
  {
    slug: "personal-mastery",
    title: "Personal mastery",
    short: "Build the habits and self-awareness that make progress sustainable.",
    description: "A practical route to understanding how you work, managing your time, and building habits that last.",
    outcome: "A steadier, more intentional way to learn and work.",
    color: "mint",
    steps: [
      { title: "Know your patterns", focus: "Notice what gives you energy, what distracts you, and where you want to grow.", action: "Write down one strength, one friction point, and one change you want to make.", courseSearch: "self improvement" },
      { title: "Make time for what matters", focus: "Turn priorities into a realistic plan for your week.", action: "Choose one important task and give it a protected time block.", courseSearch: "time management" },
      { title: "Build a small habit", focus: "Use a repeatable cue and a manageable action to make progress easier.", action: "Attach a five-minute learning habit to something you already do.", courseSearch: "habits" },
      { title: "Reflect and adjust", focus: "Review what worked, learn from what did not, and refine your next step.", action: "At the end of the week, keep one thing, change one thing, and choose one next step.", courseSearch: "personal growth" },
    ],
  },
  {
    slug: "leadership-communication",
    title: "Leadership & communication",
    short: "Grow the clarity, empathy, and follow-through that help teams thrive.",
    description: "Practice the human skills behind clear communication, dependable collaboration, and thoughtful leadership.",
    outcome: "More trust, clearer conversations, and stronger teamwork.",
    color: "violet",
    steps: [
      { title: "Listen to understand", focus: "Make space for different perspectives before moving to solutions.", action: "In your next conversation, summarize what you heard before responding.", courseSearch: "communication" },
      { title: "Share ideas clearly", focus: "Shape a message around its audience, purpose, and next action.", action: "Explain one idea in three parts: context, recommendation, next step.", courseSearch: "communication skills" },
      { title: "Give useful feedback", focus: "Make feedback specific, respectful, and connected to observable work.", action: "Pair one clear observation with one constructive question.", courseSearch: "leadership" },
      { title: "Build shared momentum", focus: "Create alignment with clear ownership and reliable follow-up.", action: "End a team discussion by confirming who owns the next step and when.", courseSearch: "teamwork" },
    ],
  },
  {
    slug: "career-momentum",
    title: "Career momentum",
    short: "Connect your strengths to meaningful goals and consistent action.",
    description: "Build a direction for your working life, develop useful capabilities, and make your progress visible.",
    outcome: "A clearer career direction backed by real examples of your growth.",
    color: "blue",
    steps: [
      { title: "Find your direction", focus: "Explore the work, problems, and environments that bring out your best.", action: "List three kinds of work you want more of and why they matter to you.", courseSearch: "career" },
      { title: "Map your strengths", focus: "Connect what you already do well with the needs of roles you care about.", action: "Choose one target role and identify one strength you can demonstrate.", courseSearch: "career development" },
      { title: "Grow a key skill", focus: "Choose a practical skill that moves you closer to your direction.", action: "Set a small weekly practice goal and create one sample of your work.", courseSearch: "professional skills" },
      { title: "Show your progress", focus: "Gather evidence of what you can do and communicate it with confidence.", action: "Write a short example describing a challenge, your action, and the result.", courseSearch: "career confidence" },
    ],
  },
  {
    slug: "focus-and-productivity",
    title: "Focus & productivity",
    short: "Protect your attention and turn important goals into steady progress.",
    description: "Create a calmer, more effective way to plan your work, focus deeply, and finish what matters.",
    outcome: "More meaningful progress with less scattered effort.",
    color: "lime",
    steps: [
      { title: "Choose the priority", focus: "Separate meaningful outcomes from the noise of an overfull task list.", action: "Pick the one result that would make today feel worthwhile.", courseSearch: "priorities" },
      { title: "Plan your attention", focus: "Match focused work to the time and energy you have available.", action: "Schedule one distraction-free focus block and decide its finish line.", courseSearch: "time management" },
      { title: "Work in focused rounds", focus: "Use intentional work and recovery intervals to sustain attention.", action: "Try one focused 25-minute session followed by a short reset.", courseSearch: "focus" },
      { title: "Review your system", focus: "Notice what interrupts your flow and improve your setup over time.", action: "At week's end, remove one recurring distraction from your process.", courseSearch: "productivity" },
    ],
  },
];
