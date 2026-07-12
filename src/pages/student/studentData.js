export const STORAGE_KEYS = {
  profile: "nexacore_student_profile_v3",
  enrollments: "nexacore_student_enrollments_v3",
  learning: "nexacore_student_learning_v3",
  messages: "nexacore_student_messages_v3",
  notifications: "nexacore_student_notifications_v3",
};


export const CURRENCY_OPTIONS = [
  {
    code: "NGN",
    label: "Nigerian Naira",
    symbol: "₦",
  },
  {
    code: "USD",
    label: "US Dollar",
    symbol: "$",
  },
];

export const COURSE_PRICE_TIERS = {
  soft: {
    label: "Professional foundation",
    NGN: 150000,
    USD: 99,
  },
  foundation: {
    label: "Career foundation",
    NGN: 220000,
    USD: 149,
  },
  professional: {
    label: "Professional certificate",
    NGN: 350000,
    USD: 229,
  },
  advanced: {
    label: "Advanced professional",
    NGN: 500000,
    USD: 329,
  },
  specialist: {
    label: "Specialist programme",
    NGN: 650000,
    USD: 429,
  },
  intensive: {
    label: "Career intensive",
    NGN: 800000,
    USD: 549,
  },
};

const categoryDefaultPriceTiers = {
  "software-development": "professional",
  "data-ai": "professional",
  cybersecurity: "advanced",
  "cloud-devops": "advanced",
  "design-product": "professional",
  "business-digital": "foundation",
  "emerging-skills": "foundation",
  "videography-creative-media": "professional",
  "professional-soft-skills": "soft",
};

const intensiveCourseTitles = new Set([
  "Full Stack Development",
  "AI and Machine Learning",
  "DevOps Engineering",
  "Movie Production and Directing",
]);

const specialistCourseTitles = new Set([
  "Mobile App Development",
  "Data Science",
  "Data Engineering",
  "Ethical Hacking",
  "Cloud Security",
  "SOC Analyst Training",
  "AWS",
  "Azure",
  "Kubernetes",
  "3D Animation",
  "VFX and Compositing",
  "Cinematography and Film Production",
]);

const advancedCourseTitles = new Set([
  "Backend Development",
  "API Development",
  "Business Intelligence",
  "Network Security",
  "GRC and Risk Management",
  "Cloud Computing",
  "Docker",
  "CI/CD",
  "Linux Administration",
  "Product Management",
  "AI Automation",
  "Robotics Introduction",
  "IoT Basics",
  "AI Video Creation",
  "Motion Graphics",
  "2D Animation",
  "Video Editing and Post-Production",
  "Sound Design and Audio Post-Production",
]);

const softCourseTitles = new Set([
  "Communication and Public Speaking",
  "Emotional Intelligence",
  "Time Management and Productivity",
  "Career Development and Personal Branding",
  "Business Writing and Professional Etiquette",
  "Customer Service Excellence",
  "Remote Work and Collaboration",
  "Interview and Workplace Readiness",
]);

function resolveCoursePriceTier(categoryId, title) {
  if (intensiveCourseTitles.has(title)) {
    return "intensive";
  }

  if (specialistCourseTitles.has(title)) {
    return "specialist";
  }

  if (advancedCourseTitles.has(title)) {
    return "advanced";
  }

  if (softCourseTitles.has(title)) {
    return "soft";
  }

  return categoryDefaultPriceTiers[categoryId] || "professional";
}

export function detectPreferredCurrency() {
  if (typeof window === "undefined") {
    return "NGN";
  }

  try {
    const savedCurrency = window.localStorage.getItem(
      "nexacore_preferred_currency",
    );

    if (
      savedCurrency === "NGN" ||
      savedCurrency === "USD"
    ) {
      return savedCurrency;
    }
  } catch {
    // Continue with browser-based detection.
  }

  const locale =
    typeof navigator !== "undefined"
      ? navigator.language || ""
      : "";

  let timeZone = "";

  try {
    timeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    timeZone = "";
  }

  const isNigeria =
    locale.toUpperCase().endsWith("-NG") ||
    timeZone === "Africa/Lagos";

  return isNigeria ? "NGN" : "USD";
}

export function setPreferredCurrency(currency) {
  if (
    currency !== "NGN" &&
    currency !== "USD"
  ) {
    return;
  }

  try {
    window.localStorage.setItem(
      "nexacore_preferred_currency",
      currency,
    );
  } catch {
    // The currency selector still works for the current page.
  }
}


const categorySeeds = [
  {
    id: "software-development",
    name: "Software Development",
    description:
      "Build production-ready web, mobile and backend systems using modern engineering practices.",
    image: "/images/hero/banner1.png",
    basePrice: 55000,
    duration: "16 weeks",
    tutor: {
      id: "TUTOR-SD-01",
      name: "Adaeze Okafor",
      initials: "AO",
      title: "Lead Software Engineering Tutor",
      online: true,
    },
    courses: [
      "Full Stack Development",
      "Frontend Development",
      "Backend Development",
      "Mobile App Development",
      "API Development",
      "Software Testing and QA",
      "Git and GitHub",
    ],
  },
  {
    id: "data-ai",
    name: "Data and AI",
    description:
      "Learn analytics, business intelligence, data engineering and artificial intelligence from foundations to applied projects.",
    image: "/images/hero/banner2.png",
    basePrice: 52000,
    duration: "16 weeks",
    tutor: {
      id: "TUTOR-DA-01",
      name: "Daniel Mensah",
      initials: "DM",
      title: "Lead Data and AI Tutor",
      online: false,
    },
    courses: [
      "Data Analysis",
      "Data Science",
      "AI and Machine Learning",
      "Data Engineering",
      "Business Intelligence",
      "SQL",
      "Power BI",
      "Tableau",
      "Excel Analytics",
      "Python for Data",
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description:
      "Develop defensive, offensive, governance and risk skills for modern digital environments.",
    image: "/images/hero/banner3.png",
    basePrice: 56000,
    duration: "16 weeks",
    tutor: {
      id: "TUTOR-CY-01",
      name: "Ibrahim Musa",
      initials: "IM",
      title: "Lead Cybersecurity Tutor",
      online: true,
    },
    courses: [
      "Cybersecurity Fundamentals",
      "Ethical Hacking",
      "Network Security",
      "Cloud Security",
      "SOC Analyst Training",
      "GRC and Risk Management",
    ],
  },
  {
    id: "cloud-devops",
    name: "Cloud and DevOps",
    description:
      "Deploy, automate and operate reliable infrastructure using cloud platforms, containers and delivery pipelines.",
    image: "/images/hero/banner4.png",
    basePrice: 62000,
    duration: "16 weeks",
    tutor: {
      id: "TUTOR-CD-01",
      name: "Grace Nwosu",
      initials: "GN",
      title: "Cloud and DevOps Tutor",
      online: true,
    },
    courses: [
      "Cloud Computing",
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "DevOps Engineering",
      "CI/CD",
      "Linux Administration",
    ],
  },
  {
    id: "design-product",
    name: "Design and Product",
    description:
      "Research, design and manage digital products that solve real user and business problems.",
    image: "/images/hero/banner1.png",
    basePrice: 47000,
    duration: "14 weeks",
    tutor: {
      id: "TUTOR-DP-01",
      name: "Mariam Bello",
      initials: "MB",
      title: "Lead Product Design Tutor",
      online: false,
    },
    courses: [
      "UI/UX Design",
      "Product Design",
      "Graphic Design",
      "Design Systems",
      "Product Management",
      "User Research",
      "Figma Mastery",
    ],
  },
  {
    id: "business-digital",
    name: "Business and Digital",
    description:
      "Build practical digital business, marketing, project delivery and commercial skills.",
    image: "/images/hero/banner2.png",
    basePrice: 38000,
    duration: "12 weeks",
    tutor: {
      id: "TUTOR-BD-01",
      name: "Samuel Adeyemi",
      initials: "SA",
      title: "Digital Business Tutor",
      online: true,
    },
    courses: [
      "Social Media Management",
      "Digital Marketing",
      "SEO",
      "Project Management",
      "Agile and Scrum",
      "Tech Sales",
      "Virtual Assistance",
      "No-Code Tools",
    ],
  },
  {
    id: "emerging-skills",
    name: "Emerging Skills",
    description:
      "Explore fast-growing technologies and apply them responsibly to business and society.",
    image: "/images/hero/banner3.png",
    basePrice: 45000,
    duration: "12 weeks",
    tutor: {
      id: "TUTOR-ES-01",
      name: "Chika Eze",
      initials: "CE",
      title: "Emerging Technology Tutor",
      online: true,
    },
    courses: [
      "Blockchain Basics",
      "Prompt Engineering",
      "AI Automation",
      "Data Privacy",
      "Robotics Introduction",
      "IoT Basics",
      "Low-Code App Building",
    ],
  },
  {
    id: "videography-creative-media",
    name: "Videography, Animation and Creative Media",
    description:
      "Master visual storytelling, film production, editing, animation, AI video and post-production for cinema and digital platforms.",
    image: "/images/hero/banner4.png",
    basePrice: 50000,
    duration: "16 weeks",
    tutor: {
      id: "TUTOR-VC-01",
      name: "Tobi Akinola",
      initials: "TA",
      title: "Film, Animation and Creative Media Tutor",
      online: true,
    },
    courses: [
      "Videography Fundamentals",
      "Cinematography and Film Production",
      "Video Editing and Post-Production",
      "AI Video Creation",
      "Motion Graphics",
      "2D Animation",
      "3D Animation",
      "Movie Production and Directing",
      "Documentary Production",
      "YouTube and Social Media Content Creation",
      "Sound Design and Audio Post-Production",
      "VFX and Compositing",
      "Scriptwriting and Storyboarding",
    ],
  },
  {
    id: "professional-soft-skills",
    name: "Professional and Soft Skills",
    description:
      "Develop communication, leadership, workplace effectiveness and career skills required for long-term professional success.",
    image: "/images/hero/banner1.png",
    basePrice: 30000,
    duration: "8 weeks",
    tutor: {
      id: "TUTOR-PS-01",
      name: "Ifeoma Okeke",
      initials: "IO",
      title: "Professional Development Tutor",
      online: false,
    },
    courses: [
      "Communication and Public Speaking",
      "Leadership and Team Management",
      "Critical Thinking and Problem Solving",
      "Emotional Intelligence",
      "Time Management and Productivity",
      "Career Development and Personal Branding",
      "Business Writing and Professional Etiquette",
      "Negotiation and Conflict Resolution",
      "Customer Service Excellence",
      "Entrepreneurship and Business Fundamentals",
      "Remote Work and Collaboration",
      "Interview and Workplace Readiness",
    ],
  },
];

const specialisedCurricula = {
  "Full Stack Development": [
    "Web Architecture, Internet Foundations and Developer Setup",
    "Semantic HTML, Modern CSS and Responsive Interfaces",
    "JavaScript, TypeScript and Application Logic",
    "React Components, State, Routing and Frontend Architecture",
    "Node.js, Express and Server-Side Development",
    "Relational and NoSQL Database Design",
    "Authentication, Authorization, Security and Testing",
    "REST APIs, Integrations and File Handling",
    "Deployment, Monitoring and DevOps Fundamentals",
    "Professional Full Stack Capstone",
  ],
  "Frontend Development": [
    "Web Foundations and Accessible HTML",
    "CSS Layout, Responsive Design and Design Translation",
    "JavaScript Programming for Interfaces",
    "TypeScript for Reliable Frontend Applications",
    "React Components, Props and State",
    "Routing, Forms, Data Fetching and API Integration",
    "Testing, Accessibility and Performance",
    "State Management and Frontend Architecture",
    "Deployment, Analytics and Production Monitoring",
    "Professional Frontend Portfolio Project",
  ],
  "Data Analysis": [
    "Data Questions, Metrics and Analytical Thinking",
    "Spreadsheet Analysis and Data Quality",
    "SQL for Querying and Validation",
    "Data Cleaning and Transformation",
    "Exploratory Data Analysis and Descriptive Statistics",
    "Data Visualisation and Storytelling",
    "Business Intelligence Dashboards",
    "Interpretation, Bias and Responsible Analysis",
    "Stakeholder Reporting and Decision Support",
    "End-to-End Data Analysis Capstone",
  ],
  "AI and Machine Learning": [
    "AI Foundations, Problem Framing and Responsible Use",
    "Python, NumPy, Pandas and Data Preparation",
    "Probability, Statistics and Linear Algebra Essentials",
    "Supervised Learning and Model Evaluation",
    "Unsupervised Learning and Feature Engineering",
    "Neural Networks and Deep Learning Foundations",
    "Natural Language Processing and Computer Vision",
    "Model Deployment, APIs and MLOps",
    "Bias, Explainability, Privacy and AI Governance",
    "Production Machine Learning Capstone",
  ],
  "Cybersecurity Fundamentals": [
    "Security Principles, Threats and the CIA Triad",
    "Networks, Protocols and Secure Architecture",
    "Identity, Authentication and Access Control",
    "Operating System and Endpoint Security",
    "Cryptography and Data Protection",
    "Vulnerability Management and Security Testing",
    "Monitoring, Detection and Incident Response",
    "Cloud, Web and Application Security Foundations",
    "Governance, Risk, Compliance and Security Ethics",
    "Small Business Security Assessment Capstone",
  ],
  "AWS": [
    "Cloud Concepts and AWS Global Infrastructure",
    "Identity and Access Management",
    "Compute with EC2, Lambda and Containers",
    "Storage with S3, EBS and Archival Services",
    "Networking with VPC, Subnets and Load Balancing",
    "Managed Databases and Data Services",
    "High Availability, Backup and Disaster Recovery",
    "Monitoring, Logging, Security and Cost Management",
    "Infrastructure as Code and Automated Deployment",
    "AWS Solution Architecture Capstone",
  ],
  "UI/UX Design": [
    "Human-Centred Design and Product Thinking",
    "User Research Planning and Interviewing",
    "Personas, Journey Maps and Problem Definition",
    "Information Architecture and User Flows",
    "Wireframing and Interaction Design",
    "Visual Design, Typography and Colour Systems",
    "Prototyping and Usability Testing",
    "Accessibility and Inclusive Design",
    "Design Handoff, Collaboration and Portfolio Storytelling",
    "End-to-End Product Design Case Study",
  ],
  "Digital Marketing": [
    "Digital Strategy, Audience and Funnel Design",
    "Brand Positioning and Content Planning",
    "Social Media Campaign Management",
    "Search Engine Optimisation",
    "Paid Advertising and Media Buying",
    "Email Marketing and Marketing Automation",
    "Landing Pages and Conversion Optimisation",
    "Analytics, Attribution and Reporting",
    "Budgeting, Ethics and Campaign Governance",
    "Integrated Digital Marketing Campaign Capstone",
  ],
  "Prompt Engineering": [
    "Generative AI Foundations and Model Behaviour",
    "Prompt Structure, Context and Instruction Design",
    "Zero-Shot, Few-Shot and Example-Driven Prompting",
    "Reasoning Tasks, Tool Use and Structured Outputs",
    "Prompt Evaluation, Testing and Iteration",
    "Retrieval-Augmented Generation Foundations",
    "Multimodal Prompting for Text, Image, Audio and Video",
    "Safety, Privacy, Bias and Responsible AI",
    "Prompt Libraries, Workflows and Team Standards",
    "Business Prompt Engineering Capstone",
  ],
  "AI Video Creation": [
    "AI Video Ecosystem, Ethics and Creative Direction",
    "Concept Development, Audience and Visual Briefs",
    "Prompting for Characters, Scenes and Continuity",
    "Image-to-Video and Text-to-Video Workflows",
    "AI Avatars, Voice, Lip Sync and Localisation",
    "Camera Motion, Composition, Lighting and Style Control",
    "Editing, Sound, Music and Post-Production",
    "Consistency, Copyright, Consent and Deepfake Safety",
    "Campaign, Film and Social Media Production Pipelines",
    "Professional AI Video Short Film Capstone",
  ],
  "Movie Production and Directing": [
    "Film Language, Genres and Visual Storytelling",
    "Script Analysis and Directorial Interpretation",
    "Pre-Production, Budgeting and Production Planning",
    "Casting, Rehearsal and Working with Actors",
    "Shot Design, Blocking and Camera Direction",
    "Lighting, Production Design and Sound Collaboration",
    "Directing the Set and Managing the Crew",
    "Editing Supervision, Music and Post-Production",
    "Distribution, Festivals, Marketing and Legal Basics",
    "Directed Short Movie Capstone",
  ],
  "Communication and Public Speaking": [
    "Communication Foundations and Audience Awareness",
    "Message Structure, Clarity and Persuasion",
    "Voice, Diction, Pace and Vocal Confidence",
    "Body Language and Stage Presence",
    "Storytelling for Professional Communication",
    "Presentation Design and Visual Support",
    "Managing Anxiety and Handling Questions",
    "Meetings, Interviews and Workplace Communication",
    "Virtual Presentation and Media Communication",
    "Recorded Professional Speech Capstone",
  ],
  "Leadership and Team Management": [
    "Leadership Foundations and Self-Awareness",
    "Leadership Styles and Situational Leadership",
    "Building Trust, Purpose and Team Culture",
    "Delegation, Accountability and Performance",
    "Coaching, Feedback and Talent Development",
    "Decision-Making and Problem Solving",
    "Conflict Management and Difficult Conversations",
    "Change Leadership and Stakeholder Alignment",
    "Ethics, Inclusion and Psychological Safety",
    "Team Leadership Improvement Project",
  ],
};

const categoryCurriculumTemplates = {
  "software-development": [
    "Industry Foundations and Professional Tooling",
    "Core Programming Concepts and Problem Solving",
    "Architecture, Components and Data Flow",
    "Practical Development Workflow",
    "Testing, Debugging and Quality Assurance",
    "Security, Performance and Reliability",
    "Integration with APIs and External Services",
    "Team Collaboration, Git and Documentation",
    "Deployment and Production Readiness",
    "Professional Capstone and Portfolio Presentation",
  ],
  "data-ai": [
    "Data and AI Foundations",
    "Tools, Environments and Data Acquisition",
    "Data Cleaning, Validation and Transformation",
    "Core Analytical or Modelling Methods",
    "Visualisation, Interpretation and Communication",
    "Applied Business or Research Workflow",
    "Automation, Integration and Reproducibility",
    "Quality, Ethics, Privacy and Bias",
    "Deployment or Stakeholder Delivery",
    "Professional Data and AI Capstone",
  ],
  cybersecurity: [
    "Security Foundations and Threat Landscape",
    "Systems, Networks and Technical Environment",
    "Threat Identification and Vulnerability Analysis",
    "Security Controls and Defensive Practice",
    "Monitoring, Testing and Evidence Collection",
    "Incident Handling and Recovery",
    "Cloud, Application and Data Protection",
    "Governance, Ethics and Legal Responsibilities",
    "Security Reporting and Stakeholder Communication",
    "Professional Cybersecurity Capstone",
  ],
  "cloud-devops": [
    "Infrastructure and Cloud Foundations",
    "Linux, Networking and Environment Setup",
    "Platform Services and Resource Management",
    "Automation and Infrastructure as Code",
    "Containers and Orchestration",
    "CI/CD and Release Engineering",
    "Observability, Reliability and Incident Response",
    "Security, Cost and Governance",
    "Scalable Architecture and Production Operations",
    "Cloud and DevOps Capstone",
  ],
  "design-product": [
    "Design and Product Foundations",
    "Research, Users and Market Context",
    "Problem Definition and Product Strategy",
    "Information Architecture and Workflow Design",
    "Visual, Interaction and Content Design",
    "Prototyping and Validation",
    "Accessibility, Inclusion and Design Ethics",
    "Collaboration, Handoff and Product Delivery",
    "Portfolio Case Study Development",
    "Professional Product Capstone",
  ],
  "business-digital": [
    "Business and Digital Foundations",
    "Audience, Customer and Market Analysis",
    "Strategy, Planning and Goal Setting",
    "Tools, Platforms and Operational Workflow",
    "Campaign or Project Execution",
    "Communication, Sales and Stakeholder Management",
    "Measurement, Analytics and Optimisation",
    "Risk, Ethics and Professional Standards",
    "Scaling, Automation and Process Improvement",
    "Business and Digital Capstone",
  ],
  "emerging-skills": [
    "Technology Foundations and Industry Context",
    "Core Concepts, Vocabulary and Architecture",
    "Tools, Platforms and Guided Labs",
    "Practical Use Cases and Workflow Design",
    "Integration, Automation and Data Flow",
    "Security, Privacy and Responsible Innovation",
    "Testing, Evaluation and Quality Control",
    "Business Adoption and Change Management",
    "Prototype Development and Presentation",
    "Emerging Technology Capstone",
  ],
  "videography-creative-media": [
    "Creative Industry Foundations and Visual Storytelling",
    "Concept Development, Research and Creative Briefs",
    "Production Tools, Equipment and Technical Setup",
    "Composition, Lighting, Movement and Performance",
    "Production Workflow and On-Set Practice",
    "Editing, Sound and Post-Production",
    "Animation, Effects and Advanced Creative Techniques",
    "Copyright, Consent, Ethics and Media Safety",
    "Distribution, Audience Growth and Monetisation",
    "Professional Creative Media Capstone",
  ],
  "professional-soft-skills": [
    "Self-Awareness and Professional Foundations",
    "Core Concepts and Practical Frameworks",
    "Communication and Relationship Skills",
    "Decision-Making and Problem Solving",
    "Workplace Application and Role-Play Practice",
    "Feedback, Reflection and Continuous Improvement",
    "Digital, Remote and Cross-Cultural Application",
    "Ethics, Inclusion and Professional Conduct",
    "Career Application and Personal Action Plan",
    "Professional Skills Capstone",
  ],
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildLessons(courseId, categoryId, title) {
  const moduleTitles =
    specialisedCurricula[title] ||
    categoryCurriculumTemplates[categoryId].map((moduleTitle) =>
      moduleTitle.replace(
        "Foundations",
        `${title} Foundations`,
      ),
    );

  return moduleTitles.map((moduleTitle, index) => ({
    id: courseId * 100 + index + 1,
    module: index + 1,
    title: moduleTitle,
    duration:
      index % 3 === 0
        ? "1 hour 20 minutes"
        : index % 3 === 1
          ? "1 hour"
          : "1 hour 10 minutes",
    description: `A detailed learning module that develops practical competence in ${moduleTitle.toLowerCase()}.`,
    topics: [
      "Concept explanation",
      "Tutor demonstration",
      "Guided practice",
      "Independent exercise",
      "Knowledge check",
    ],
  }));
}

function buildCourse({
  id,
  category,
  title,
  courseIndex,
}) {
  const priceTier = resolveCoursePriceTier(
    category.id,
    title,
  );
  const prices = COURSE_PRICE_TIERS[priceTier];
  const lessons = buildLessons(id, category.id, title);
  const tutorName = category.tutor.name;

  return {
    id,
    slug: slugify(title),
    title,
    category: category.name,
    categoryId: category.id,
    categoryDescription: category.description,
    image: category.image,
    price: prices.NGN,
    prices: {
      NGN: prices.NGN,
      USD: prices.USD,
    },
    priceTier,
    priceTierLabel: prices.label,
    duration: category.duration,
    level: "Beginner to professional",
    delivery: "Live classes, guided practice and projects",
    cohort: `${title} Cohort ${String.fromCharCode(
      65 + (courseIndex % 4),
    )}`,
    tutor: category.tutor,
    classmates: [
      {
        id: `STD-${id}-01`,
        name: "Amaka Eze",
        initials: "AE",
      },
      {
        id: `STD-${id}-02`,
        name: "David John",
        initials: "DJ",
      },
      {
        id: `STD-${id}-03`,
        name: "Fatima Bello",
        initials: "FB",
      },
      {
        id: `STD-${id}-04`,
        name: "Chinedu Okoro",
        initials: "CO",
      },
    ],
    learningOutcomes: [
      `Explain the core principles and professional vocabulary of ${title}.`,
      `Use the main tools and workflows required for practical ${title} work.`,
      `Complete tutor-guided labs and independent assignments.`,
      `Apply quality, ethics, safety and professional standards.`,
      `Produce a portfolio-ready ${title} capstone project.`,
    ],
    prerequisites: [
      "Basic computer literacy",
      "Reliable internet access",
      "Commitment to weekly practice",
    ],
    lessons,
    classes: [
      {
        id: id * 10000 + 1,
        title: `${title}: Core Concepts Workshop`,
        dateLabel: "Wednesday",
        timeLabel: "6:00 PM",
        duration: "1 hour 30 minutes",
        startsAt: "2026-07-15T18:00:00",
      },
      {
        id: id * 10000 + 2,
        title: `${title}: Applied Project Clinic`,
        dateLabel: "Saturday",
        timeLabel: "11:00 AM",
        duration: "1 hour 30 minutes",
        startsAt: "2026-07-18T11:00:00",
      },
    ],
    assignments: [
      {
        id: id * 1000 + 1,
        title: `${title} Foundations Practical`,
        instructions:
          `Complete the tutor-provided practical exercise covering the first half of the ${title} curriculum. Submit your working files, evidence and a short reflection.`,
        due: "Due in 7 days",
        maximumScore: 100,
        tutorName,
      },
      {
        id: id * 1000 + 2,
        title: `${title} Applied Case Study`,
        instructions:
          `Apply ${title} methods to a realistic case study. Explain your process, decisions, results, limitations and recommended next steps.`,
        due: "Due in 14 days",
        maximumScore: 100,
        tutorName,
      },
    ],
    projects: [
      {
        id: id * 10000 + 5000,
        title: `Professional ${title} Capstone`,
        instructions:
          `Plan, execute and present a complete ${title} project that demonstrates technical competence, professional judgement and clear communication.`,
        deliverables: [
          "Project planning document",
          "Complete practical work or production files",
          "Evidence of testing, review or quality assurance",
          "Professional presentation or demonstration video",
          "Final reflection and improvement plan",
        ],
        deadline: "End of programme",
        tutorName,
      },
    ],
  };
}

let courseCounter = 1;

export const courseCategories = categorySeeds.map((category) => {
  const courses = category.courses.map(
    (title, courseIndex) =>
      buildCourse({
        id: courseCounter++,
        category,
        title,
        courseIndex,
      }),
  );

  return {
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image,
    courses,
  };
});

export const courseCatalog = courseCategories.flatMap(
  (category) => category.courses,
);

export const studentCourseOptions = courseCategories.map(
  (category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    courses: category.courses.map((course) => ({
      id: course.id,
      title: course.title,
      duration: course.duration,
      price: course.price,
      prices: course.prices,
      priceTier: course.priceTier,
      priceTierLabel: course.priceTierLabel,
      modules: course.lessons.map((lesson) => ({
        id: lesson.id,
        module: lesson.module,
        title: lesson.title,
        description: lesson.description,
      })),
    })),
  }),
);

export const defaultProfile = {
  firstName: "Student",
  lastName: "Account",
  email: "student@nexacore.com",
  phone: "",
  location: "",
  bio: "",
  careerGoal: "",
  linkedIn: "",
  profilePhoto: "",
};

export const defaultEnrollments = [
  {
    id: "ENR-1001",
    courseId: 1,
    selectedPlan: "full",
    currency: "NGN",
    amountPaid: 0,
    paymentStatus: "pending",
    accessActive: false,
    createdAt: "2026-07-12T10:00:00",
    paymentHistory: [],
  },
];

export const defaultLearningState = {
  completedLessons: {},
  attendedClasses: {},
  assignmentSubmissions: {},
  projectSubmissions: {},
  scores: {},
};

export const defaultMessages = Object.fromEntries(
  courseCatalog.map((course) => [
    course.id,
    [
      {
        id: `MSG-${course.id}-WELCOME`,
        senderType: "tutor",
        senderName: course.tutor.name,
        text: `Welcome to ${course.cohort}. Use this course chat whenever you need help with lessons, assignments or your tutor-assigned project.`,
        createdAt: "2026-07-12T09:00:00",
      },
    ],
  ]),
);

export const defaultNotifications = [
  {
    id: "NOT-1",
    title: "Payment required",
    message:
      "Complete the first payment for your selected course to unlock lessons, tutor chat and live classes.",
    read: false,
  },
];

export function getCoursePrice(
  course,
  currency = "NGN",
) {
  if (!course) {
    return 0;
  }

  return (
    course.prices?.[currency] ??
    course.price ??
    0
  );
}

export function formatCurrency(
  value,
  currency = "NGN",
) {
  const locale =
    currency === "NGN" ? "en-NG" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function getCourse(courseId) {
  return courseCatalog.find(
    (course) => course.id === Number(courseId),
  );
}

export function getCourseByTitle(title) {
  return courseCatalog.find(
    (course) => course.title === title,
  );
}

export function getCategory(categoryId) {
  return courseCategories.find(
    (category) => category.id === categoryId,
  );
}

export function getEnrollment(enrollments, courseId) {
  return enrollments.find(
    (enrollment) =>
      enrollment.courseId === Number(courseId),
  );
}

export function getPaymentPlans(
  course,
  currency = "NGN",
) {
  const coursePrice = getCoursePrice(
    course,
    currency,
  );

  return [
    {
      id: "full",
      title: "Full payment",
      description:
        "Pay once and settle the complete course fee.",
      total: coursePrice,
      instalments: 1,
      firstPayment: coursePrice,
    },
    {
      id: "two-part",
      title: "Two instalments",
      description:
        "Pay 60% now and the remaining 40% before the programme midpoint.",
      total: coursePrice,
      instalments: 2,
      firstPayment: Math.ceil(coursePrice * 0.6),
    },
    {
      id: "three-part",
      title: "Three instalments",
      description:
        "Pay 40% now, then complete two equal follow-up payments.",
      total: coursePrice,
      instalments: 3,
      firstPayment: Math.ceil(coursePrice * 0.4),
    },
  ];
}

export function getNextPaymentAmount(
  course,
  enrollment,
) {
  const currency =
    enrollment.currency ||
    detectPreferredCurrency();

  const coursePrice = getCoursePrice(
    course,
    currency,
  );

  const plans = getPaymentPlans(
    course,
    currency,
  );

  const plan =
    plans.find(
      (item) => item.id === enrollment.selectedPlan,
    ) || plans[0];

  const outstanding = Math.max(
    0,
    coursePrice - enrollment.amountPaid,
  );

  if (outstanding === 0) {
    return 0;
  }

  if (enrollment.amountPaid === 0) {
    return Math.min(plan.firstPayment, outstanding);
  }

  if (plan.id === "two-part") {
    return outstanding;
  }

  if (plan.id === "three-part") {
    return Math.ceil(outstanding / 2);
  }

  return outstanding;
}

export function isCourseAccessible(
  enrollments,
  courseId,
) {
  const enrollment = getEnrollment(
    enrollments,
    courseId,
  );

  return Boolean(enrollment?.accessActive);
}

export function calculateCourseProgress(
  course,
  learningState,
) {
  if (!course) {
    return 0;
  }

  const completedLessons =
    learningState.completedLessons[course.id] || [];
  const attendedClasses =
    learningState.attendedClasses[course.id] || [];
  const assignmentSubmissions =
    learningState.assignmentSubmissions[course.id] ||
    {};
  const projectSubmissions =
    learningState.projectSubmissions[course.id] || {};

  const lessonRatio =
    course.lessons.length > 0
      ? completedLessons.length /
        course.lessons.length
      : 0;

  const attendanceRatio =
    course.classes.length > 0
      ? attendedClasses.length /
        course.classes.length
      : 0;

  const submittedAssignmentCount =
    course.assignments.filter((assignment) => {
      const status =
        assignmentSubmissions[assignment.id]?.status;

      return (
        status === "submitted" ||
        status === "graded"
      );
    }).length;

  const assignmentRatio =
    course.assignments.length > 0
      ? submittedAssignmentCount /
        course.assignments.length
      : 0;

  const approvedProjectCount =
    course.projects.filter(
      (project) =>
        projectSubmissions[project.id]?.status ===
        "approved",
    ).length;

  const projectRatio =
    course.projects.length > 0
      ? approvedProjectCount /
        course.projects.length
      : 0;

  return Math.min(
    100,
    Math.round(
      lessonRatio * 35 +
        attendanceRatio * 15 +
        assignmentRatio * 25 +
        projectRatio * 25,
    ),
  );
}

export function calculateProfileProgress(profile) {
  const fields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.phone,
    profile.location,
    profile.bio,
    profile.careerGoal,
    profile.linkedIn,
    profile.profilePhoto,
  ];

  const completed = fields.filter(
    (value) =>
      String(value || "").trim().length > 0,
  ).length;

  return Math.round(
    (completed / fields.length) * 100,
  );
}

export function loadStoredValue(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);

    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredValue(key, value) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value),
    );
  } catch {
    // The frontend remains usable if browser storage is unavailable.
  }
}

export function beginStudentEnrollment(courseId = 1) {
  const parsedCourseId = Number(courseId) || 1;
  const course =
    getCourse(parsedCourseId) || courseCatalog[0];

  const currentEnrollments = loadStoredValue(
    STORAGE_KEYS.enrollments,
    defaultEnrollments,
  );

  const existingEnrollment = getEnrollment(
    currentEnrollments,
    course.id,
  );

  const preferredCurrency = detectPreferredCurrency();

  const nextEnrollments = existingEnrollment
    ? currentEnrollments.map((enrollment) =>
        enrollment.courseId === course.id &&
        enrollment.amountPaid === 0
          ? {
              ...enrollment,
              currency:
                enrollment.currency ||
                preferredCurrency,
            }
          : enrollment,
      )
    : [
        ...currentEnrollments,
        {
          id: `ENR-${Date.now()}`,
          courseId: course.id,
          selectedPlan: "full",
          currency: preferredCurrency,
          amountPaid: 0,
          paymentStatus: "pending",
          accessActive: false,
          createdAt: new Date().toISOString(),
          paymentHistory: [],
        },
      ];

  saveStoredValue(
    STORAGE_KEYS.enrollments,
    nextEnrollments,
  );

  window.location.href = `/student/payments?course=${course.id}`;
}

export function getStudentLandingPath() {
  const enrollments = loadStoredValue(
    STORAGE_KEYS.enrollments,
    defaultEnrollments,
  );

  return enrollments.some(
    (enrollment) => enrollment.accessActive,
  )
    ? "/student/dashboard"
    : "/student/payments";
}
