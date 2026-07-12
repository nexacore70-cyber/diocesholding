export const TUTOR_STORAGE_KEYS = {
  profile: "nexacore_tutor_profile_v1",
  requests: "nexacore_tutor_requests_v1",
  classes: "nexacore_tutor_classes_v1",
  materials: "nexacore_tutor_materials_v1",
  assignments: "nexacore_tutor_assignments_v1",
  submissions: "nexacore_tutor_submissions_v1",
  messages: "nexacore_tutor_messages_v1",
  earnings: "nexacore_tutor_earnings_v1",
  reviews: "nexacore_tutor_reviews_v1",
  onboarding: "nexacore_tutor_onboarding_v1",
  agreement: "nexacore_tutor_agreement_v1",
  applicantRegistry: "nexacore_tutor_applicant_registry_v1",
};

export const defaultTutorProfile = {
  id: "TUTOR-1001",
  firstName: "Adaeze",
  lastName: "Okafor",
  email: "adaeze@nexacore.com",
  specialty: "Frontend Development",
  headline: "Lead Frontend Development Tutor",
  phone: "",
  teachingCourse: "Frontend Development",
  profilePhoto: "",
};

export const tutorCourses = [
  {
    id: 1,
    title: "Frontend Development with React",
    category: "Software Development",
    image: "/images/hero/banner1.png",
    cohort: "React Cohort A",
    students: [
      { id: "STD-1001", name: "Amaka Eze", initials: "AE", online: true, progress: 68 },
      { id: "STD-1002", name: "David John", initials: "DJ", online: false, progress: 54 },
      { id: "STD-1003", name: "Fatima Bello", initials: "FB", online: true, progress: 72 },
      { id: "STD-1004", name: "Chinedu Okoro", initials: "CO", online: false, progress: 45 },
    ],
  },
  {
    id: 2,
    title: "UI/UX Design and Product Thinking",
    category: "Design and Product",
    image: "/images/hero/banner2.png",
    cohort: "UI/UX Cohort B",
    students: [
      { id: "STD-1101", name: "Blessing James", initials: "BJ", online: true, progress: 61 },
      { id: "STD-1102", name: "Samuel Peter", initials: "SP", online: false, progress: 49 },
      { id: "STD-1103", name: "Amina Yusuf", initials: "AY", online: true, progress: 77 },
    ],
  },
];

export const defaultStudentRequests = [
  {
    id: "REQ-1001",
    studentName: "Peace Anthony",
    initials: "PA",
    courseId: 1,
    requestType: "Join cohort",
    note: "I completed the JavaScript prerequisite course.",
    status: "pending",
  },
  {
    id: "REQ-1002",
    studentName: "Kelvin Chukwu",
    initials: "KC",
    courseId: 1,
    requestType: "One-on-one mentorship",
    note: "I need extra help with React state management.",
    status: "pending",
  },
  {
    id: "REQ-1003",
    studentName: "Esther Paul",
    initials: "EP",
    courseId: 2,
    requestType: "Trial class",
    note: "I would like an introductory product design session.",
    status: "pending",
  },
];

export const defaultTutorClasses = [
  {
    id: 81001,
    courseId: 1,
    title: "React State and Component Lifecycle",
    type: "group",
    date: "2026-07-14",
    time: "10:00",
    durationMinutes: 90,
    status: "scheduled",
    studentIds: ["STD-1001", "STD-1002", "STD-1003", "STD-1004"],
  },
  {
    id: 81002,
    courseId: 1,
    title: "One-on-One React Support",
    type: "single",
    date: "2026-07-15",
    time: "15:00",
    durationMinutes: 45,
    status: "scheduled",
    studentIds: ["STD-1002"],
  },
  {
    id: 82001,
    courseId: 2,
    title: "User Research and Persona Workshop",
    type: "group",
    date: "2026-07-17",
    time: "13:00",
    durationMinutes: 75,
    status: "scheduled",
    studentIds: ["STD-1101", "STD-1102", "STD-1103"],
  },
];

export const defaultMaterials = [
  {
    id: "MAT-1001",
    courseId: 1,
    title: "React State Class Notes",
    fileName: "react-state-notes.pdf",
    materialType: "PDF",
    description: "Examples, revision notes and guided exercises.",
  },
  {
    id: "MAT-2001",
    courseId: 2,
    title: "User Research Template",
    fileName: "research-template.docx",
    materialType: "DOCX",
    description: "Interview guide and observation template.",
  },
];

export const defaultAssignments = [
  {
    id: 91001,
    courseId: 1,
    title: "Build a Responsive React Dashboard",
    instructions: "Build a responsive dashboard with reusable React components and state management.",
    dueDate: "2026-07-20",
    maximumScore: 100,
    status: "published",
    attachmentName: "dashboard-brief.pdf",
  },
  {
    id: 92001,
    courseId: 2,
    title: "Create a Mobile App User Flow",
    instructions: "Create a complete user flow and low-fidelity wireframes for a mobile service application.",
    dueDate: "2026-07-22",
    maximumScore: 100,
    status: "published",
    attachmentName: "user-flow-brief.pdf",
  },
];

export const defaultSubmissions = [
  {
    id: "SUB-1001",
    assignmentId: 91001,
    courseId: 1,
    studentId: "STD-1001",
    studentName: "Amaka Eze",
    fileName: "amaka-react-dashboard.zip",
    projectUrl: "https://example.com/amaka-dashboard",
    status: "submitted",
    score: null,
    feedback: "",
  },
  {
    id: "SUB-1002",
    assignmentId: 91001,
    courseId: 1,
    studentId: "STD-1003",
    studentName: "Fatima Bello",
    fileName: "fatima-dashboard.pdf",
    projectUrl: "https://example.com/fatima-dashboard",
    status: "submitted",
    score: null,
    feedback: "",
  },
  {
    id: "SUB-2001",
    assignmentId: 92001,
    courseId: 2,
    studentId: "STD-1101",
    studentName: "Blessing James",
    fileName: "blessing-user-flow.pdf",
    projectUrl: "",
    status: "graded",
    score: 86,
    feedback: "Strong structure. Improve onboarding error states.",
  },
];

export const defaultTutorMessages = {
  "student-STD-1001": [
    { id: "MSG-1001", senderType: "student", senderName: "Amaka Eze", text: "Please can you review my dashboard structure?" },
  ],
  "student-STD-1002": [
    { id: "MSG-1002", senderType: "student", senderName: "David John", text: "I need help with useEffect dependencies." },
  ],
  "cohort-1": [
    { id: "MSG-C1", senderType: "tutor", senderName: "Adaeze Okafor", text: "The next React class is Tuesday at 10:00 AM." },
  ],
  "cohort-2": [
    { id: "MSG-C2", senderType: "tutor", senderName: "Adaeze Okafor", text: "The user research template is now available in Materials." },
  ],
};

export const defaultEarnings = {
  availableBalance: 285000,
  pendingBalance: 95000,
  lifetimeEarnings: 1485000,
  payoutAccount: "Bank account ending 4821",
  transactions: [
    { id: "ERN-1001", description: "React Cohort A teaching payment", amount: 180000, date: "2026-07-05", status: "paid" },
    { id: "ERN-1002", description: "One-on-one mentoring sessions", amount: 105000, date: "2026-07-09", status: "paid" },
    { id: "ERN-1003", description: "UI/UX Cohort B teaching payment", amount: 95000, date: "2026-07-12", status: "pending" },
  ],
  payoutRequests: [],
};

export const defaultReviews = [
  {
    id: "REV-1001",
    studentName: "Amaka Eze",
    initials: "AE",
    courseId: 1,
    rating: 5,
    comment: "The live coding sessions are clear and practical.",
    response: "",
  },
  {
    id: "REV-1002",
    studentName: "Fatima Bello",
    initials: "FB",
    courseId: 1,
    rating: 5,
    comment: "I like the assignments and detailed feedback.",
    response: "Thank you. Keep applying the feedback to your next project.",
  },
  {
    id: "REV-2001",
    studentName: "Amina Yusuf",
    initials: "AY",
    courseId: 2,
    rating: 4,
    comment: "The workshops are engaging. I would like more group critique time.",
    response: "",
  },
];

export function getTutorCourse(courseId) {
  return tutorCourses.find((course) => course.id === Number(courseId));
}

export function getAllTutorStudents() {
  return tutorCourses.flatMap((course) =>
    course.students.map((student) => ({ ...student, courseId: course.id })),
  );
}

export function getStudentById(studentId) {
  return getAllTutorStudents().find((student) => student.id === studentId);
}

export function loadTutorValue(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    const parsed = JSON.parse(value);

    if (
      fallback &&
      typeof fallback === "object" &&
      !Array.isArray(fallback) &&
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return {
        ...fallback,
        ...parsed,
      };
    }

    return parsed;
  } catch {
    return fallback;
  }
}

export function saveTutorValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Frontend prototype remains usable if storage is unavailable.
  }
}

export function formatMoney(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateTutorRating(reviews) {
  if (!reviews.length) return "0.0";
  return (
    reviews.reduce((total, review) => total + review.rating, 0) /
    reviews.length
  ).toFixed(1);
}
export const TUTOR_PASS_MARK = 60;
export const TUTOR_ASSESSMENT_QUESTION_COUNT = 50;
export const TUTOR_ASSESSMENT_DURATION_MINUTES = 30;
export const TUTOR_FAILED_COOLDOWN_DAYS = 30;

export const TUTOR_REVENUE_SHARE = {
  tutorPercent: 60,
  platformPercent: 40,
};

export const defaultTutorOnboarding = {
  applicationStatus: "assessment_required",
  applicantId: "",
  selectedCourseTitle: "Frontend Development",
  assessmentQuestionCount: TUTOR_ASSESSMENT_QUESTION_COUNT,
  assessmentId: "",
  assessmentSeed: "",
  assessmentQuestions: [],
  assessmentAnswers: {},
  assessmentQuestionFingerprints: [],
  previousQuestionFingerprints: [],
  assessmentScore: null,
  assessmentPassed: false,
  assessmentAttempts: 0,
  assessmentStartedAt: "",
  assessmentExpiresAt: "",
  assessmentCompletedAt: "",
  assessmentTimedOut: false,
  integrityWarnings: 0,
  failedAt: "",
  cooldownUntil: "",
  agreementSigned: false,
  agreementSignedAt: "",
  agreementVersion: "Tutor Partnership Agreement v1.0",
  approved: false,
};

const teachingQuestions = [
  {
    question:
      "A student gives an incorrect answer during a live class. What is the best first response?",
    options: [
      "Correct the student harshly so the class remembers",
      "Ignore the answer and move to another student",
      "Acknowledge the attempt, ask a guiding question and explain the concept",
      "End the activity immediately",
    ],
    correctOption: 2,
    explanation:
      "Constructive guidance maintains psychological safety while correcting the misconception.",
    domain: "Teaching practice",
  },
  {
    question:
      "Which assessment approach provides the strongest evidence that a learner can apply a practical skill?",
    options: [
      "A single attendance record",
      "A practical task with a clear rubric",
      "A student satisfaction survey",
      "A list of course topics",
    ],
    correctOption: 1,
    explanation:
      "A practical task assessed with a rubric directly measures applied competence.",
    domain: "Assessment",
  },
  {
    question:
      "A learner is repeatedly falling behind. What should the tutor do first?",
    options: [
      "Remove the learner from the cohort immediately",
      "Identify the specific barrier and agree on a support plan",
      "Give the learner every answer",
      "Lower all course standards",
    ],
    correctOption: 1,
    explanation:
      "The tutor should diagnose the barrier and provide structured, appropriate support.",
    domain: "Learner support",
  },
  {
    question:
      "What is the best reason for sharing a lesson objective at the beginning of class?",
    options: [
      "It makes the class look longer",
      "It tells learners what they should understand or produce",
      "It replaces the need for assessment",
      "It prevents learners from asking questions",
    ],
    correctOption: 1,
    explanation:
      "Clear objectives align teaching, activities and assessment.",
    domain: "Lesson planning",
  },
  {
    question:
      "When grading a project, feedback should primarily be:",
    options: [
      "Specific, evidence-based and connected to the rubric",
      "Limited to a numerical score",
      "Based on the tutor's mood",
      "Copied from another student's work",
    ],
    correctOption: 0,
    explanation:
      "Useful feedback explains strengths, gaps and actionable next steps using the rubric.",
    domain: "Feedback",
  },
  {
    question:
      "Which action is most appropriate when a student shares confidential personal information?",
    options: [
      "Post it in the cohort group",
      "Share it with other students",
      "Handle it privately and follow the platform safeguarding process",
      "Use it as a class example without permission",
    ],
    correctOption: 2,
    explanation:
      "Confidential information must be handled privately and according to safeguarding procedures.",
    domain: "Professional conduct",
  },
];

const assessmentBanks = {
  software: [
    {
      question:
        "Which practice most improves maintainability in a large software project?",
      options: [
        "Putting all logic in one file",
        "Using modular components, clear interfaces and automated tests",
        "Avoiding version control",
        "Copying code for every new feature",
      ],
      correctOption: 1,
      explanation:
        "Modularity, clear interfaces and automated tests reduce coupling and regression risk.",
      domain: "Software engineering",
    },
    {
      question:
        "What is the primary purpose of an API contract?",
      options: [
        "To define how clients and services exchange data",
        "To select the website colour",
        "To replace database backups",
        "To remove authentication",
      ],
      correctOption: 0,
      explanation:
        "An API contract defines endpoints, data formats, behaviours and errors.",
      domain: "API development",
    },
    {
      question:
        "In Git, why is a pull request useful?",
      options: [
        "It permanently deletes branch history",
        "It supports review and controlled integration of changes",
        "It replaces testing",
        "It publishes passwords safely",
      ],
      correctOption: 1,
      explanation:
        "Pull requests support review, discussion and controlled merging.",
      domain: "Git and collaboration",
    },
    {
      question:
        "Which test checks that several modules work correctly together?",
      options: [
        "Integration test",
        "Typography test",
        "Colour test",
        "Attendance test",
      ],
      correctOption: 0,
      explanation:
        "Integration tests validate interactions between components or services.",
      domain: "Testing",
    },
    {
      question:
        "What problem does state management solve in a frontend application?",
      options: [
        "It manages changing application data and UI consistency",
        "It creates internet access",
        "It replaces all HTML",
        "It removes the need for user input",
      ],
      correctOption: 0,
      explanation:
        "State management coordinates changing data and the interface that depends on it.",
      domain: "Frontend development",
    },
    {
      question:
        "Which HTTP method is normally used to create a new resource?",
      options: ["GET", "POST", "DELETE", "HEAD"],
      correctOption: 1,
      explanation:
        "POST is commonly used to create a new server-side resource.",
      domain: "Web development",
    },
  ],
  data: [
    {
      question:
        "What is data leakage in a machine-learning workflow?",
      options: [
        "Using information during training that would not be available at prediction time",
        "Saving a chart as an image",
        "Removing duplicate rows",
        "Renaming a column",
      ],
      correctOption: 0,
      explanation:
        "Leakage causes unrealistically strong results because the model sees unavailable information.",
      domain: "Machine learning",
    },
    {
      question:
        "Which SQL clause filters grouped results after aggregation?",
      options: ["WHERE", "HAVING", "ORDER BY", "JOIN"],
      correctOption: 1,
      explanation:
        "HAVING filters results after GROUP BY and aggregation.",
      domain: "SQL",
    },
    {
      question:
        "Why should a data analyst inspect missing values before modelling?",
      options: [
        "Missing values can bias results or break calculations",
        "Missing values always improve accuracy",
        "It removes the need for validation",
        "It automatically creates dashboards",
      ],
      correctOption: 0,
      explanation:
        "Missing values require deliberate treatment because they can affect validity and model behaviour.",
      domain: "Data preparation",
    },
    {
      question:
        "Which visual is usually best for comparing values across categories?",
      options: ["Bar chart", "Scatter plot", "Map", "Gauge only"],
      correctOption: 0,
      explanation:
        "Bar charts support accurate comparison across discrete categories.",
      domain: "Data visualisation",
    },
    {
      question:
        "What is the purpose of a train-test split?",
      options: [
        "To evaluate performance on unseen data",
        "To make the dataset colourful",
        "To avoid defining a target",
        "To guarantee perfect accuracy",
      ],
      correctOption: 0,
      explanation:
        "A holdout test set estimates how the model performs on unseen data.",
      domain: "Model evaluation",
    },
    {
      question:
        "A Power BI relationship is primarily used to:",
      options: [
        "Connect tables through related keys",
        "Change the operating system",
        "Replace all measures",
        "Encrypt email",
      ],
      correctOption: 0,
      explanation:
        "Relationships allow filters and calculations to work across connected tables.",
      domain: "Business intelligence",
    },
  ],
  cybersecurity: [
    {
      question:
        "What does the principle of least privilege require?",
      options: [
        "Users receive only the access necessary for their role",
        "Every user becomes an administrator",
        "Passwords are shared across teams",
        "Security logs are disabled",
      ],
      correctOption: 0,
      explanation:
        "Least privilege limits access to what is required, reducing potential damage.",
      domain: "Access control",
    },
    {
      question:
        "Which control best protects stored passwords?",
      options: [
        "Plain text storage",
        "A strong salted password hash",
        "A spreadsheet shared by email",
        "A public source-code comment",
      ],
      correctOption: 1,
      explanation:
        "Passwords should be stored using a strong adaptive salted hash.",
      domain: "Application security",
    },
    {
      question:
        "What is the first priority during incident response?",
      options: [
        "Follow the response process and contain verified harm",
        "Delete all evidence",
        "Publish unverified details",
        "Ignore the alert",
      ],
      correctOption: 0,
      explanation:
        "A controlled response protects evidence and limits impact.",
      domain: "Incident response",
    },
    {
      question:
        "Phishing primarily attempts to:",
      options: [
        "Manipulate people into disclosing information or taking unsafe actions",
        "Improve network speed",
        "Create backups",
        "Patch operating systems",
      ],
      correctOption: 0,
      explanation:
        "Phishing is a social-engineering technique used to deceive victims.",
      domain: "Security awareness",
    },
    {
      question:
        "What is the purpose of network segmentation?",
      options: [
        "Limit movement and exposure between network zones",
        "Remove all firewalls",
        "Make every device public",
        "Disable monitoring",
      ],
      correctOption: 0,
      explanation:
        "Segmentation reduces attack paths and contains compromise.",
      domain: "Network security",
    },
    {
      question:
        "A risk assessment should consider:",
      options: [
        "Likelihood and impact",
        "Logo colour only",
        "Employee birthdays",
        "Screen resolution only",
      ],
      correctOption: 0,
      explanation:
        "Risk is commonly evaluated using likelihood and potential impact.",
      domain: "Risk management",
    },
  ],
  cloud: [
    {
      question:
        "What is a major benefit of containerisation?",
      options: [
        "Consistent packaging of an application and its dependencies",
        "It removes the need for security",
        "It guarantees unlimited resources",
        "It replaces source control",
      ],
      correctOption: 0,
      explanation:
        "Containers package applications consistently across environments.",
      domain: "Containers",
    },
    {
      question:
        "What is the purpose of a CI pipeline?",
      options: [
        "Automatically build and test changes",
        "Manually hide defects",
        "Disable version control",
        "Replace documentation",
      ],
      correctOption: 0,
      explanation:
        "Continuous integration validates changes quickly and repeatedly.",
      domain: "CI/CD",
    },
    {
      question:
        "In cloud security, IAM is used to:",
      options: [
        "Manage identities, roles and permissions",
        "Edit videos",
        "Design logos",
        "Replace backups",
      ],
      correctOption: 0,
      explanation:
        "Identity and access management controls who can access resources and what they can do.",
      domain: "Cloud security",
    },
    {
      question:
        "What does Kubernetes primarily orchestrate?",
      options: [
        "Containerised workloads",
        "Printed documents",
        "Email signatures",
        "Database column names only",
      ],
      correctOption: 0,
      explanation:
        "Kubernetes schedules and manages containerised applications.",
      domain: "Kubernetes",
    },
    {
      question:
        "Infrastructure as Code means:",
      options: [
        "Managing infrastructure through versioned configuration",
        "Buying hardware without documentation",
        "Writing only application CSS",
        "Avoiding automation",
      ],
      correctOption: 0,
      explanation:
        "Infrastructure as Code makes infrastructure repeatable, reviewable and automated.",
      domain: "DevOps",
    },
    {
      question:
        "Why is observability important in production?",
      options: [
        "It helps teams understand system health and diagnose failures",
        "It guarantees no failure can occur",
        "It replaces authentication",
        "It removes the need for alerts",
      ],
      correctOption: 0,
      explanation:
        "Logs, metrics and traces help operators detect and diagnose issues.",
      domain: "Operations",
    },
  ],
  design: [
    {
      question:
        "What is the main purpose of user research?",
      options: [
        "Understand user needs, behaviours and context",
        "Confirm every design assumption",
        "Choose a favourite colour",
        "Avoid testing",
      ],
      correctOption: 0,
      explanation:
        "Research grounds product decisions in evidence about users and their context.",
      domain: "User research",
    },
    {
      question:
        "A design system primarily provides:",
      options: [
        "Reusable standards, components and guidance",
        "A replacement for all user testing",
        "A payment gateway",
        "A database backup",
      ],
      correctOption: 0,
      explanation:
        "Design systems improve consistency and efficiency through reusable foundations.",
      domain: "Design systems",
    },
    {
      question:
        "Which practice supports accessible interface design?",
      options: [
        "Sufficient contrast and keyboard access",
        "Using colour as the only signal",
        "Removing labels from forms",
        "Disabling focus indicators",
      ],
      correctOption: 0,
      explanation:
        "Accessible interfaces provide perceivable content and operable controls.",
      domain: "Accessibility",
    },
    {
      question:
        "What is a prototype used for?",
      options: [
        "Testing and communicating a proposed experience",
        "Replacing every research activity",
        "Storing passwords",
        "Managing payroll",
      ],
      correctOption: 0,
      explanation:
        "Prototypes let teams test flows and ideas before full implementation.",
      domain: "Prototyping",
    },
    {
      question:
        "An MVP should primarily:",
      options: [
        "Test the core value proposition with the smallest useful solution",
        "Contain every possible feature",
        "Avoid user feedback",
        "Be designed without objectives",
      ],
      correctOption: 0,
      explanation:
        "An MVP focuses learning on the most important value and assumptions.",
      domain: "Product management",
    },
    {
      question:
        "A usability test is most useful for identifying:",
      options: [
        "Where users struggle to complete representative tasks",
        "The tutor's salary",
        "Server encryption keys",
        "Tax rates",
      ],
      correctOption: 0,
      explanation:
        "Usability testing reveals friction in task completion and comprehension.",
      domain: "Usability",
    },
  ],
  business: [
    {
      question:
        "What is the main purpose of a digital marketing funnel?",
      options: [
        "Map how an audience moves from awareness to conversion and retention",
        "Replace customer research",
        "Guarantee every visitor buys",
        "Remove analytics",
      ],
      correctOption: 0,
      explanation:
        "Funnels organise marketing activity around stages of the customer journey.",
      domain: "Digital marketing",
    },
    {
      question:
        "Which metric most directly reflects organic search visibility?",
      options: [
        "Search impressions and organic clicks",
        "Office rent",
        "Laptop battery percentage",
        "Number of internal meetings",
      ],
      correctOption: 0,
      explanation:
        "Organic impressions, rankings and clicks indicate search visibility.",
      domain: "SEO",
    },
    {
      question:
        "In Scrum, a sprint review is used to:",
      options: [
        "Inspect the increment with stakeholders and adapt the product backlog",
        "Punish the development team",
        "Replace daily collaboration",
        "Avoid demonstrating work",
      ],
      correctOption: 0,
      explanation:
        "The sprint review inspects outcomes and informs what should happen next.",
      domain: "Agile delivery",
    },
    {
      question:
        "A strong sales discovery question should:",
      options: [
        "Reveal the prospect's goals, constraints and decision context",
        "Immediately force a purchase",
        "Avoid listening",
        "Focus only on product features",
      ],
      correctOption: 0,
      explanation:
        "Discovery identifies needs and context before recommending a solution.",
      domain: "Tech sales",
    },
    {
      question:
        "A project risk register should include:",
      options: [
        "Risk description, likelihood, impact, owner and response",
        "Only completed tasks",
        "Personal passwords",
        "Unrelated social media posts",
      ],
      correctOption: 0,
      explanation:
        "A risk register records assessment, accountability and planned treatment.",
      domain: "Project management",
    },
    {
      question:
        "What is the benefit of a documented standard operating procedure?",
      options: [
        "It makes repeatable work more consistent and transferable",
        "It eliminates the need for quality checks",
        "It prevents process improvement",
        "It hides responsibilities",
      ],
      correctOption: 0,
      explanation:
        "SOPs improve repeatability, quality and onboarding.",
      domain: "Business operations",
    },
  ],
  emerging: [
    {
      question:
        "A strong prompt for an AI system should normally include:",
      options: [
        "Goal, context, constraints and expected output",
        "Only one vague word",
        "Private data regardless of need",
        "No success criteria",
      ],
      correctOption: 0,
      explanation:
        "Clear context, constraints and output requirements improve reliability.",
      domain: "Prompt engineering",
    },
    {
      question:
        "What is a key control when automating a business process with AI?",
      options: [
        "Human review for high-impact decisions",
        "Removing all logs",
        "Using unverified outputs automatically",
        "Ignoring privacy requirements",
      ],
      correctOption: 0,
      explanation:
        "Human oversight is essential for consequential or uncertain outputs.",
      domain: "AI automation",
    },
    {
      question:
        "Data minimisation means:",
      options: [
        "Collecting only data necessary for the stated purpose",
        "Collecting every available data point",
        "Publishing customer records",
        "Keeping data forever",
      ],
      correctOption: 0,
      explanation:
        "Data minimisation limits collection to what is relevant and necessary.",
      domain: "Data privacy",
    },
    {
      question:
        "An IoT device should be secured by:",
      options: [
        "Changing default credentials and applying updates",
        "Exposing every service publicly",
        "Disabling authentication",
        "Sharing one password across all deployments",
      ],
      correctOption: 0,
      explanation:
        "Unique credentials, patching and reduced exposure are basic IoT controls.",
      domain: "IoT",
    },
    {
      question:
        "A smart contract is best described as:",
      options: [
        "Code executed according to conditions on a blockchain network",
        "A handwritten employment form",
        "A video-editing template",
        "A spreadsheet filter",
      ],
      correctOption: 0,
      explanation:
        "Smart contracts are programs that execute on blockchain infrastructure.",
      domain: "Blockchain",
    },
    {
      question:
        "A responsible AI lesson should include:",
      options: [
        "Bias, limitations, privacy and verification",
        "Only successful outputs",
        "Instructions to trust every response",
        "Ways to hide generated content",
      ],
      correctOption: 0,
      explanation:
        "Responsible practice requires awareness of limitations, harms and verification.",
      domain: "Responsible AI",
    },
  ],
  creative: [
    {
      question:
        "What is the primary purpose of a storyboard?",
      options: [
        "Plan shots, action and visual sequence before production",
        "Replace all editing",
        "Store payment information",
        "Set camera passwords",
      ],
      correctOption: 0,
      explanation:
        "Storyboards communicate planned composition, sequence and action.",
      domain: "Pre-production",
    },
    {
      question:
        "Which frame rate is commonly associated with a cinematic motion look?",
      options: ["24 fps", "2 fps", "2400 fps", "1 fps"],
      correctOption: 0,
      explanation:
        "Approximately 24 fps is traditionally associated with cinema.",
      domain: "Video production",
    },
    {
      question:
        "What does continuity editing aim to preserve?",
      options: [
        "Clear spatial and temporal flow between shots",
        "Random exposure changes",
        "Unrelated audio levels",
        "Missing story information",
      ],
      correctOption: 0,
      explanation:
        "Continuity editing helps the audience follow action and space naturally.",
      domain: "Editing",
    },
    {
      question:
        "When using an AI-generated face or voice, a tutor should teach students to consider:",
      options: [
        "Consent, disclosure, copyright and potential harm",
        "Only rendering speed",
        "How to impersonate people secretly",
        "Why verification is unnecessary",
      ],
      correctOption: 0,
      explanation:
        "AI media work requires consent, transparency and rights-aware practice.",
      domain: "AI media ethics",
    },
    {
      question:
        "What is the purpose of colour grading?",
      options: [
        "Shape visual consistency, mood and final appearance",
        "Record dialogue",
        "Create a database",
        "Replace story structure",
      ],
      correctOption: 0,
      explanation:
        "Colour grading refines the final visual tone and consistency.",
      domain: "Post-production",
    },
    {
      question:
        "Good production audio usually requires:",
      options: [
        "Appropriate microphone placement and monitored recording levels",
        "Recording from any distance without monitoring",
        "Removing all ambient sound blindly",
        "Using clipped audio",
      ],
      correctOption: 0,
      explanation:
        "Microphone placement and level monitoring are fundamental to clean audio.",
      domain: "Audio production",
    },
  ],
  softskills: [
    {
      question:
        "Active listening includes:",
      options: [
        "Clarifying, paraphrasing and checking understanding",
        "Interrupting immediately",
        "Planning a response without listening",
        "Ignoring non-verbal cues",
      ],
      correctOption: 0,
      explanation:
        "Active listening verifies meaning and demonstrates attention.",
      domain: "Communication",
    },
    {
      question:
        "A constructive feedback model should focus on:",
      options: [
        "Observable behaviour, impact and a practical next step",
        "Personal attacks",
        "Rumours",
        "Unrelated past events",
      ],
      correctOption: 0,
      explanation:
        "Effective feedback is specific, respectful and actionable.",
      domain: "Feedback",
    },
    {
      question:
        "During conflict, the most useful first step is often to:",
      options: [
        "Clarify the issue and each party's interests",
        "Escalate emotionally",
        "Assign blame immediately",
        "Avoid all communication",
      ],
      correctOption: 0,
      explanation:
        "Understanding the real issue and interests supports constructive resolution.",
      domain: "Conflict resolution",
    },
    {
      question:
        "Psychological safety in a team means:",
      options: [
        "People can raise questions and concerns without fear of humiliation",
        "Nobody is accountable",
        "Every idea is automatically accepted",
        "Leaders never give feedback",
      ],
      correctOption: 0,
      explanation:
        "Psychological safety supports candid participation while maintaining standards.",
      domain: "Teamwork",
    },
    {
      question:
        "A useful time-management approach is to:",
      options: [
        "Prioritise important work and schedule focused execution time",
        "Treat every task as equally urgent",
        "Avoid planning",
        "Multitask continuously",
      ],
      correctOption: 0,
      explanation:
        "Prioritisation and protected focus time improve execution.",
      domain: "Productivity",
    },
    {
      question:
        "A strong public-speaking opening should:",
      options: [
        "Establish relevance and orient the audience",
        "Apologise for the entire presentation",
        "Read unrelated text",
        "Hide the objective",
      ],
      correctOption: 0,
      explanation:
        "An effective opening gives the audience a reason to pay attention and a clear direction.",
      domain: "Public speaking",
    },
  ],
};

function selectAssessmentBank(courseTitle) {
  const value = String(courseTitle || "").toLowerCase();

  if (
    /(video|film|cinema|animation|motion|vfx|documentary|youtube|sound|script|storyboard)/.test(
      value,
    )
  ) {
    return assessmentBanks.creative;
  }

  if (
    /(soft|communication|leadership|emotional|time management|career|writing|negotiation|customer service|entrepreneurship|remote work|interview)/.test(
      value,
    )
  ) {
    return assessmentBanks.softskills;
  }

  if (
    /(data|sql|power bi|tableau|excel|machine learning|artificial intelligence|business intelligence|python)/.test(
      value,
    )
  ) {
    return assessmentBanks.data;
  }

  if (
    /(cyber|ethical hacking|network security|cloud security|soc analyst|grc|risk management)/.test(
      value,
    )
  ) {
    return assessmentBanks.cybersecurity;
  }

  if (
    /(cloud|aws|azure|docker|kubernetes|devops|ci\/cd|linux)/.test(
      value,
    )
  ) {
    return assessmentBanks.cloud;
  }

  if (
    /(design|ui\/ux|product|figma|user research|graphic)/.test(
      value,
    )
  ) {
    return assessmentBanks.design;
  }

  if (
    /(marketing|seo|project management|agile|scrum|tech sales|virtual assistance|no-code|social media)/.test(
      value,
    )
  ) {
    return assessmentBanks.business;
  }

  if (
    /(blockchain|prompt|automation|privacy|robotics|iot|low-code)/.test(
      value,
    )
  ) {
    return assessmentBanks.emerging;
  }

  return assessmentBanks.software;
}

function hashText(value) {
  let hash = 2166136261;

  for (const character of String(value || "")) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash >>> 0);
}

function createSeededRandom(seedText) {
  let state = hashText(seedText) || 123456789;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRandom(items, random) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const selectedIndex = Math.floor(random() * (index + 1));
    [result[index], result[selectedIndex]] = [
      result[selectedIndex],
      result[index],
    ];
  }

  return result;
}

function createApplicantId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `TUTOR-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function normaliseQuestionText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/assessment reference [a-z0-9-]+/g, "")
    .replace(/scenario [a-z0-9-]+/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getQuestionFingerprint(question) {
  return String(hashText(normaliseQuestionText(question)));
}

function getAssessmentScenario(index, random) {
  const settings = [
    "a live introductory class",
    "a practical workshop",
    "an individual mentoring call",
    "a group project review",
    "a capstone demonstration",
    "a learner support session",
    "a revision class",
    "a professional simulation",
    "a marked practical exercise",
    "a portfolio review",
  ];

  const learnerStages = [
    "beginner learners",
    "intermediate learners",
    "a mixed-ability cohort",
    "a learner who is falling behind",
    "a high-performing learner",
  ];

  const setting =
    settings[(index + Math.floor(random() * settings.length)) %
      settings.length];

  const learnerStage =
    learnerStages[
      (index + Math.floor(random() * learnerStages.length)) %
        learnerStages.length
    ];

  return {
    setting,
    learnerStage,
    reference: `${String(index + 1).padStart(2, "0")}-${Math.floor(
      random() * 9000 + 1000,
    )}`,
  };
}

function buildUniqueQuestion(
  sourceQuestion,
  courseTitle,
  index,
  random,
  assessmentSeed,
) {
  const scenario = getAssessmentScenario(index, random);

  const stems = [
    `During ${scenario.setting} for ${courseTitle}, ${scenario.learnerStage} need a correct explanation. ${sourceQuestion.question}`,
    `You are preparing ${scenario.setting} in ${courseTitle}. Which answer should be used when asking: ${sourceQuestion.question}`,
    `A student raises this question during ${scenario.setting}: ${sourceQuestion.question} Select the most accurate tutor response.`,
    `Before assessing ${scenario.learnerStage} in ${courseTitle}, identify the correct answer to this item: ${sourceQuestion.question}`,
    `In a ${courseTitle} teaching scenario, apply the correct professional judgement. ${sourceQuestion.question}`,
  ];

  const stem =
    stems[(index + Math.floor(random() * stems.length)) % stems.length];

  const optionsWithOriginalIndex = sourceQuestion.options.map(
    (option, originalIndex) => ({
      option,
      originalIndex,
    }),
  );

  const shuffledOptions = shuffleWithRandom(
    optionsWithOriginalIndex,
    random,
  );

  const correctOption = shuffledOptions.findIndex(
    (item) =>
      item.originalIndex === sourceQuestion.correctOption,
  );

  const questionText = `${stem} Assessment reference ${scenario.reference}.`;

  return {
    id: `ASSESS-${assessmentSeed}-${index + 1}`,
    courseTitle,
    domain: sourceQuestion.domain,
    question: questionText,
    options: shuffledOptions.map((item) => item.option),
    correctOption,
    explanation: sourceQuestion.explanation,
    fingerprint: getQuestionFingerprint(questionText),
  };
}

export function generateFallbackTutorAssessment(
  courseTitle,
  {
    applicantId = "",
    attemptNumber = 1,
    excludedFingerprints = [],
    assessmentSeed = "",
  } = {},
) {
  const seed =
    assessmentSeed ||
    `${courseTitle}|${applicantId}|${attemptNumber}|${Date.now()}|${Math.random()}`;

  const random = createSeededRandom(seed);
  const technicalQuestions = shuffleWithRandom(
    selectAssessmentBank(courseTitle),
    random,
  );
  const pedagogyQuestions = shuffleWithRandom(
    teachingQuestions,
    random,
  );
  const sourceQuestions = shuffleWithRandom(
    [...technicalQuestions, ...pedagogyQuestions],
    random,
  );

  const excluded = new Set(
    excludedFingerprints.map(String),
  );
  const generated = [];
  const currentFingerprints = new Set();
  let candidateIndex = 0;

  while (
    generated.length < TUTOR_ASSESSMENT_QUESTION_COUNT &&
    candidateIndex < 1000
  ) {
    const sourceQuestion =
      sourceQuestions[candidateIndex % sourceQuestions.length];

    const candidate = buildUniqueQuestion(
      sourceQuestion,
      courseTitle,
      candidateIndex,
      random,
      hashText(seed).toString(36),
    );

    if (
      !currentFingerprints.has(candidate.fingerprint) &&
      !excluded.has(candidate.fingerprint)
    ) {
      currentFingerprints.add(candidate.fingerprint);
      generated.push(candidate);
    }

    candidateIndex += 1;
  }

  if (generated.length !== TUTOR_ASSESSMENT_QUESTION_COUNT) {
    throw new Error(
      "Could not create 50 non-repeating assessment questions.",
    );
  }

  return generated;
}

function assessmentResponseIsValid(questions) {
  if (
    !Array.isArray(questions) ||
    questions.length !== TUTOR_ASSESSMENT_QUESTION_COUNT
  ) {
    return false;
  }

  const fingerprints = new Set();

  return questions.every((question) => {
    if (
      !question ||
      typeof question.question !== "string" ||
      !Array.isArray(question.options) ||
      question.options.length !== 4 ||
      !Number.isInteger(question.correctOption) ||
      question.correctOption < 0 ||
      question.correctOption > 3
    ) {
      return false;
    }

    const fingerprint = getQuestionFingerprint(
      question.question,
    );

    if (fingerprints.has(fingerprint)) {
      return false;
    }

    fingerprints.add(fingerprint);
    return true;
  });
}

export async function generateTutorAssessment(
  courseTitle,
  {
    applicantId = "",
    applicantEmail = "",
    attemptNumber = 1,
    excludedFingerprints = [],
  } = {},
) {
  const assessmentSeed = `${courseTitle}|${applicantId}|${applicantEmail}|${attemptNumber}|${Date.now()}|${Math.random()}`;

  try {
    const response = await fetch(
      "/api/tutor/assessment/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseTitle,
          applicantId,
          applicantEmail,
          attemptNumber,
          questionCount: TUTOR_ASSESSMENT_QUESTION_COUNT,
          durationMinutes:
            TUTOR_ASSESSMENT_DURATION_MINUTES,
          passMark: TUTOR_PASS_MARK,
          requireUniqueQuestions: true,
          excludeQuestionFingerprints:
            excludedFingerprints,
          assessmentSeed,
          includeTeachingScenarios: true,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Assessment endpoint unavailable");
    }

    const payload = await response.json();
    const questions = payload.questions || payload;

    if (!assessmentResponseIsValid(questions)) {
      throw new Error(
        "Assessment response contained repeated or invalid questions.",
      );
    }

    return questions.map((question, index) => {
      const fingerprint = getQuestionFingerprint(
        question.question,
      );

      return {
        id:
          question.id ||
          `AI-ASSESS-${hashText(assessmentSeed).toString(36)}-${
            index + 1
          }`,
        courseTitle,
        domain: question.domain || "Course knowledge",
        explanation: question.explanation || "",
        ...question,
        fingerprint,
      };
    });
  } catch {
    return generateFallbackTutorAssessment(courseTitle, {
      applicantId,
      attemptNumber,
      excludedFingerprints,
      assessmentSeed,
    });
  }
}

export function scoreTutorAssessment(questions, answers) {
  if (!questions.length) {
    return 0;
  }

  const correct = questions.reduce(
    (total, question) =>
      Number(answers[question.id]) ===
      Number(question.correctOption)
        ? total + 1
        : total,
    0,
  );

  return Math.round((correct / questions.length) * 100);
}

export function createAssessmentWindow() {
  const startedAt = new Date();
  const expiresAt = new Date(
    startedAt.getTime() +
      TUTOR_ASSESSMENT_DURATION_MINUTES * 60 * 1000,
  );

  return {
    assessmentStartedAt: startedAt.toISOString(),
    assessmentExpiresAt: expiresAt.toISOString(),
  };
}

export function createCooldownWindow() {
  const failedAt = new Date();
  const cooldownUntil = new Date(
    failedAt.getTime() +
      TUTOR_FAILED_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
  );

  return {
    failedAt: failedAt.toISOString(),
    cooldownUntil: cooldownUntil.toISOString(),
  };
}

export function getCooldownStatus(cooldownUntil) {
  const timestamp = Date.parse(cooldownUntil || "");

  if (!Number.isFinite(timestamp)) {
    return {
      active: false,
      remainingMilliseconds: 0,
      availableAt: "",
    };
  }

  const remainingMilliseconds = timestamp - Date.now();

  return {
    active: remainingMilliseconds > 0,
    remainingMilliseconds: Math.max(
      0,
      remainingMilliseconds,
    ),
    availableAt: new Date(timestamp).toISOString(),
  };
}

export function formatCooldownDate(value) {
  const timestamp = Date.parse(value || "");

  if (!Number.isFinite(timestamp)) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function normaliseApplicantEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function getApplicantRegistry() {
  return loadTutorValue(
    TUTOR_STORAGE_KEYS.applicantRegistry,
    {},
  );
}

export function recordTutorAssessmentFailure({
  applicantEmail,
  applicantId,
  courseTitle,
  score,
  cooldownUntil,
  failedAt,
}) {
  const email = normaliseApplicantEmail(applicantEmail);

  if (!email) {
    return;
  }

  const registry = getApplicantRegistry();

  saveTutorValue(TUTOR_STORAGE_KEYS.applicantRegistry, {
    ...registry,
    [email]: {
      applicantEmail: email,
      applicantId,
      courseTitle,
      score,
      failedAt,
      cooldownUntil,
      status: "cooldown",
    },
  });
}

export function clearTutorAssessmentFailure(
  applicantEmail,
) {
  const email = normaliseApplicantEmail(applicantEmail);

  if (!email) {
    return;
  }

  const registry = getApplicantRegistry();

  if (!registry[email]) {
    return;
  }

  const nextRegistry = {
    ...registry,
  };

  delete nextRegistry[email];

  saveTutorValue(
    TUTOR_STORAGE_KEYS.applicantRegistry,
    nextRegistry,
  );
}

export function getApplicantCooldown(applicantEmail) {
  const email = normaliseApplicantEmail(applicantEmail);
  const registry = getApplicantRegistry();
  const record = registry[email];

  if (!record) {
    return {
      active: false,
      cooldownUntil: "",
      record: null,
    };
  }

  const status = getCooldownStatus(record.cooldownUntil);

  return {
    ...status,
    cooldownUntil: record.cooldownUntil,
    record,
  };
}

export function beginTutorApplication({
  firstName,
  lastName,
  email,
  phone,
  courseTitle,
}) {
  const selectedCourseTitle =
    String(courseTitle || "").trim() ||
    "Frontend Development";

  const applicantEmail = normaliseApplicantEmail(email);
  const existingCooldown =
    getApplicantCooldown(applicantEmail);

  if (existingCooldown.active) {
    const currentOnboarding = loadTutorValue(
      TUTOR_STORAGE_KEYS.onboarding,
      defaultTutorOnboarding,
    );

    saveTutorValue(TUTOR_STORAGE_KEYS.profile, {
      ...defaultTutorProfile,
      firstName:
        String(firstName || "").trim() || "Tutor",
      lastName:
        String(lastName || "").trim() || "Applicant",
      email: applicantEmail,
      phone: String(phone || "").trim(),
      specialty:
        existingCooldown.record?.courseTitle ||
        selectedCourseTitle,
      teachingCourse:
        existingCooldown.record?.courseTitle ||
        selectedCourseTitle,
      headline: `${
        existingCooldown.record?.courseTitle ||
        selectedCourseTitle
      } Tutor Applicant`,
    });

    saveTutorValue(TUTOR_STORAGE_KEYS.onboarding, {
      ...defaultTutorOnboarding,
      ...currentOnboarding,
      applicantId:
        currentOnboarding.applicantId ||
        existingCooldown.record?.applicantId ||
        createApplicantId(),
      selectedCourseTitle:
        existingCooldown.record?.courseTitle ||
        currentOnboarding.selectedCourseTitle ||
        selectedCourseTitle,
      applicationStatus: "assessment_cooldown",
      failedAt:
        existingCooldown.record?.failedAt ||
        currentOnboarding.failedAt,
      cooldownUntil:
        existingCooldown.cooldownUntil,
      assessmentPassed: false,
      approved: false,
    });

    window.location.href = "/tutor/assessment";
    return;
  }

  const applicantId = createApplicantId();

  saveTutorValue(TUTOR_STORAGE_KEYS.profile, {
    ...defaultTutorProfile,
    id: applicantId,
    firstName:
      String(firstName || "").trim() || "Tutor",
    lastName:
      String(lastName || "").trim() || "Applicant",
    email: applicantEmail,
    phone: String(phone || "").trim(),
    specialty: selectedCourseTitle,
    teachingCourse: selectedCourseTitle,
    headline: `${selectedCourseTitle} Tutor Applicant`,
  });

  saveTutorValue(TUTOR_STORAGE_KEYS.onboarding, {
    ...defaultTutorOnboarding,
    applicantId,
    selectedCourseTitle,
    assessmentQuestionCount:
      TUTOR_ASSESSMENT_QUESTION_COUNT,
    applicationStatus: "assessment_required",
  });

  saveTutorValue(TUTOR_STORAGE_KEYS.agreement, {
    legalName: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    payoutCurrency: "NGN",
    signature: "",
    acceptedRevenueShare: false,
    acceptedPartnershipTerms: false,
    signedAt: "",
  });

  window.location.href = "/tutor/assessment";
}

export function getTutorLandingPath() {
  const onboarding = loadTutorValue(
    TUTOR_STORAGE_KEYS.onboarding,
    defaultTutorOnboarding,
  );

  if (!onboarding.assessmentPassed) {
    return "/tutor/assessment";
  }

  if (!onboarding.agreementSigned) {
    return "/tutor/agreement";
  }

  return "/tutor/dashboard";
}

export function tutorHasWorkspaceAccess(onboarding) {
  return Boolean(
    onboarding?.assessmentPassed &&
      onboarding?.agreementSigned &&
      onboarding?.approved,
  );
}
