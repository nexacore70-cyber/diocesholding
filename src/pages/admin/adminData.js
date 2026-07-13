export const ADMIN_STORAGE_KEYS = {
  session: "nexacore_admin_session_v1",
  users: "nexacore_admin_users_v1",
  kyc: "nexacore_admin_kyc_v1",
  courses: "nexacore_admin_courses_v1",
  disputes: "nexacore_admin_disputes_v1",
  categories: "nexacore_admin_categories_v1",
  staff: "nexacore_admin_staff_v1",
  audit: "nexacore_admin_audit_v1",
  settings: "nexacore_admin_settings_v1",
  reports: "nexacore_admin_reports_v1",
  notifications: "nexacore_admin_notifications_v1",
  clientProjects: "nexacore_client_projects_v1",
  clientPayments: "nexacore_client_payments_v1",
  clientSupport: "nexacore_client_support_v1",
  clientFiles: "nexacore_client_files_v1",
  clientReviews: "nexacore_client_reviews_v1",
  clientProfile: "nexacore_client_profile_v1",
  talentProfile: "nexacore_talent_profile_v1",
  talentPublicProfiles: "nexacore_talent_public_profiles_v1",
  tutorProfile: "nexacore_tutor_profile_v1",
  tutorOnboarding: "nexacore_tutor_onboarding_v1",
  tutorAgreement: "nexacore_tutor_agreement_v1",
  studentProfile: "nexacore_student_profile_v3",
  studentEnrollments: "nexacore_student_enrollments_v3",
};

export const ADMIN_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  OPERATIONS_ADMIN: "OPERATIONS_ADMIN",
  KYC_OFFICER: "KYC_OFFICER",
  ACADEMY_MANAGER: "ACADEMY_MANAGER",
  FINANCE_OFFICER: "FINANCE_OFFICER",
  SUPPORT_AGENT: "SUPPORT_AGENT",
  ANALYST: "ANALYST",
};

export const ADMIN_ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  OPERATIONS_ADMIN: "Operations Admin",
  KYC_OFFICER: "KYC Officer",
  ACADEMY_MANAGER: "Academy Manager",
  FINANCE_OFFICER: "Finance Officer",
  SUPPORT_AGENT: "Support Agent",
  ANALYST: "Reporting Analyst",
};

export const ADMIN_PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",
  USERS_VIEW: "users.view",
  USERS_MANAGE: "users.manage",
  USERS_SUSPEND: "users.suspend",
  KYC_VIEW: "kyc.view",
  KYC_REVIEW: "kyc.review",
  COURSES_VIEW: "courses.view",
  COURSES_MANAGE: "courses.manage",
  PROJECTS_VIEW: "projects.view",
  PROJECTS_INTERVENE: "projects.intervene",
  DISPUTES_VIEW: "disputes.view",
  DISPUTES_RESOLVE: "disputes.resolve",
  PAYMENTS_VIEW: "payments.view",
  PAYMENTS_RECONCILE: "payments.reconcile",
  PAYMENTS_RELEASE: "payments.release",
  REPORTS_VIEW: "reports.view",
  REPORTS_EXPORT: "reports.export",
  CATEGORIES_VIEW: "categories.view",
  CATEGORIES_MANAGE: "categories.manage",
  SUPPORT_VIEW: "support.view",
  SUPPORT_MANAGE: "support.manage",
  STAFF_VIEW: "staff.view",
  STAFF_MANAGE: "staff.manage",
  AUDIT_VIEW: "audit.view",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_MANAGE: "settings.manage",
  MODERATION_LIMITED: "moderation.limited",
};

const allPermissions = Object.values(ADMIN_PERMISSIONS);

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: allPermissions,
  OPERATIONS_ADMIN: [
    ADMIN_PERMISSIONS.DASHBOARD_VIEW,
    ADMIN_PERMISSIONS.USERS_VIEW,
    ADMIN_PERMISSIONS.USERS_MANAGE,
    ADMIN_PERMISSIONS.USERS_SUSPEND,
    ADMIN_PERMISSIONS.KYC_VIEW,
    ADMIN_PERMISSIONS.COURSES_VIEW,
    ADMIN_PERMISSIONS.PROJECTS_VIEW,
    ADMIN_PERMISSIONS.PROJECTS_INTERVENE,
    ADMIN_PERMISSIONS.DISPUTES_VIEW,
    ADMIN_PERMISSIONS.DISPUTES_RESOLVE,
    ADMIN_PERMISSIONS.PAYMENTS_VIEW,
    ADMIN_PERMISSIONS.REPORTS_VIEW,
    ADMIN_PERMISSIONS.CATEGORIES_VIEW,
    ADMIN_PERMISSIONS.SUPPORT_VIEW,
    ADMIN_PERMISSIONS.SUPPORT_MANAGE,
    ADMIN_PERMISSIONS.AUDIT_VIEW,
    ADMIN_PERMISSIONS.MODERATION_LIMITED,
  ],
  KYC_OFFICER: [
    ADMIN_PERMISSIONS.DASHBOARD_VIEW,
    ADMIN_PERMISSIONS.USERS_VIEW,
    ADMIN_PERMISSIONS.KYC_VIEW,
    ADMIN_PERMISSIONS.KYC_REVIEW,
    ADMIN_PERMISSIONS.AUDIT_VIEW,
  ],
  ACADEMY_MANAGER: [
    ADMIN_PERMISSIONS.DASHBOARD_VIEW,
    ADMIN_PERMISSIONS.USERS_VIEW,
    ADMIN_PERMISSIONS.COURSES_VIEW,
    ADMIN_PERMISSIONS.COURSES_MANAGE,
    ADMIN_PERMISSIONS.CATEGORIES_VIEW,
    ADMIN_PERMISSIONS.CATEGORIES_MANAGE,
    ADMIN_PERMISSIONS.REPORTS_VIEW,
    ADMIN_PERMISSIONS.SUPPORT_VIEW,
    ADMIN_PERMISSIONS.AUDIT_VIEW,
  ],
  FINANCE_OFFICER: [
    ADMIN_PERMISSIONS.DASHBOARD_VIEW,
    ADMIN_PERMISSIONS.USERS_VIEW,
    ADMIN_PERMISSIONS.PROJECTS_VIEW,
    ADMIN_PERMISSIONS.DISPUTES_VIEW,
    ADMIN_PERMISSIONS.PAYMENTS_VIEW,
    ADMIN_PERMISSIONS.PAYMENTS_RECONCILE,
    ADMIN_PERMISSIONS.PAYMENTS_RELEASE,
    ADMIN_PERMISSIONS.REPORTS_VIEW,
    ADMIN_PERMISSIONS.REPORTS_EXPORT,
    ADMIN_PERMISSIONS.AUDIT_VIEW,
  ],
  SUPPORT_AGENT: [
    ADMIN_PERMISSIONS.DASHBOARD_VIEW,
    ADMIN_PERMISSIONS.USERS_VIEW,
    ADMIN_PERMISSIONS.PROJECTS_VIEW,
    ADMIN_PERMISSIONS.DISPUTES_VIEW,
    ADMIN_PERMISSIONS.SUPPORT_VIEW,
    ADMIN_PERMISSIONS.SUPPORT_MANAGE,
    ADMIN_PERMISSIONS.MODERATION_LIMITED,
  ],
  ANALYST: [
    ADMIN_PERMISSIONS.DASHBOARD_VIEW,
    ADMIN_PERMISSIONS.USERS_VIEW,
    ADMIN_PERMISSIONS.KYC_VIEW,
    ADMIN_PERMISSIONS.COURSES_VIEW,
    ADMIN_PERMISSIONS.PROJECTS_VIEW,
    ADMIN_PERMISSIONS.DISPUTES_VIEW,
    ADMIN_PERMISSIONS.PAYMENTS_VIEW,
    ADMIN_PERMISSIONS.REPORTS_VIEW,
    ADMIN_PERMISSIONS.REPORTS_EXPORT,
    ADMIN_PERMISSIONS.CATEGORIES_VIEW,
    ADMIN_PERMISSIONS.SUPPORT_VIEW,
  ],
};

export const defaultAdminSettings = {
  platformName: "NexaCore",
  supportEmail: "support@nexacore.com",
  securityEmail: "security@nexacore.com",
  primaryCurrency: "USD",
  academyTutorSharePercent: 60,
  academyPlatformSharePercent: 40,
  serviceDepositPercent: 25,
  serviceFinalPercent: 75,
  serviceTalentSharePercent: 80,
  servicePlatformSharePercent: 20,
  automaticPayoutEnabled: false,
  payoutReviewThresholdUsd: 5000,
  kycRequiredForTalent: true,
  kycRequiredForTutors: true,
  maintenanceMode: false,
  registrationsEnabled: true,
  courseEnrollmentEnabled: true,
  projectPostingEnabled: true,
  emergencyPaymentHold: false,
};

export const defaultAdminStaff = [
  {
    id: "STAFF-OWNER-1",
    name: "NexaCore Owner",
    email: "owner@nexacore.internal",
    role: ADMIN_ROLES.SUPER_ADMIN,
    status: "active",
    mfaEnabled: true,
    lastLoginAt: "2026-07-12T15:20:00",
    createdAt: "2026-07-01T09:00:00",
  },
  {
    id: "STAFF-OPS-1",
    name: "Operations Manager",
    email: "operations@nexacore.internal",
    role: ADMIN_ROLES.OPERATIONS_ADMIN,
    status: "active",
    mfaEnabled: true,
    lastLoginAt: "2026-07-12T13:00:00",
    createdAt: "2026-07-02T09:00:00",
  },
  {
    id: "STAFF-FIN-1",
    name: "Finance Officer",
    email: "finance@nexacore.internal",
    role: ADMIN_ROLES.FINANCE_OFFICER,
    status: "active",
    mfaEnabled: true,
    lastLoginAt: "2026-07-12T11:10:00",
    createdAt: "2026-07-02T09:00:00",
  },
  {
    id: "STAFF-SUP-1",
    name: "Support Agent",
    email: "support.agent@nexacore.internal",
    role: ADMIN_ROLES.SUPPORT_AGENT,
    status: "active",
    mfaEnabled: false,
    lastLoginAt: "2026-07-12T10:45:00",
    createdAt: "2026-07-03T09:00:00",
  },
];

export const defaultAdminUsers = [
  {
    id: "USR-STU-1001",
    name: "Amaka Eze",
    email: "amaka@example.com",
    role: "student",
    status: "active",
    verificationStatus: "email_verified",
    country: "Nigeria",
    createdAt: "2026-06-02T09:00:00",
    lastActiveAt: "2026-07-12T14:02:00",
    riskLevel: "low",
  },
  {
    id: "USR-TUTOR-1001",
    name: "Adaeze Okafor",
    email: "adaeze@nexacore.com",
    role: "tutor",
    status: "active",
    verificationStatus: "verified",
    country: "Nigeria",
    createdAt: "2026-05-10T09:00:00",
    lastActiveAt: "2026-07-12T13:42:00",
    riskLevel: "low",
  },
  {
    id: "USR-CLIENT-1001",
    name: "NexaCore Client Company",
    email: "client@nexacore.com",
    role: "client",
    status: "active",
    verificationStatus: "business_pending",
    country: "Nigeria",
    createdAt: "2026-06-12T09:00:00",
    lastActiveAt: "2026-07-12T15:00:00",
    riskLevel: "medium",
  },
  {
    id: "USR-TAL-1001",
    name: "Chinedu Okoro",
    email: "chinedu@example.com",
    role: "talent",
    status: "active",
    verificationStatus: "verified",
    country: "Nigeria",
    createdAt: "2026-05-01T09:00:00",
    lastActiveAt: "2026-07-12T14:50:00",
    riskLevel: "low",
  },
  {
    id: "USR-TAL-1002",
    name: "Amina Yusuf",
    email: "amina@example.com",
    role: "talent",
    status: "review",
    verificationStatus: "kyc_pending",
    country: "Nigeria",
    createdAt: "2026-07-10T09:00:00",
    lastActiveAt: "2026-07-12T12:00:00",
    riskLevel: "medium",
  },
];

export const defaultKycCases = [
  {
    id: "KYC-1001",
    userId: "USR-TAL-1002",
    userName: "Amina Yusuf",
    email: "amina@example.com",
    role: "talent",
    country: "Nigeria",
    documentType: "National ID",
    documentNumberMasked: "******8721",
    selfieCheck: "passed",
    documentCheck: "pending",
    addressCheck: "pending",
    status: "pending",
    riskFlags: [],
    submittedAt: "2026-07-11T14:30:00",
    reviewedBy: "",
    reviewedAt: "",
    notes: "",
  },
  {
    id: "KYC-1002",
    userId: "USR-TUTOR-1002",
    userName: "Kelvin Mensah",
    email: "kelvin.tutor@example.com",
    role: "tutor",
    country: "Ghana",
    documentType: "Passport",
    documentNumberMasked: "****4192",
    selfieCheck: "passed",
    documentCheck: "passed",
    addressCheck: "passed",
    status: "pending",
    riskFlags: [],
    submittedAt: "2026-07-12T08:10:00",
    reviewedBy: "",
    reviewedAt: "",
    notes: "",
  },
  {
    id: "KYC-1003",
    userId: "USR-TAL-1003",
    userName: "Samuel Peter",
    email: "samuel@example.com",
    role: "talent",
    country: "Nigeria",
    documentType: "Driver Licence",
    documentNumberMasked: "*****0139",
    selfieCheck: "manual_review",
    documentCheck: "passed",
    addressCheck: "passed",
    status: "escalated",
    riskFlags: ["selfie_similarity_low"],
    submittedAt: "2026-07-10T16:20:00",
    reviewedBy: "",
    reviewedAt: "",
    notes: "",
  },
];

export const defaultAdminCourses = [
  {
    id: "COURSE-001",
    title: "Full Stack Development",
    category: "Software Development",
    level: "Career Intensive",
    modules: 10,
    durationWeeks: 24,
    priceNgn: 800000,
    priceUsd: 549,
    status: "published",
    tutorCount: 6,
    enrollmentCount: 82,
    certificateEnabled: true,
    updatedAt: "2026-07-10T10:00:00",
  },
  {
    id: "COURSE-002",
    title: "Data Analysis",
    category: "Data and AI",
    level: "Professional Certificate",
    modules: 10,
    durationWeeks: 16,
    priceNgn: 350000,
    priceUsd: 229,
    status: "published",
    tutorCount: 5,
    enrollmentCount: 64,
    certificateEnabled: true,
    updatedAt: "2026-07-10T10:00:00",
  },
  {
    id: "COURSE-003",
    title: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    level: "Professional Certificate",
    modules: 10,
    durationWeeks: 16,
    priceNgn: 350000,
    priceUsd: 229,
    status: "published",
    tutorCount: 4,
    enrollmentCount: 49,
    certificateEnabled: true,
    updatedAt: "2026-07-10T10:00:00",
  },
  {
    id: "COURSE-004",
    title: "AI Video Creation",
    category: "Videography and Creative Media",
    level: "Advanced Professional",
    modules: 10,
    durationWeeks: 18,
    priceNgn: 500000,
    priceUsd: 329,
    status: "draft",
    tutorCount: 2,
    enrollmentCount: 0,
    certificateEnabled: true,
    updatedAt: "2026-07-12T10:00:00",
  },
];

export const defaultAdminCategories = [
  {
    id: "CAT-001",
    name: "Software Development",
    area: "academy_and_services",
    status: "active",
    courseCount: 9,
    serviceCount: 8,
    matchingEnabled: true,
    sortOrder: 1,
  },
  {
    id: "CAT-002",
    name: "Data and AI",
    area: "academy_and_services",
    status: "active",
    courseCount: 11,
    serviceCount: 8,
    matchingEnabled: true,
    sortOrder: 2,
  },
  {
    id: "CAT-003",
    name: "Cybersecurity",
    area: "academy_and_services",
    status: "active",
    courseCount: 7,
    serviceCount: 6,
    matchingEnabled: true,
    sortOrder: 3,
  },
  {
    id: "CAT-004",
    name: "Cloud and DevOps",
    area: "academy_and_services",
    status: "active",
    courseCount: 9,
    serviceCount: 7,
    matchingEnabled: true,
    sortOrder: 4,
  },
  {
    id: "CAT-005",
    name: "Design and Product",
    area: "academy_and_services",
    status: "active",
    courseCount: 8,
    serviceCount: 7,
    matchingEnabled: true,
    sortOrder: 5,
  },
  {
    id: "CAT-006",
    name: "Business and Digital",
    area: "academy_and_services",
    status: "active",
    courseCount: 9,
    serviceCount: 7,
    matchingEnabled: true,
    sortOrder: 6,
  },
  {
    id: "CAT-007",
    name: "Emerging Skills",
    area: "academy",
    status: "active",
    courseCount: 7,
    serviceCount: 4,
    matchingEnabled: true,
    sortOrder: 7,
  },
  {
    id: "CAT-008",
    name: "Videography and Creative Media",
    area: "academy_and_services",
    status: "active",
    courseCount: 13,
    serviceCount: 9,
    matchingEnabled: true,
    sortOrder: 8,
  },
  {
    id: "CAT-009",
    name: "Professional and Soft Skills",
    area: "academy",
    status: "active",
    courseCount: 12,
    serviceCount: 4,
    matchingEnabled: false,
    sortOrder: 9,
  },
];

export const defaultDisputes = [
  {
    id: "DSP-1001",
    projectId: "PRJ-1001",
    openedByUserId: "USR-CLIENT-1001",
    openedByName: "NexaCore Client Company",
    againstUserId: "USR-TAL-1001",
    againstName: "Chinedu Okoro",
    reason: "Delivery scope disagreement",
    description:
      "The client says the reporting module is incomplete. The talent says it was not included in the approved milestone.",
    amountAtRisk: 4960,
    currency: "USD",
    status: "open",
    priority: "high",
    payoutPaused: true,
    finalReleasePaused: true,
    assignedTo: "STAFF-OPS-1",
    evidence: [
      "approved-proposal.pdf",
      "project-chat-export.txt",
      "delivery-preview.zip",
    ],
    createdAt: "2026-07-12T09:30:00",
    resolvedAt: "",
    resolution: "",
  },
  {
    id: "DSP-1002",
    projectId: "PRJ-2001",
    openedByUserId: "USR-STU-1004",
    openedByName: "Student Account",
    againstUserId: "USR-TUTOR-1004",
    againstName: "Tutor Account",
    reason: "Course access issue",
    description:
      "Student payment is visible but course access was not activated.",
    amountAtRisk: 229,
    currency: "USD",
    status: "investigating",
    priority: "medium",
    payoutPaused: true,
    finalReleasePaused: false,
    assignedTo: "STAFF-SUP-1",
    evidence: ["payment-receipt.pdf"],
    createdAt: "2026-07-11T13:30:00",
    resolvedAt: "",
    resolution: "",
  },
];

export const defaultAdminAudit = [
  {
    id: "AUD-1001",
    actorId: "STAFF-OWNER-1",
    actorName: "NexaCore Owner",
    action: "admin.login",
    targetType: "session",
    targetId: "SESSION-1001",
    summary: "Owner authenticated with MFA.",
    ipAddress: "10.0.0.10",
    createdAt: "2026-07-12T15:20:00",
  },
  {
    id: "AUD-1002",
    actorId: "STAFF-FIN-1",
    actorName: "Finance Officer",
    action: "payment.reconciled",
    targetType: "payment",
    targetId: "PAY-1042",
    summary:
      "Payment reference was reconciled against provider settlement.",
    ipAddress: "10.0.0.15",
    createdAt: "2026-07-12T11:22:00",
  },
  {
    id: "AUD-1003",
    actorId: "STAFF-OPS-1",
    actorName: "Operations Manager",
    action: "dispute.opened",
    targetType: "dispute",
    targetId: "DSP-1001",
    summary:
      "Project payout and final release were paused.",
    ipAddress: "10.0.0.12",
    createdAt: "2026-07-12T09:32:00",
  },
];

export const defaultAdminNotifications = [
  {
    id: "ADMIN-NOTE-1",
    title: "High-priority dispute",
    message:
      "DSP-1001 has an active payout hold and requires operations review.",
    type: "dispute",
    read: false,
    createdAt: "2026-07-12T09:32:00",
  },
  {
    id: "ADMIN-NOTE-2",
    title: "KYC manual review",
    message:
      "KYC-1003 has a low selfie-similarity flag.",
    type: "kyc",
    read: false,
    createdAt: "2026-07-12T10:10:00",
  },
];

export const fallbackProjects = [
  {
    id: "PRJ-1001",
    title: "Build a responsive service marketplace",
    service: "Full Stack Development",
    clientId: "USR-CLIENT-1001",
    selectedTalentId: "USR-TAL-1001",
    budget: 6200,
    currency: "USD",
    status: "in_progress",
    escrowStatus: "fully_funded",
    depositPaid: 1550,
    finalPaid: 4650,
    payoutStatus: "on_hold",
    finalDeliveryStatus: "awaiting_client_approval",
    disputeId: "DSP-1001",
    createdAt: "2026-07-01T09:00:00",
  },
  {
    id: "PRJ-1002",
    title: "AI video product campaign",
    service: "AI Video Creation",
    clientId: "USR-CLIENT-1002",
    selectedTalentId: "USR-TAL-1004",
    budget: 2400,
    currency: "USD",
    status: "bids_received",
    escrowStatus: "not_funded",
    depositPaid: 0,
    finalPaid: 0,
    payoutStatus: "not_due",
    finalDeliveryStatus: "locked",
    disputeId: "",
    createdAt: "2026-07-10T09:00:00",
  },
];

export const fallbackPayments = [
  {
    id: "PAY-1042",
    projectId: "PRJ-1001",
    userId: "USR-CLIENT-1001",
    type: "deposit",
    amount: 1550,
    currency: "USD",
    status: "verified",
    reference: "NX-DEP-1042",
    provider: "Paystack",
    settlementStatus: "reconciled",
    destination: "NexaCore company account",
    riskStatus: "clear",
    createdAt: "2026-07-02T10:00:00",
  },
  {
    id: "PAY-1043",
    projectId: "PRJ-1001",
    userId: "USR-CLIENT-1001",
    type: "final",
    amount: 4650,
    currency: "USD",
    status: "verified",
    reference: "NX-FIN-1043",
    provider: "Paystack",
    settlementStatus: "reconciled",
    destination: "NexaCore company account",
    riskStatus: "clear",
    createdAt: "2026-07-10T10:00:00",
  },
  {
    id: "PAY-1044",
    projectId: "PRJ-1001",
    userId: "USR-TAL-1001",
    type: "talent_payout",
    amount: 4960,
    currency: "USD",
    status: "on_hold",
    reference: "NX-PAYOUT-1044",
    provider: "Bank Transfer",
    settlementStatus: "not_released",
    destination: "Talent beneficiary",
    riskStatus: "dispute_hold",
    createdAt: "2026-07-12T09:31:00",
  },
  {
    id: "COURSE-PAY-1001",
    projectId: "",
    userId: "USR-STU-1001",
    type: "course_payment",
    amount: 229,
    currency: "USD",
    status: "verified",
    reference: "NX-COURSE-1001",
    provider: "Flutterwave",
    settlementStatus: "reconciled",
    destination: "NexaCore academy account",
    riskStatus: "clear",
    createdAt: "2026-07-09T09:00:00",
  },
];

export const fallbackSupportTickets = [
  {
    id: "SUP-1001",
    userId: "USR-CLIENT-1001",
    userName: "NexaCore Client Company",
    subject: "How is escrow released?",
    category: "Payments and Escrow",
    message:
      "Please explain when project funds are released to the talent.",
    status: "answered",
    priority: "normal",
    assignedTo: "STAFF-SUP-1",
    response:
      "Funds remain protected until the required funding and delivery conditions are satisfied.",
    createdAt: "2026-07-10T10:00:00",
    updatedAt: "2026-07-10T12:00:00",
  },
  {
    id: "SUP-1002",
    userId: "USR-TAL-1002",
    userName: "Amina Yusuf",
    subject: "KYC upload not completing",
    category: "Verification",
    message:
      "My proof of address remains pending after upload.",
    status: "open",
    priority: "high",
    assignedTo: "",
    response: "",
    createdAt: "2026-07-12T09:20:00",
    updatedAt: "2026-07-12T09:20:00",
  },
];

export function loadAdminValue(key, fallback) {
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

export function saveAdminValue(key, value) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(value),
    );
  } catch {
    // The local preview remains usable if browser storage is unavailable.
  }
}

export function loadAdminSession() {
  try {
    const stored = window.sessionStorage.getItem(
      ADMIN_STORAGE_KEYS.session,
    );

    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveAdminSession(session) {
  try {
    window.sessionStorage.setItem(
      ADMIN_STORAGE_KEYS.session,
      JSON.stringify(session),
    );
  } catch {
    // Production sessions must be stored in secure HttpOnly cookies.
  }
}

export function clearAdminSession() {
  try {
    window.sessionStorage.removeItem(
      ADMIN_STORAGE_KEYS.session,
    );
  } catch {
    // No action required.
  }
}

export function isAdminPreviewEnabled() {
  return (
    String(
      import.meta.env?.VITE_NEXACORE_ADMIN_PREVIEW_MODE ||
        "",
    ).toLowerCase() === "true"
  );
}

function getPreviewCredentials() {
  return {
    email:
      import.meta.env
        ?.VITE_NEXACORE_ADMIN_PREVIEW_EMAIL ||
      "",
    accessCode:
      import.meta.env
        ?.VITE_NEXACORE_ADMIN_PREVIEW_CODE ||
      "",
  };
}

export async function authenticateAdmin({
  email,
  accessCode,
}) {
  const normalisedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (isAdminPreviewEnabled()) {
    const preview = getPreviewCredentials();

    if (
      !preview.email ||
      !preview.accessCode ||
      normalisedEmail !==
        preview.email.trim().toLowerCase() ||
      String(accessCode || "") !==
        String(preview.accessCode)
    ) {
      throw new Error(
        "The local preview administrator credentials are invalid.",
      );
    }

    const staff = loadAdminValue(
      ADMIN_STORAGE_KEYS.staff,
      defaultAdminStaff,
    );

    const matched =
      staff.find(
        (item) =>
          item.email.toLowerCase() ===
          normalisedEmail,
      ) ||
      staff.find(
        (item) =>
          item.role === ADMIN_ROLES.SUPER_ADMIN,
      );

    const session = {
      sessionId: `ADMIN-SESSION-${Date.now()}`,
      staffId: matched.id,
      name: matched.name,
      email: normalisedEmail,
      role: matched.role,
      permissions:
        ROLE_PERMISSIONS[matched.role] || [],
      issuedAt: new Date().toISOString(),
      previewMode: true,
    };

    saveAdminSession(session);
    return session;
  }

  const response = await fetch(
    "/api/admin/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: normalisedEmail,
        accessCode,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Administrator authentication failed.",
    );
  }

  const payload = await response.json();
  const session = payload.session || payload;
  saveAdminSession(session);
  return session;
}

export async function resolveAdminSession() {
  if (isAdminPreviewEnabled()) {
    return loadAdminSession();
  }

  try {
    const response = await fetch(
      "/api/admin/auth/session",
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) {
      clearAdminSession();
      return null;
    }

    const payload = await response.json();
    const session = payload.session || payload;
    saveAdminSession(session);
    return session;
  } catch {
    clearAdminSession();
    return null;
  }
}

export async function logoutAdmin() {
  if (!isAdminPreviewEnabled()) {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // The local session is still cleared below.
    }
  }

  clearAdminSession();
}

export function hasAdminPermission(
  session,
  permission,
) {
  if (!session) {
    return false;
  }

  if (session.role === ADMIN_ROLES.SUPER_ADMIN) {
    return true;
  }

  return Boolean(
    session.permissions?.includes(permission),
  );
}

export function getAdminLandingPath(session) {
  if (!session) {
    return "/admin/login";
  }

  return "/admin/dashboard";
}

export function writeAuditLog({
  session,
  action,
  targetType,
  targetId,
  summary,
}) {
  const logs = loadAdminValue(
    ADMIN_STORAGE_KEYS.audit,
    defaultAdminAudit,
  );

  const entry = {
    id: `AUD-${Date.now()}`,
    actorId: session?.staffId || "UNKNOWN",
    actorName: session?.name || "Unknown staff",
    action,
    targetType,
    targetId,
    summary,
    ipAddress: "local-preview",
    createdAt: new Date().toISOString(),
  };

  saveAdminValue(ADMIN_STORAGE_KEYS.audit, [
    entry,
    ...logs,
  ]);

  return entry;
}

export function formatAdminMoney(
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

export function exportRowsToCsv(
  filename,
  rows,
) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return false;
  }

  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row || {}).forEach((key) =>
        set.add(key),
      );

      return set;
    }, new Set()),
  );

  const escapeCell = (value) => {
    const normalised =
      value === null || value === undefined
        ? ""
        : typeof value === "object"
          ? JSON.stringify(value)
          : String(value);

    return `"${normalised.replaceAll('"', '""')}"`;
  };

  const csv = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) =>
      headers
        .map((header) => escapeCell(row[header]))
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);

  return true;
}

export function collectPlatformSnapshot() {
  const users = loadAdminValue(
    ADMIN_STORAGE_KEYS.users,
    defaultAdminUsers,
  );

  const kyc = loadAdminValue(
    ADMIN_STORAGE_KEYS.kyc,
    defaultKycCases,
  );

  const courses = loadAdminValue(
    ADMIN_STORAGE_KEYS.courses,
    defaultAdminCourses,
  );

  const projects = loadAdminValue(
    ADMIN_STORAGE_KEYS.clientProjects,
    fallbackProjects,
  );

  const payments = loadAdminValue(
    ADMIN_STORAGE_KEYS.clientPayments,
    fallbackPayments,
  );

  const disputes = loadAdminValue(
    ADMIN_STORAGE_KEYS.disputes,
    defaultDisputes,
  );

  const support = loadAdminValue(
    ADMIN_STORAGE_KEYS.clientSupport,
    fallbackSupportTickets,
  );

  const categories = loadAdminValue(
    ADMIN_STORAGE_KEYS.categories,
    defaultAdminCategories,
  );

  return {
    users,
    kyc,
    courses,
    projects,
    payments,
    disputes,
    support,
    categories,
  };
}
