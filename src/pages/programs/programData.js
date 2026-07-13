export const PROGRAM_STORAGE_KEYS = {
  internshipApplications:
    "nexacore_internship_applications_v1",
  bootcampApplications:
    "nexacore_bootcamp_applications_v1",
};

export const internshipTracks = [
  {
    id: "software-engineering",
    title: "Software Engineering Internship",
    description:
      "Work in a guided product team building real frontend, backend, API and testing deliverables.",
    duration: "12 weeks",
    level: "Beginner to intermediate",
    image: "/images/hero/banner1.png",
    skills: [
      "React",
      "JavaScript",
      "Node.js",
      "Git and GitHub",
      "API Development",
      "Testing",
    ],
    outcomes: [
      "Build and document a production-style application",
      "Participate in code reviews and sprint planning",
      "Publish a verified portfolio project",
      "Receive mentor and performance feedback",
    ],
  },
  {
    id: "data-ai",
    title: "Data and AI Internship",
    description:
      "Analyse real datasets, build dashboards and complete a supervised AI or automation project.",
    duration: "12 weeks",
    level: "Beginner to intermediate",
    image: "/images/hero/banner2.png",
    skills: [
      "Excel",
      "SQL",
      "Power BI",
      "Python",
      "Data Cleaning",
      "Business Reporting",
    ],
    outcomes: [
      "Complete an end-to-end analytics project",
      "Present findings to a review panel",
      "Build a public dashboard portfolio",
      "Learn professional data documentation",
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Internship",
    description:
      "Practice security monitoring, risk assessment, incident response and defensive documentation.",
    duration: "12 weeks",
    level: "Intermediate",
    image: "/images/hero/banner3.png",
    skills: [
      "Security Fundamentals",
      "Network Security",
      "SOC Operations",
      "Risk Assessment",
      "Incident Reporting",
      "Linux",
    ],
    outcomes: [
      "Complete supervised security labs",
      "Write an incident-response report",
      "Build a risk-assessment portfolio case",
      "Receive practical readiness feedback",
    ],
  },
  {
    id: "design-product",
    title: "Design and Product Internship",
    description:
      "Join a product team from research and user flows through prototype, testing and design handoff.",
    duration: "12 weeks",
    level: "Beginner to intermediate",
    image: "/images/hero/banner4.png",
    skills: [
      "Figma",
      "UI/UX Design",
      "User Research",
      "Product Thinking",
      "Prototyping",
      "Design Systems",
    ],
    outcomes: [
      "Complete a full product case study",
      "Present research and design decisions",
      "Create a professional portfolio entry",
      "Practice developer handoff",
    ],
  },
  {
    id: "creative-media",
    title: "AI Video and Creative Media Internship",
    description:
      "Produce campaign content, AI-assisted video, animation and branded media under creative supervision.",
    duration: "12 weeks",
    level: "Beginner to intermediate",
    image: "/images/hero/banner2.png",
    skills: [
      "AI Video",
      "Video Editing",
      "Motion Graphics",
      "Storyboarding",
      "Sound Design",
      "Content Production",
    ],
    outcomes: [
      "Produce a complete campaign video",
      "Create short-form social content",
      "Build a showreel",
      "Receive creative-direction feedback",
    ],
  },
  {
    id: "business-digital",
    title: "Business and Digital Internship",
    description:
      "Develop practical experience in digital marketing, project operations, virtual assistance and client support.",
    duration: "12 weeks",
    level: "Beginner",
    image: "/images/hero/banner3.png",
    skills: [
      "Digital Marketing",
      "Social Media",
      "Project Coordination",
      "Virtual Assistance",
      "Client Communication",
      "Reporting",
    ],
    outcomes: [
      "Manage a supervised digital campaign",
      "Prepare weekly performance reports",
      "Practice client communication",
      "Build an operations portfolio",
    ],
  },
];

export const bootcampTracks = [
  {
    id: "full-stack-development",
    title: "Full Stack Development Bootcamp",
    category: "Software Development",
    duration: "24 weeks",
    intensity: "Career intensive",
    priceNgn: 800000,
    priceUsd: 549,
    image: "/images/hero/banner1.png",
    modules: [
      "Web foundations and developer workflow",
      "JavaScript programming",
      "React and frontend architecture",
      "Backend development with Node.js",
      "Databases and PostgreSQL",
      "API design and authentication",
      "Testing and quality assurance",
      "Deployment and DevOps basics",
      "Team capstone project",
      "Career preparation and portfolio",
    ],
  },
  {
    id: "data-analysis",
    title: "Data Analysis Bootcamp",
    category: "Data and AI",
    duration: "16 weeks",
    intensity: "Professional certificate",
    priceNgn: 350000,
    priceUsd: 229,
    image: "/images/hero/banner2.png",
    modules: [
      "Data thinking and business questions",
      "Excel analytics",
      "SQL and relational databases",
      "Data cleaning",
      "Power BI",
      "Tableau fundamentals",
      "Python for data",
      "Statistics for analysts",
      "Business reporting",
      "Portfolio capstone",
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Bootcamp",
    category: "Cybersecurity",
    duration: "16 weeks",
    intensity: "Professional certificate",
    priceNgn: 350000,
    priceUsd: 229,
    image: "/images/hero/banner3.png",
    modules: [
      "Cybersecurity foundations",
      "Networking and protocols",
      "Linux administration",
      "Security operations",
      "Threats and vulnerabilities",
      "Ethical hacking fundamentals",
      "Cloud security",
      "GRC and risk management",
      "Incident response",
      "Security capstone",
    ],
  },
  {
    id: "ui-ux-product",
    title: "UI/UX and Product Design Bootcamp",
    category: "Design and Product",
    duration: "16 weeks",
    intensity: "Professional certificate",
    priceNgn: 350000,
    priceUsd: 229,
    image: "/images/hero/banner4.png",
    modules: [
      "Design principles",
      "User research",
      "Information architecture",
      "User flows and wireframes",
      "Figma mastery",
      "Visual interface design",
      "Prototyping",
      "Usability testing",
      "Design systems",
      "Portfolio case study",
    ],
  },
  {
    id: "ai-video-animation",
    title: "AI Video, Animation and Movie Production Bootcamp",
    category: "Videography and Creative Media",
    duration: "18 weeks",
    intensity: "Advanced professional",
    priceNgn: 500000,
    priceUsd: 329,
    image: "/images/hero/banner2.png",
    modules: [
      "Visual storytelling and script development",
      "Camera and composition fundamentals",
      "Professional video editing",
      "AI video tools and production workflow",
      "2D animation fundamentals",
      "3D animation introduction",
      "Motion graphics",
      "VFX and compositing",
      "Sound design and post-production",
      "Short-film or campaign capstone",
    ],
  },
  {
    id: "digital-business",
    title: "Digital Business and Professional Skills Bootcamp",
    category: "Business and Digital",
    duration: "12 weeks",
    intensity: "Career foundation",
    priceNgn: 250000,
    priceUsd: 169,
    image: "/images/hero/banner3.png",
    modules: [
      "Professional communication",
      "Critical thinking and problem solving",
      "Digital marketing",
      "Social media management",
      "SEO fundamentals",
      "Project management",
      "Agile and Scrum",
      "Virtual assistance",
      "Tech sales and client success",
      "Career readiness and personal branding",
    ],
  },
];

export const internshipTimeline = [
  {
    week: "Week 1",
    title: "Orientation and professional readiness",
    description:
      "Onboarding, communication standards, tools, role expectations and personal development goals.",
  },
  {
    week: "Weeks 2–4",
    title: "Guided practice",
    description:
      "Structured tasks, mentor demonstrations, feedback cycles and technical or creative exercises.",
  },
  {
    week: "Weeks 5–8",
    title: "Team project delivery",
    description:
      "Participants work in supervised teams using sprints, reviews, documentation and client-style requirements.",
  },
  {
    week: "Weeks 9–11",
    title: "Capstone and portfolio",
    description:
      "Each intern completes a substantial portfolio project and prepares a professional presentation.",
  },
  {
    week: "Week 12",
    title: "Assessment and transition",
    description:
      "Final review, certificate decision, performance report and transition into talent, employment or advanced study.",
  },
];

export const bootcampBenefits = [
  "Deep curriculum with practical modules",
  "Live tutor-led classes",
  "Recorded lessons and learning materials",
  "Assignments and graded projects",
  "Mentor and peer support",
  "Capstone portfolio project",
  "Career-readiness and soft-skills training",
  "Certificate after successful completion",
  "Optional internship pathway",
  "Talent marketplace profile after readiness review",
];

export function loadProgramValue(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function saveProgramValue(key, value) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value),
    );
  } catch {
    // The preview remains usable without browser storage.
  }
}

export function formatProgramMoney(
  value,
  currency = "USD",
) {
  return new Intl.NumberFormat(
    currency === "NGN" ? "en-NG" : "en-US",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(Number(value || 0));
}

export function submitProgramApplication(
  type,
  form,
) {
  const key =
    type === "internship"
      ? PROGRAM_STORAGE_KEYS.internshipApplications
      : PROGRAM_STORAGE_KEYS.bootcampApplications;

  const existing = loadProgramValue(key, []);

  const application = {
    id: `${
      type === "internship" ? "INT" : "BOOT"
    }-${Date.now()}`,
    type,
    ...form,
    status: "submitted",
    submittedAt: new Date().toISOString(),
  };

  saveProgramValue(key, [
    application,
    ...existing,
  ]);

  return application;
}
