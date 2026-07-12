export const TALENT_STORAGE_KEYS = {
  profile: "nexacore_talent_profile_v1",
  publicProfiles: "nexacore_talent_public_profiles_v1",
  jobs: "nexacore_talent_jobs_v1",
  bids: "nexacore_client_bids_v1",
  savedJobs: "nexacore_talent_saved_jobs_v1",
  portfolio: "nexacore_talent_portfolio_v1",
  messages: "nexacore_client_messages_v1",
  availability: "nexacore_talent_availability_v1",
  subscription: "nexacore_talent_subscription_v1",
  payout: "nexacore_talent_payout_v1",
  notifications: "nexacore_talent_notifications_v1",
  clientProjects: "nexacore_client_projects_v1",
  clientPayments: "nexacore_client_payments_v1",
  clientFiles: "nexacore_client_files_v1",
  clientReviews: "nexacore_client_reviews_v1",
};

export const TALENT_SHARE_PERCENT = 80;
export const NEXACORE_SHARE_PERCENT = 20;

export const defaultTalentProfile = {
  id: "TAL-1001",
  firstName: "Chinedu",
  lastName: "Okoro",
  displayName: "Chinedu Okoro",
  email: "chinedu@example.com",
  phone: "+234 800 000 0000",
  title: "Senior Full Stack Developer",
  professionalCategory: "Software Development",
  primaryService: "Full Stack Development",
  location: "Lagos, Nigeria",
  timezone: "Africa/Lagos",
  hourlyRate: 35,
  currency: "USD",
  experienceLevel: "Expert",
  yearsExperience: 7,
  bio:
    "I build production-ready web platforms, dashboards and APIs for growing organisations. My work includes architecture, frontend systems, backend services, payments, testing and deployment.",
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "API Development",
    "Payment Integration",
  ],
  languages: [
    {
      name: "English",
      level: "Fluent",
    },
  ],
  profilePhoto: "",
  verified: true,
  profilePublished: true,
  rating: 4.9,
  completedProjects: 47,
  responseTime: "Usually responds within 1 hour",
};

export const defaultPortfolio = [
  {
    id: "PORT-1001",
    title: "Logistics Operations Platform",
    category: "Web Application",
    description:
      "A multi-role logistics platform with shipment tracking, customer dashboards, payments, reporting and operational workflows.",
    image: "/images/hero/banner1.png",
    liveUrl: "https://example.com/logistics",
    repositoryUrl: "",
    skills: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Payments",
    ],
    featured: true,
    visibility: "public",
    createdAt: "2026-07-01T10:00:00",
  },
  {
    id: "PORT-1002",
    title: "Retail Inventory and Order API",
    category: "Backend and API",
    description:
      "A secure inventory and order-management API with authentication, audit records, analytics and integration documentation.",
    image: "/images/hero/banner3.png",
    liveUrl: "",
    repositoryUrl: "https://github.com/example/inventory-api",
    skills: [
      "Node.js",
      "PostgreSQL",
      "REST API",
      "Testing",
    ],
    featured: false,
    visibility: "public",
    createdAt: "2026-07-03T12:00:00",
  },
];

export const defaultMatchingJobs = [
  {
    id: "PRJ-1001",
    title: "Build a responsive service marketplace",
    clientId: "CLIENT-1001",
    clientName: "NexaCore Client Company",
    clientInitials: "NC",
    clientLocation: "Nigeria",
    clientRating: 4.8,
    clientSpend: 28000,
    clientVerified: true,
    categoryId: "software-development",
    category: "Software Development",
    service: "Full Stack Development",
    description:
      "We need a responsive marketplace with client, talent and administrator dashboards, bidding, escrow payments, files and messaging.",
    budget: 6500,
    currency: "USD",
    budgetType: "fixed",
    deadline: "2026-09-30",
    postedAt: "2026-07-12T09:00:00",
    proposals: 3,
    experienceLevel: "Expert",
    skills: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Payments",
      "Realtime Messaging",
    ],
    attachments: ["marketplace-requirements.pdf"],
    fitScore: 96,
    matchReasons: [
      "5 required skills match your profile",
      "Budget is within your preferred range",
      "Client payment method is verified",
      "Project matches your portfolio history",
    ],
    status: "open",
  },
  {
    id: "JOB-2001",
    title: "Develop an executive Power BI reporting system",
    clientId: "CLIENT-2002",
    clientName: "Westbridge Manufacturing",
    clientInitials: "WM",
    clientLocation: "Ghana",
    clientRating: 4.7,
    clientSpend: 14500,
    clientVerified: true,
    categoryId: "data-ai",
    category: "Data and AI",
    service: "Business Intelligence",
    description:
      "Create an executive dashboard covering sales, operations, inventory, regional performance and management reporting.",
    budget: 3200,
    currency: "USD",
    budgetType: "fixed",
    deadline: "2026-08-30",
    postedAt: "2026-07-12T11:20:00",
    proposals: 7,
    experienceLevel: "Intermediate",
    skills: [
      "Power BI",
      "SQL",
      "Excel",
      "Data Modelling",
    ],
    attachments: ["reporting-sample.xlsx"],
    fitScore: 58,
    matchReasons: [
      "One secondary skill matches",
      "Verified client",
      "Remote-friendly project",
    ],
    status: "open",
  },
  {
    id: "JOB-3001",
    title: "Design and animate an AI product explainer",
    clientId: "CLIENT-3001",
    clientName: "BrightLearn Africa",
    clientInitials: "BA",
    clientLocation: "Kenya",
    clientRating: 4.9,
    clientSpend: 9100,
    clientVerified: true,
    categoryId: "creative-media",
    category: "Videography and Creative Media",
    service: "AI Video Creation",
    description:
      "Produce a 90-second AI-assisted product explainer including script refinement, generated scenes, motion graphics, narration and social-media exports.",
    budget: 2400,
    currency: "USD",
    budgetType: "fixed",
    deadline: "2026-08-18",
    postedAt: "2026-07-12T12:40:00",
    proposals: 5,
    experienceLevel: "Expert",
    skills: [
      "AI Video",
      "Motion Graphics",
      "Video Editing",
      "Storyboarding",
    ],
    attachments: ["brand-guide.pdf"],
    fitScore: 36,
    matchReasons: [
      "Verified client",
      "Budget is within your marketplace range",
    ],
    status: "open",
  },
  {
    id: "JOB-4001",
    title: "Build a React customer operations dashboard",
    clientId: "CLIENT-4001",
    clientName: "Crestline Services",
    clientInitials: "CS",
    clientLocation: "United Kingdom",
    clientRating: 4.6,
    clientSpend: 42000,
    clientVerified: true,
    categoryId: "software-development",
    category: "Software Development",
    service: "Frontend Development",
    description:
      "Implement a responsive React dashboard from approved designs. The work includes reusable components, charts, filters, authentication states and API integration.",
    budget: 4800,
    currency: "USD",
    budgetType: "fixed",
    deadline: "2026-09-15",
    postedAt: "2026-07-12T14:00:00",
    proposals: 9,
    experienceLevel: "Expert",
    skills: [
      "React",
      "TypeScript",
      "REST API",
      "Responsive Design",
      "Testing",
    ],
    attachments: ["dashboard-wireframes.pdf"],
    fitScore: 91,
    matchReasons: [
      "React and TypeScript match",
      "Experience level matches",
      "Similar portfolio work",
      "Verified high-spend client",
    ],
    status: "open",
  },
];

export const defaultTalentBids = [
  {
    id: "BID-1001",
    projectId: "PRJ-1001",
    talentId: "TAL-1001",
    amount: 6200,
    currency: "USD",
    deliveryDays: 55,
    coverLetter:
      "I will deliver the marketplace in documented phases covering architecture, client and talent dashboards, bidding, escrow integration, testing and deployment.",
    milestones: [
      {
        id: "MS-1001",
        title: "Architecture and product foundation",
        amount: 1550,
        durationDays: 12,
      },
      {
        id: "MS-1002",
        title: "Marketplace dashboards and bidding",
        amount: 1860,
        durationDays: 15,
      },
      {
        id: "MS-1003",
        title: "Payments, files and messaging",
        amount: 1550,
        durationDays: 14,
      },
      {
        id: "MS-1004",
        title: "Testing and deployment",
        amount: 1240,
        durationDays: 14,
      },
    ],
    status: "active",
    createdAt: "2026-07-12T10:00:00",
    updatedAt: "2026-07-12T10:00:00",
  },
];

export const defaultAvailability = {
  status: "available",
  acceptingNewProjects: true,
  weeklyCapacityHours: 30,
  preferredProjectSize: "medium",
  preferredMinimumBudget: 1000,
  preferredCurrency: "USD",
  timezone: "Africa/Lagos",
  responseWindowHours: 2,
  vacationMode: false,
  vacationStart: "",
  vacationEnd: "",
  workingDays: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ],
  workingStart: "09:00",
  workingEnd: "18:00",
};

export const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter",
    monthlyPriceUsd: 0,
    description:
      "Build a public profile, send proposals and receive project calls.",
    features: [
      "Unlimited job browsing",
      "Up to 10 active proposals",
      "Public portfolio",
      "Direct client messages",
      "Voice and video calls",
      "Secure escrow visibility",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPriceUsd: 19,
    description:
      "Advanced tools for active independent professionals.",
    features: [
      "Everything in Starter",
      "Unlimited active proposals",
      "AI proposal assistant",
      "Advanced job-fit explanations",
      "Portfolio analytics",
      "Priority profile review",
      "Priority support",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    monthlyPriceUsd: 49,
    description:
      "Collaboration, team visibility and higher-capacity delivery.",
    features: [
      "Everything in Professional",
      "Team portfolio",
      "Multi-member project rooms",
      "Shared availability",
      "Client presentation pages",
      "Studio earnings analytics",
      "Dedicated support",
    ],
  },
];

export const defaultSubscription = {
  planId: "starter",
  status: "active",
  startedAt: "2026-07-01T00:00:00",
  renewsAt: "",
  paymentReference: "",
};

export const defaultPayout = {
  currency: "USD",
  method: "bank",
  bankName: "",
  accountName: "",
  accountNumber: "",
  routingCode: "",
  country: "Nigeria",
  verified: false,
  payoutRequests: [],
};

export const defaultTalentMessages = {
  "talent-TAL-1001": [
    {
      id: "MSG-1001",
      senderType: "client",
      senderName: "NexaCore Client Company",
      text:
        "Thank you for your proposal. Can you explain how you will structure the payment and messaging modules?",
      createdAt: "2026-07-12T10:20:00",
    },
  ],
  "project-PRJ-1001": [
    {
      id: "MSG-PROJ-1",
      senderType: "system",
      senderName: "NexaCore",
      text:
        "Project-room access will activate after the client selects your bid and the 25% escrow deposit is verified.",
      createdAt: "2026-07-12T11:10:00",
    },
  ],
};

export const defaultTalentRatings = [
  {
    id: "RATE-1001",
    projectId: "OLD-1001",
    clientName: "Mira Logistics",
    rating: 5,
    communication: 5,
    quality: 5,
    timeliness: 5,
    comment:
      "Strong technical delivery, clear communication and excellent documentation.",
    createdAt: "2026-06-10T10:00:00",
  },
  {
    id: "RATE-1002",
    projectId: "OLD-1002",
    clientName: "Nova Retail",
    rating: 5,
    communication: 5,
    quality: 5,
    timeliness: 4,
    comment:
      "The platform was delivered ahead of schedule and passed our internal review.",
    createdAt: "2026-06-22T10:00:00",
  },
];

export const defaultNotifications = [
  {
    id: "NOTE-1001",
    type: "job_match",
    title: "96% job match",
    message:
      "Build a responsive service marketplace matches your skills and portfolio.",
    read: false,
    createdAt: "2026-07-12T09:05:00",
  },
  {
    id: "NOTE-1002",
    type: "message",
    title: "New client message",
    message:
      "NexaCore Client Company sent a question about your proposal.",
    read: false,
    createdAt: "2026-07-12T10:20:00",
  },
];

export const fallbackClientProjects = [
  {
    id: "PRJ-1001",
    title: "Build a responsive service marketplace",
    categoryId: "software-development",
    service: "Full Stack Development",
    description:
      "Responsive marketplace with client, talent and administrator dashboards, bidding, escrow, files and messaging.",
    budget: 6500,
    currency: "USD",
    deadline: "2026-09-30",
    skills: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Payments",
    ],
    status: "bids_received",
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

export const fallbackClientPayments = [];

export const fallbackClientFiles = [
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

export function loadTalentValue(key, fallback) {
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

export function saveTalentValue(key, value) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value),
    );
  } catch {
    // The prototype remains usable when browser storage is unavailable.
  }
}

export function formatTalentMoney(
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

export function getTalentInitials(profile) {
  return `${profile.firstName?.[0] || "T"}${
    profile.lastName?.[0] || ""
  }`.toUpperCase();
}

export function getMatchingJob(jobs, jobId) {
  return jobs.find((job) => job.id === jobId);
}

export function getTalentBid(bids, bidId) {
  return bids.find((bid) => bid.id === bidId);
}

export function getTalentBidForProject(
  bids,
  projectId,
  talentId,
) {
  return bids.find(
    (bid) =>
      bid.projectId === projectId &&
      bid.talentId === talentId,
  );
}

export function calculateTalentProjectMoney(project) {
  const total = Number(project?.budget || 0);
  const verifiedClientFunds =
    Number(project?.depositPaid || 0) +
    Number(project?.finalPaid || 0);

  const securedTalentShare = Math.round(
    verifiedClientFunds *
      (TALENT_SHARE_PERCENT / 100),
  );

  const totalTalentShare = Math.round(
    total * (TALENT_SHARE_PERCENT / 100),
  );

  const nexacoreShare =
    total - totalTalentShare;

  const available =
    project?.payoutStatus === "released"
      ? Number(
          project.talentPayoutAmount ||
            totalTalentShare,
        )
      : 0;

  const pendingApproval =
    project?.escrowStatus === "fully_funded" &&
    project?.payoutStatus !== "released"
      ? totalTalentShare
      : 0;

  return {
    total,
    verifiedClientFunds,
    securedTalentShare,
    totalTalentShare,
    nexacoreShare,
    available,
    pendingApproval,
  };
}

export function getTalentEarningsSummary(projects, talentId) {
  return projects
    .filter(
      (project) =>
        project.selectedTalentId === talentId,
    )
    .reduce(
      (summary, project) => {
        const amounts =
          calculateTalentProjectMoney(project);

        return {
          available:
            summary.available + amounts.available,
          pendingApproval:
            summary.pendingApproval +
            amounts.pendingApproval,
          securedInEscrow:
            summary.securedInEscrow +
            Math.max(
              0,
              amounts.securedTalentShare -
                amounts.available,
            ),
          lifetime:
            summary.lifetime + amounts.available,
        };
      },
      {
        available: 0,
        pendingApproval: 0,
        securedInEscrow: 0,
        lifetime: 0,
      },
    );
}

export function publishTalentProfile(
  profile,
  portfolio,
  availability,
  ratings = defaultTalentRatings,
) {
  const registry = loadTalentValue(
    TALENT_STORAGE_KEYS.publicProfiles,
    {},
  );

  const rating =
    ratings.length > 0
      ? Number(
          (
            ratings.reduce(
              (sum, item) =>
                sum + Number(item.rating || 0),
              0,
            ) / ratings.length
          ).toFixed(1),
        )
      : Number(profile.rating || 0);

  const publicProfile = {
    id: profile.id,
    name:
      profile.displayName ||
      `${profile.firstName} ${profile.lastName}`,
    initials: getTalentInitials(profile),
    title: profile.title,
    location: profile.location,
    timezone: availability.timezone,
    hourlyRate: Number(profile.hourlyRate || 0),
    currency: profile.currency || "USD",
    rating,
    completedProjects: Number(
      profile.completedProjects || 0,
    ),
    responseTime: `${availability.responseWindowHours}-hour response target`,
    verified: Boolean(profile.verified),
    available:
      availability.status === "available" &&
      availability.acceptingNewProjects &&
      !availability.vacationMode,
    skills: profile.skills || [],
    bio: profile.bio,
    reviews: ratings.map((review) => ({
      id: review.id,
      client: review.clientName,
      rating: review.rating,
      text: review.comment,
    })),
    portfolio: portfolio
      .filter(
        (item) => item.visibility === "public",
      )
      .map((item) => ({
        id: item.id,
        title: item.title,
        type: item.category,
        image:
          item.image ||
          "/images/hero/banner1.png",
        description: item.description,
        liveUrl: item.liveUrl,
        repositoryUrl: item.repositoryUrl,
        skills: item.skills,
      })),
    updatedAt: new Date().toISOString(),
  };

  saveTalentValue(
    TALENT_STORAGE_KEYS.publicProfiles,
    {
      ...registry,
      [profile.id]: publicProfile,
    },
  );

  return publicProfile;
}

export function beginTalentAccount({
  firstName,
  lastName,
  email,
  phone,
  professionalSkill,
}) {
  const profile = {
    ...defaultTalentProfile,
    id: `TAL-${Date.now()}`,
    firstName:
      String(firstName || "").trim() || "Talent",
    lastName:
      String(lastName || "").trim() ||
      "Professional",
    displayName: `${String(
      firstName || "Talent",
    ).trim()} ${String(
      lastName || "Professional",
    ).trim()}`.trim(),
    email: String(email || "").trim(),
    phone: String(phone || "").trim(),
    primaryService:
      String(professionalSkill || "").trim() ||
      "Technology Professional",
    title: `${
      String(professionalSkill || "").trim() ||
      "Technology"
    } Professional`,
    profilePublished: false,
    verified: false,
    completedProjects: 0,
    rating: 0,
  };

  saveTalentValue(
    TALENT_STORAGE_KEYS.profile,
    profile,
  );

  saveTalentValue(
    TALENT_STORAGE_KEYS.portfolio,
    [],
  );

  saveTalentValue(
    TALENT_STORAGE_KEYS.availability,
    defaultAvailability,
  );

  saveTalentValue(
    TALENT_STORAGE_KEYS.subscription,
    defaultSubscription,
  );

  window.location.href = "/talent/portfolio";
}

export function getTalentLandingPath() {
  const profile = loadTalentValue(
    TALENT_STORAGE_KEYS.profile,
    defaultTalentProfile,
  );

  if (!profile.profilePublished) {
    return "/talent/portfolio";
  }

  return "/talent/dashboard";
}
