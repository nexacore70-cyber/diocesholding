export const CLIENT_STORAGE_KEYS = {
  profile: "nexacore_client_profile_v1",
  projects: "nexacore_client_projects_v1",
  bids: "nexacore_client_bids_v1",
  messages: "nexacore_client_messages_v1",
  payments: "nexacore_client_payments_v1",
  reviews: "nexacore_client_reviews_v1",
  support: "nexacore_client_support_v1",
  files: "nexacore_client_files_v1",
};

export const TALENT_PUBLIC_PROFILE_STORAGE_KEY =
  "nexacore_talent_public_profiles_v1";

export const CLIENT_DEPOSIT_PERCENT = 25;
export const CLIENT_FINAL_PERCENT = 75;
export const TALENT_PAYOUT_PERCENT = 80;
export const NEXACORE_FEE_PERCENT = 20;

export const serviceCategories = [
  {
    id: "software-development",
    title: "Software Development",
    description:
      "Web applications, mobile products, APIs, testing and complete software delivery.",
    image: "/images/hero/banner1.png",
    services: [
      "Full Stack Development",
      "Frontend Development",
      "Backend Development",
      "Mobile App Development",
      "API Development",
      "Software Testing and QA",
      "WordPress Development",
      "E-commerce Development",
    ],
  },
  {
    id: "data-ai",
    title: "Data and AI",
    description:
      "Analytics, dashboards, machine learning, automation and intelligent business systems.",
    image: "/images/hero/banner2.png",
    services: [
      "Data Analysis",
      "Data Science",
      "AI and Machine Learning",
      "Business Intelligence",
      "Power BI Dashboard",
      "Excel Analytics",
      "AI Automation",
      "Chatbot Development",
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    description:
      "Security reviews, risk assessments, cloud protection and compliance support.",
    image: "/images/hero/banner3.png",
    services: [
      "Security Assessment",
      "Network Security",
      "Cloud Security",
      "GRC and Risk Management",
      "Data Privacy Consulting",
      "Vulnerability Review",
    ],
  },
  {
    id: "design-product",
    title: "Design and Product",
    description:
      "UI/UX, research, product strategy, graphic design and complete design systems.",
    image: "/images/hero/banner4.png",
    services: [
      "UI/UX Design",
      "Product Design",
      "Graphic Design",
      "Brand Identity",
      "Design Systems",
      "User Research",
      "Product Management",
    ],
  },
  {
    id: "creative-media",
    title: "Videography and Creative Media",
    description:
      "Video production, AI video, motion design, animation and campaign content.",
    image: "/images/hero/banner2.png",
    services: [
      "Videography",
      "Video Editing",
      "AI Video Creation",
      "Motion Graphics",
      "2D Animation",
      "3D Animation",
      "Movie Production",
      "VFX and Compositing",
      "Social Media Content",
    ],
  },
  {
    id: "business-digital",
    title: "Business and Digital",
    description:
      "Digital growth, project operations, virtual assistance and technology sales.",
    image: "/images/hero/banner3.png",
    services: [
      "Digital Marketing",
      "Social Media Management",
      "SEO",
      "Project Management",
      "Virtual Assistance",
      "Tech Sales",
      "No-Code Development",
    ],
  },
];

export const talentProfiles = [
  {
    id: "TAL-1001",
    name: "Chinedu Okoro",
    initials: "CO",
    title: "Senior Full Stack Developer",
    location: "Lagos, Nigeria",
    timezone: "WAT (UTC+1)",
    hourlyRate: 35,
    currency: "USD",
    rating: 4.9,
    completedProjects: 47,
    responseTime: "Usually responds within 1 hour",
    verified: true,
    available: true,
    skills: [
      "React",
      "Node.js",
      "PostgreSQL",
      "TypeScript",
      "API Development",
    ],
    bio:
      "I build production-ready web platforms, client dashboards and scalable APIs for growing businesses.",
    reviews: [
      {
        id: "TR-1001",
        client: "Mira Logistics",
        rating: 5,
        text:
          "Strong technical delivery, excellent communication and clear documentation.",
      },
      {
        id: "TR-1002",
        client: "Nova Retail",
        rating: 5,
        text:
          "The application was delivered ahead of schedule and passed our internal review.",
      },
    ],
    portfolio: [
      {
        id: "PORT-1001",
        title: "Logistics Operations Platform",
        type: "Web Application",
        image: "/images/hero/banner1.png",
        description:
          "Role-based logistics platform with dashboards, payments, reporting and customer communication.",
      },
      {
        id: "PORT-1002",
        title: "Retail Inventory API",
        type: "Backend and API",
        image: "/images/hero/banner3.png",
        description:
          "Inventory and order API with authentication, audit logs and analytics.",
      },
    ],
  },
  {
    id: "TAL-1002",
    name: "Amina Yusuf",
    initials: "AY",
    title: "Product and UI/UX Designer",
    location: "Abuja, Nigeria",
    timezone: "WAT (UTC+1)",
    hourlyRate: 28,
    currency: "USD",
    rating: 4.8,
    completedProjects: 35,
    responseTime: "Usually responds within 2 hours",
    verified: true,
    available: true,
    skills: [
      "Figma",
      "Product Design",
      "User Research",
      "Prototyping",
      "Design Systems",
    ],
    bio:
      "I design usable digital products from research and user flows through high-fidelity prototypes and design systems.",
    reviews: [
      {
        id: "TR-2001",
        client: "Crest Finance",
        rating: 5,
        text:
          "Amina transformed a complex workflow into a simple and polished experience.",
      },
    ],
    portfolio: [
      {
        id: "PORT-2001",
        title: "Fintech Mobile Product",
        type: "Product Design",
        image: "/images/hero/banner4.png",
        description:
          "Research, user journeys, prototype and design system for a mobile payment product.",
      },
      {
        id: "PORT-2002",
        title: "Healthcare Booking Experience",
        type: "UI/UX",
        image: "/images/hero/banner2.png",
        description:
          "Responsive booking and patient onboarding experience for a healthcare provider.",
      },
    ],
  },
  {
    id: "TAL-1003",
    name: "Daniel Mensah",
    initials: "DM",
    title: "Data Analyst and Power BI Specialist",
    location: "Accra, Ghana",
    timezone: "GMT (UTC+0)",
    hourlyRate: 30,
    currency: "USD",
    rating: 4.7,
    completedProjects: 29,
    responseTime: "Usually responds within 3 hours",
    verified: true,
    available: true,
    skills: [
      "Power BI",
      "SQL",
      "Excel",
      "Python",
      "Business Intelligence",
    ],
    bio:
      "I help organisations turn operational data into reliable dashboards, reports and business recommendations.",
    reviews: [
      {
        id: "TR-3001",
        client: "Westbridge Foods",
        rating: 5,
        text:
          "The dashboards are easy to understand and now guide our weekly management meetings.",
      },
    ],
    portfolio: [
      {
        id: "PORT-3001",
        title: "Executive Sales Dashboard",
        type: "Business Intelligence",
        image: "/images/hero/banner2.png",
        description:
          "Power BI dashboard covering revenue, customer segments, products and regional performance.",
      },
    ],
  },
  {
    id: "TAL-1004",
    name: "Esther Paul",
    initials: "EP",
    title: "AI Video and Motion Graphics Creator",
    location: "Port Harcourt, Nigeria",
    timezone: "WAT (UTC+1)",
    hourlyRate: 32,
    currency: "USD",
    rating: 4.9,
    completedProjects: 41,
    responseTime: "Usually responds within 1 hour",
    verified: true,
    available: true,
    skills: [
      "AI Video",
      "Video Editing",
      "Motion Graphics",
      "Storyboarding",
      "Sound Design",
    ],
    bio:
      "I create campaign videos, product explainers and AI-assisted visual stories from concept through final edit.",
    reviews: [
      {
        id: "TR-4001",
        client: "BrightLearn",
        rating: 5,
        text:
          "The animation was creative, brand-aligned and delivered in every required format.",
      },
    ],
    portfolio: [
      {
        id: "PORT-4001",
        title: "AI Product Explainer",
        type: "AI Video",
        image: "/images/hero/banner3.png",
        description:
          "Script, generated scenes, voice, motion graphics, editing and final campaign exports.",
      },
      {
        id: "PORT-4002",
        title: "Animated Learning Series",
        type: "2D Animation",
        image: "/images/hero/banner4.png",
        description:
          "Ten-part animated educational series with characters, narration and sound design.",
      },
    ],
  },
];

export const defaultClientProfile = {
  id: "CLIENT-1001",
  firstName: "Client",
  lastName: "Account",
  email: "client@nexacore.com",
  phone: "",
  companyName: "NexaCore Client Company",
  companyWebsite: "",
  industry: "",
  location: "Nigeria",
  profilePhoto: "",
};

export const defaultProjects = [
  {
    id: "PRJ-1001",
    title: "Build a responsive service marketplace",
    categoryId: "software-development",
    service: "Full Stack Development",
    description:
      "We need a responsive marketplace with client, talent and administrator dashboards, project bidding, payments and messaging.",
    budget: 6500,
    currency: "USD",
    deadline: "2026-09-30",
    skills: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Payments",
    ],
    attachments: ["marketplace-requirements.pdf"],
    status: "bids_received",
    createdAt: "2026-07-12T09:00:00",
    selectedBidId: "",
    selectedTalentId: "",
    depositRequired: 0,
    depositPaid: 0,
    finalRequired: 0,
    finalPaid: 0,
    escrowStatus: "not_funded",
    finalDeliveryStatus: "locked",
    payoutStatus: "not_due",
  },
];

export const defaultBids = [
  {
    id: "BID-1001",
    projectId: "PRJ-1001",
    talentId: "TAL-1001",
    amount: 6200,
    currency: "USD",
    deliveryDays: 55,
    coverLetter:
      "I will deliver the marketplace in documented phases: architecture, client dashboard, talent workflow, escrow integration, testing and deployment.",
    milestones: [
      {
        title: "Architecture and product foundation",
        amount: 1550,
      },
      {
        title: "Marketplace dashboards and bidding",
        amount: 1860,
      },
      {
        title: "Payments, files and messaging",
        amount: 1550,
      },
      {
        title: "Testing and deployment",
        amount: 1240,
      },
    ],
    status: "active",
    createdAt: "2026-07-12T10:00:00",
  },
  {
    id: "BID-1002",
    projectId: "PRJ-1001",
    talentId: "TAL-1002",
    amount: 5800,
    currency: "USD",
    deliveryDays: 45,
    coverLetter:
      "I can lead the complete product design and collaborate with your selected developer. My bid includes research, user flows, responsive screens and design-system documentation.",
    milestones: [
      {
        title: "Research and user flows",
        amount: 1450,
      },
      {
        title: "Dashboard designs",
        amount: 1740,
      },
      {
        title: "Design system",
        amount: 1450,
      },
      {
        title: "Developer handoff and support",
        amount: 1160,
      },
    ],
    status: "active",
    createdAt: "2026-07-12T10:30:00",
  },
  {
    id: "BID-1003",
    projectId: "PRJ-1001",
    talentId: "TAL-1003",
    amount: 4100,
    currency: "USD",
    deliveryDays: 40,
    coverLetter:
      "I will implement the reporting and performance dashboards, including project analytics, payments and operational indicators.",
    milestones: [
      {
        title: "Reporting requirements",
        amount: 1025,
      },
      {
        title: "Data model and metrics",
        amount: 1230,
      },
      {
        title: "Dashboard implementation",
        amount: 1025,
      },
      {
        title: "Testing and documentation",
        amount: 820,
      },
    ],
    status: "active",
    createdAt: "2026-07-12T11:00:00",
  },
];

export const defaultClientMessages = {
  "talent-TAL-1001": [
    {
      id: "MSG-1001",
      senderType: "talent",
      senderName: "Chinedu Okoro",
      text:
        "Thank you for reviewing my proposal. I can explain the architecture and delivery plan during a call.",
      createdAt: "2026-07-12T10:20:00",
    },
  ],
  "talent-TAL-1002": [
    {
      id: "MSG-2001",
      senderType: "talent",
      senderName: "Amina Yusuf",
      text:
        "I have included a product-design approach in my bid. I can also share a live Figma walkthrough.",
      createdAt: "2026-07-12T10:45:00",
    },
  ],
  "project-PRJ-1001": [
    {
      id: "MSG-PROJ-1",
      senderType: "system",
      senderName: "NexaCore",
      text:
        "Project room created. Select a bid and validate the 25% escrow deposit to dispatch the project.",
      createdAt: "2026-07-12T11:10:00",
    },
  ],
};

export const defaultPayments = [
  {
    id: "PAY-INFO-1",
    projectId: "PRJ-1001",
    type: "escrow_information",
    amount: 0,
    currency: "USD",
    status: "information",
    createdAt: "2026-07-12T09:00:00",
    reference: "",
  },
];

export const defaultClientFiles = [
  {
    id: "FILE-1001",
    projectId: "PRJ-1001",
    uploadedBy: "client",
    fileName: "marketplace-requirements.pdf",
    fileType: "PDF",
    visibility: "project",
    deliveryType: "requirement",
    status: "available",
    createdAt: "2026-07-12T09:00:00",
  },
];

export const defaultClientReviews = [];

export const defaultSupportTickets = [
  {
    id: "SUP-1001",
    subject: "How is escrow released?",
    category: "Payments and Escrow",
    message:
      "Please explain when project funds are released to the talent.",
    status: "answered",
    response:
      "Funds remain in NexaCore escrow until the required funding and delivery conditions are satisfied. The talent receives 80% and NexaCore retains 20%.",
    createdAt: "2026-07-10T10:00:00",
  },
];

export function loadClientValue(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);

    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored);

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

export function saveClientValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The interface remains usable when browser storage is unavailable.
  }
}

export function formatProjectMoney(value, currency = "USD") {
  return new Intl.NumberFormat(
    currency === "NGN" ? "en-NG" : "en-US",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(Number(value || 0));
}

export function getServiceCategory(categoryId) {
  return serviceCategories.find(
    (category) => category.id === categoryId,
  );
}

export function getTalentProfile(talentId) {
  const builtInProfile = talentProfiles.find(
    (talent) => talent.id === talentId,
  );

  let publishedProfile = null;

  try {
    const registry = JSON.parse(
      window.localStorage.getItem(
        TALENT_PUBLIC_PROFILE_STORAGE_KEY,
      ) || "{}",
    );

    publishedProfile = registry[talentId] || null;
  } catch {
    publishedProfile = null;
  }

  if (!publishedProfile) {
    return builtInProfile;
  }

  return {
    ...(builtInProfile || {}),
    ...publishedProfile,
    id: talentId,
    portfolio:
      publishedProfile.portfolio?.length > 0
        ? publishedProfile.portfolio
        : builtInProfile?.portfolio || [],
    reviews:
      publishedProfile.reviews?.length > 0
        ? publishedProfile.reviews
        : builtInProfile?.reviews || [],
  };
}

export function getProject(projects, projectId) {
  return projects.find(
    (project) => project.id === projectId,
  );
}

export function getProjectBids(projectId) {
  return defaultBids.filter(
    (bid) => bid.projectId === projectId,
  );
}

export function calculateEscrowBreakdown(
  project,
  acceptedBid,
) {
  const total = Number(
    acceptedBid?.amount || project?.budget || 0,
  );

  const deposit = Math.round(
    total * (CLIENT_DEPOSIT_PERCENT / 100),
  );

  const finalPayment = total - deposit;

  const talentPayout = Math.round(
    total * (TALENT_PAYOUT_PERCENT / 100),
  );

  const companyFee = total - talentPayout;

  return {
    total,
    deposit,
    finalPayment,
    talentPayout,
    companyFee,
  };
}

export function beginClientAccount({
  firstName,
  lastName,
  email,
  phone,
  companyName,
}) {
  saveClientValue(CLIENT_STORAGE_KEYS.profile, {
    ...defaultClientProfile,
    id: `CLIENT-${Date.now()}`,
    firstName:
      String(firstName || "").trim() || "Client",
    lastName:
      String(lastName || "").trim() || "Account",
    email: String(email || "").trim(),
    phone: String(phone || "").trim(),
    companyName:
      String(companyName || "").trim() ||
      "Client Company",
  });

  window.location.href = "/client/dashboard";
}

export function getClientLandingPath() {
  return "/client/dashboard";
}
