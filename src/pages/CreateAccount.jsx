import { useEffect, useState } from "react";
import {
  CURRENCY_OPTIONS,
  STORAGE_KEYS,
  beginStudentEnrollment,
  courseCategories,
  defaultProfile,
  detectPreferredCurrency,
  formatCurrency,
  getCourse,
  getCoursePrice,
  saveStoredValue,
  setPreferredCurrency,
} from "./student/studentData";
import {
  beginTutorApplication,
} from "./tutor/tutorData";
import {
  beginClientAccount,
} from "./client/clientData";

const accountRoles = [
  {
    id: "student",
    title: "Student",
    subtitle: "Learn and build",
    description:
      "Join courses, attend live classes, complete projects and earn certificates.",
    formTitle: "Start learning with NexaCore",
    formDescription:
      "Create your student account and begin building practical technology skills.",
    detailLabel: "Learning interest",
    detailPlaceholder: "Select the skill you want to learn",
    submitLabel: "Join as a Student",
    accent:
      "border-red-500 bg-gradient-to-br from-red-600 to-rose-800 shadow-red-600/20",
    iconBackground: "bg-red-600",
    textAccent: "text-red-600",
    focusClass:
      "focus:border-red-600 focus:ring-red-600/10",
    buttonClass:
      "bg-red-600 hover:bg-neutral-950 shadow-red-600/25",
    benefits: [
      "Access practical technology courses",
      "Choose an experienced tutor",
      "Submit assignments and projects",
      "Earn verifiable certificates",
    ],
  },
  {
    id: "tutor",
    title: "Tutor",
    subtitle: "Teach and mentor",
    description:
      "Teach professional courses, mentor students and manage live classes.",
    formTitle: "Become a NexaCore Tutor",
    formDescription:
      "Create a tutor account, publish courses and help learners build valuable skills.",
    detailLabel: "Teaching specialty",
    detailPlaceholder: "Select the subject you want to teach",
    submitLabel: "Apply as a Tutor",
    accent:
      "border-blue-500 bg-gradient-to-br from-blue-600 to-cyan-800 shadow-blue-600/20",
    iconBackground: "bg-blue-600",
    textAccent: "text-blue-600",
    focusClass:
      "focus:border-blue-600 focus:ring-blue-600/10",
    buttonClass:
      "bg-blue-600 hover:bg-neutral-950 shadow-blue-600/25",
    benefits: [
      "Create and manage courses",
      "Host live learning sessions",
      "Grade assignments and projects",
      "Track students and earnings",
    ],
  },
  {
    id: "client",
    title: "Client",
    subtitle: "Hire professionals",
    description:
      "Post technology projects, compare proposals and hire trusted talent.",
    formTitle: "Create your Client Workspace",
    formDescription:
      "Set up a client account to post projects and collaborate with verified professionals.",
    detailLabel: "Business or company name",
    detailPlaceholder: "Enter your business name",
    submitLabel: "Create Client Workspace",
    accent:
      "border-amber-500 bg-gradient-to-br from-amber-500 to-orange-800 shadow-amber-600/20",
    iconBackground: "bg-amber-500",
    textAccent: "text-amber-600",
    focusClass:
      "focus:border-amber-500 focus:ring-amber-500/10",
    buttonClass:
      "bg-amber-500 hover:bg-neutral-950 shadow-amber-500/25",
    benefits: [
      "Post technology service requests",
      "Receive matching proposals",
      "Manage milestones and delivery",
      "Review and rate professionals",
    ],
  },
  {
    id: "talent",
    title: "Talent",
    subtitle: "Work and deliver",
    description:
      "Discover matching jobs, submit proposals and build your reputation.",
    formTitle: "Build your Talent Profile",
    formDescription:
      "Create a professional profile and connect your skills to real project opportunities.",
    detailLabel: "Primary professional skill",
    detailPlaceholder: "Select your main technology skill",
    submitLabel: "Build Talent Profile",
    accent:
      "border-violet-500 bg-gradient-to-br from-violet-600 to-fuchsia-800 shadow-violet-600/20",
    iconBackground: "bg-violet-600",
    textAccent: "text-violet-600",
    focusClass:
      "focus:border-violet-600 focus:ring-violet-600/10",
    buttonClass:
      "bg-violet-600 hover:bg-neutral-950 shadow-violet-600/25",
    benefits: [
      "View skill-matched opportunities",
      "Submit professional proposals",
      "Manage projects and milestones",
      "Build ratings and portfolio proof",
    ],
  },
];

const learningOptions = [
  "Software Development",
  "Data Analysis",
  "Artificial Intelligence",
  "Cybersecurity",
  "UI/UX and Product Design",
  "Cloud and DevOps",
  "Digital Marketing",
  "Project Management",
];

function getInitialRole() {
  const searchParams = new URLSearchParams(window.location.search);
  const roleFromUrl = searchParams.get("role");
  const courseFromUrl = Number(searchParams.get("course"));
  const roleExists = accountRoles.some((role) => role.id === roleFromUrl);

  if (getCourse(courseFromUrl)) {
    return "student";
  }

  return roleExists ? roleFromUrl : "student";
}

function getInitialStudentCourse() {
  const courseId = Number(
    new URLSearchParams(window.location.search).get("course"),
  );

  return getCourse(courseId);
}

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M19 12H5M11 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RoleIcon({ role }) {
  if (role === "student") {
    return (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="m3 9 9-5 9 5-9 5-9-5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M7 12.5V17c3 2 7 2 10 0v-4.5M21 9v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (role === "tutor") {
    return (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 5h16v11H4V5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 20h8M12 16v4M8 9h8M8 12h5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (role === "client") {
    return (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 7h16v12H4V7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 7V5h6v2M4 12h16M10 12v2h4v-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.4 2.9-7.3Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.7-2.5L15.4 17c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.8A6 6 0 0 1 6.1 12c0-.6.1-1.2.3-1.8V7.6H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1 4.4l3.4-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 12 2a10 10 0 0 0-9 5.6l3.4 2.6C7.2 7.8 9.4 6 12 6Z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#F25022" d="M2 2h9.5v9.5H2V2Z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5V2Z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2v-9.5Z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5v-9.5Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.91c-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 7.03c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9v2.75c0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
    </svg>
  );
}

export default function CreateAccount() {
  const initialStudentCourse = getInitialStudentCourse();

  const [selectedRole, setSelectedRole] = useState(getInitialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currency, setCurrency] = useState(
    detectPreferredCurrency,
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    courseCategory: initialStudentCourse?.categoryId || "",
    roleDetail: initialStudentCourse
      ? String(initialStudentCourse.id)
      : "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const activeRole =
    accountRoles.find((role) => role.id === selectedRole) ||
    accountRoles[0];

  const selectedCategory = courseCategories.find(
    (category) => category.id === formData.courseCategory,
  );

  const selectedStudentCourse =
    selectedRole === "student"
      ? getCourse(formData.roleDetail)
      : null;

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("role", selectedRole);

    window.history.replaceState({}, "", currentUrl);
  }, [selectedRole]);

  const handleCurrencyChange = (event) => {
    const nextCurrency = event.target.value;
    setCurrency(nextCurrency);
    setPreferredCurrency(nextCurrency);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);

    setFormData((current) => ({
      ...current,
      courseCategory: "",
      roleDetail: "",
    }));
  };

  const handleCourseCategoryChange = (event) => {
    setFormData((current) => ({
      ...current,
      courseCategory: event.target.value,
      roleDetail: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("The passwords do not match.");
      return;
    }

    if (!formData.agree) {
      alert(
        "Please accept the Terms of Service and Privacy Policy.",
      );
      return;
    }

    const registrationData = {
      ...formData,
      role: selectedRole,
    };

    console.log("Registration data:", registrationData);

    if (selectedRole === "student") {
      const selectedCourse = getCourse(formData.roleDetail);

      if (!selectedCourse) {
        alert(
          "Please select a learning category and the course you want to register for.",
        );
        return;
      }

      saveStoredValue(STORAGE_KEYS.profile, {
        ...defaultProfile,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });

      beginStudentEnrollment(selectedCourse.id);
      return;
    }

    if (selectedRole === "tutor") {
      beginTutorApplication({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        courseTitle: formData.roleDetail,
      });
      return;
    }

    if (selectedRole === "client") {
  beginClientAccount({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    companyName: formData.roleDetail,
  });

  return;
}

    alert(`${activeRole.submitLabel} form submitted successfully.`);
  };

  const handleSocialSignup = (provider) => {
    alert(
      `${provider} signup is ready for backend OAuth integration.`,
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950">
      {/* FULL-PAGE BANNER */}
      <div className="fixed inset-0">
        <img
          src="/images/hero/banner4.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/75" />
      </div>

      <div className="pointer-events-none fixed left-1/2 top-1/3 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-red-600/15 blur-[180px]" />

      <div className="relative z-10">
        {/* TOP NAVIGATION */}
        <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
            <a
              href="/"
              aria-label="Go to NexaCore homepage"
              className="inline-flex items-center transition duration-300 hover:scale-105"
            >
              <img
                src="/images/logo/nexacore-logo-light.png"
                alt="NexaCore"
                className="h-13 w-auto max-w-[230px] object-contain sm:h-14"
              />
            </a>

            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-white/55 sm:block">
                Already have an account?
              </span>

              <a
                href="/login"
                className="rounded-full bg-white px-5 py-3 text-sm font-black text-neutral-950 transition hover:bg-red-600 hover:text-white"
              >
                Log in
              </a>

              <a
                href="/"
                className="hidden items-center gap-2 rounded-full border border-white/30 bg-black/30 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black md:inline-flex"
              >
                <BackIcon />
                Home
              </a>
            </div>
          </div>
        </header>

        {/* PAGE INTRODUCTION */}
        <section className="px-5 pb-12 pt-14 text-center sm:px-8 sm:pb-16 sm:pt-20">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-red-500" />

              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-400 sm:text-sm">
                Join NexaCore
              </p>

              <span className="h-px w-10 bg-red-500" />
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl">
              One platform.
              <span className="block text-red-500">
                Four unique journeys.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Choose how you want to use NexaCore. Every account type
              has tools and onboarding designed for its specific goal.
            </p>
          </div>
        </section>

        {/* REGISTRATION AREA */}
        <section className="px-5 pb-16 sm:px-8 sm:pb-24 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            {/* ROLE CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {accountRoles.map((role) => {
                const isSelected = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleChange(role.id)}
                    className={`group relative overflow-hidden rounded-[26px] border p-6 text-left text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${
                      isSelected
                        ? role.accent
                        : "border-white/15 bg-white/[0.07] hover:border-white/35 hover:bg-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          isSelected
                            ? "bg-white/20"
                            : role.iconBackground
                        }`}
                      >
                        <RoleIcon role={role.id} />
                      </div>

                      {isSelected && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-950">
                          <CheckIcon />
                        </div>
                      )}
                    </div>

                    <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-white/60">
                      {role.subtitle}
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {role.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-white/65">
                      {role.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* MAIN GLASS CARD */}
            <div className="mt-6 overflow-hidden rounded-[34px] border border-white/15 bg-white/95 shadow-[0_35px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
                {/* UNIQUE ROLE PANEL */}
                <aside className="relative overflow-hidden bg-neutral-950 p-7 text-white sm:p-10 lg:p-12">
                  <div
                    className={`absolute -right-24 -top-24 h-64 w-64 rounded-full blur-[100px] ${
                      activeRole.iconBackground
                    } opacity-25`}
                  />

                  <div className="relative">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white ${activeRole.iconBackground}`}
                    >
                      <RoleIcon role={selectedRole} />
                    </div>

                    <p
                      className={`mt-8 text-xs font-black uppercase tracking-[0.24em] ${activeRole.textAccent}`}
                    >
                      {activeRole.subtitle}
                    </p>

                    <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                      {activeRole.formTitle}
                    </h2>

                    <p className="mt-5 text-sm leading-7 text-white/55">
                      {activeRole.formDescription}
                    </p>

                    <div className="mt-9 space-y-4">
                      {activeRole.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-start gap-3"
                        >
                          <div
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${activeRole.iconBackground}`}
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
                          </div>

                          <p className="text-sm leading-6 text-white/70">
                            {benefit}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                        Selected account
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${activeRole.iconBackground}`}
                        >
                          <RoleIcon role={selectedRole} />
                        </div>

                        <div>
                          <p className="font-black">
                            {activeRole.title}
                          </p>

                          <p className="text-xs text-white/45">
                            {activeRole.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* FORM SIDE */}
                <div className="p-7 sm:p-10 lg:p-12">
                  <div className="border-b border-neutral-200 pb-7">
                    <p
                      className={`text-xs font-black uppercase tracking-[0.22em] ${activeRole.textAccent}`}
                    >
                      {activeRole.title} registration
                    </p>

                    <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
                      Create your account
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-neutral-500">
                      Sign up using an existing account or complete
                      the registration form.
                    </p>
                  </div>

                  {/* SOCIAL SIGNUP */}
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => handleSocialSignup("Google")}
                      className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-black text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-950 hover:shadow-lg"
                    >
                      <GoogleIcon />
                      Google
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSocialSignup("Microsoft")
                      }
                      className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-black text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-950 hover:shadow-lg"
                    >
                      <MicrosoftIcon />
                      Microsoft
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialSignup("GitHub")}
                      className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-neutral-950 bg-neutral-950 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-lg"
                    >
                      <GitHubIcon />
                      GitHub
                    </button>
                  </div>

                  <div className="my-8 flex items-center gap-4">
                    <span className="h-px flex-1 bg-neutral-200" />

                    <span className="text-xs font-black uppercase tracking-[0.18em] text-neutral-400">
                      Or use your email
                    </span>

                    <span className="h-px flex-1 bg-neutral-200" />
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="mb-2 block text-sm font-black text-neutral-800"
                        >
                          First name
                        </label>

                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          autoComplete="given-name"
                          required
                          className={`h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:ring-4 ${activeRole.focusClass}`}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="mb-2 block text-sm font-black text-neutral-800"
                        >
                          Last name
                        </label>

                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          autoComplete="family-name"
                          required
                          className={`h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:ring-4 ${activeRole.focusClass}`}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-black text-neutral-800"
                        >
                          Email address
                        </label>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          autoComplete="email"
                          required
                          className={`h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:ring-4 ${activeRole.focusClass}`}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-sm font-black text-neutral-800"
                        >
                          Phone number
                        </label>

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+234"
                          autoComplete="tel"
                          required
                          className={`h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:ring-4 ${activeRole.focusClass}`}
                        />
                      </div>

                      {/* ROLE-SPECIFIC FIELDS */}
                      {selectedRole === "student" ? (
                        <>
                          <div>
                            <label
                              htmlFor="courseCategory"
                              className="mb-2 block text-sm font-black text-neutral-800"
                            >
                              Learning category
                            </label>

                            <select
                              id="courseCategory"
                              name="courseCategory"
                              value={formData.courseCategory}
                              onChange={handleCourseCategoryChange}
                              required
                              className={`h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition focus:ring-4 ${activeRole.focusClass}`}
                            >
                              <option value="">
                                Select a learning category
                              </option>

                              {courseCategories.map((category) => (
                                <option
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="roleDetail"
                              className="mb-2 block text-sm font-black text-neutral-800"
                            >
                              Course to register for
                            </label>

                            <select
                              id="roleDetail"
                              name="roleDetail"
                              value={formData.roleDetail}
                              onChange={handleChange}
                              required
                              disabled={!selectedCategory}
                              className={`h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 ${activeRole.focusClass}`}
                            >
                              <option value="">
                                {selectedCategory
                                  ? "Select a course"
                                  : "Select a category first"}
                              </option>

                              {selectedCategory?.courses.map(
                                (course) => (
                                  <option
                                    key={course.id}
                                    value={course.id}
                                  >
                                    {course.title}
                                  </option>
                                ),
                              )}
                            </select>
                          </div>

                          {selectedStudentCourse && (
                            <div className="sm:col-span-2 overflow-hidden rounded-[24px] border border-red-200 bg-red-50">
                              <div className="p-5">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                  <div>
                                    <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                                      Selected programme
                                    </p>

                                    <h3 className="mt-2 text-xl font-black text-neutral-950">
                                      {selectedStudentCourse.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                                      {selectedStudentCourse.category} ·{" "}
                                      {selectedStudentCourse.duration} ·{" "}
                                      {selectedStudentCourse.lessons.length}{" "}
                                      in-depth modules
                                    </p>

                                    <p className="mt-2 text-xs font-bold text-neutral-500">
                                      {selectedStudentCourse.priceTierLabel}
                                    </p>
                                  </div>

                                  <div className="sm:text-right">
                                    <select
                                      value={currency}
                                      onChange={handleCurrencyChange}
                                      className="h-11 rounded-full border border-red-200 bg-white px-4 text-xs font-black text-neutral-700 outline-none focus:border-red-600"
                                      aria-label="Select tuition currency"
                                    >
                                      {CURRENCY_OPTIONS.map((option) => (
                                        <option
                                          key={option.code}
                                          value={option.code}
                                        >
                                          {option.code}
                                        </option>
                                      ))}
                                    </select>

                                    <p className="mt-3 text-2xl font-black text-red-600">
                                      {formatCurrency(
                                        getCoursePrice(
                                          selectedStudentCourse,
                                          currency,
                                        ),
                                        currency,
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <details className="border-t border-red-200 bg-white">
                                <summary className="cursor-pointer px-5 py-4 text-sm font-black text-neutral-950">
                                  View the full curriculum before registration
                                </summary>

                                <div className="grid gap-3 px-5 pb-5 md:grid-cols-2">
                                  {selectedStudentCourse.lessons.map(
                                    (lesson) => (
                                      <article
                                        key={lesson.id}
                                        className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                                      >
                                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-red-600">
                                          Module {lesson.module}
                                        </p>
                                        <h4 className="mt-2 text-sm font-black text-neutral-950">
                                          {lesson.title}
                                        </h4>
                                        <p className="mt-2 text-xs leading-6 text-neutral-500">
                                          {lesson.description}
                                        </p>
                                      </article>
                                    ),
                                  )}
                                </div>
                              </details>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="roleDetail"
                            className="mb-2 block text-sm font-black text-neutral-800"
                          >
                            {activeRole.detailLabel}
                          </label>

                          {selectedRole === "tutor" ||
                          selectedRole === "talent" ? (
                            <select
                              id="roleDetail"
                              name="roleDetail"
                              value={formData.roleDetail}
                              onChange={handleChange}
                              required
                              className={`h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition focus:ring-4 ${activeRole.focusClass}`}
                            >
                              <option value="">
                                {activeRole.detailPlaceholder}
                              </option>

                              {selectedRole === "tutor"
                                ? courseCategories.map(
                                    (category) => (
                                      <optgroup
                                        key={category.id}
                                        label={category.name}
                                      >
                                        {category.courses.map(
                                          (course) => (
                                            <option
                                              key={course.id}
                                              value={course.title}
                                            >
                                              {course.title}
                                            </option>
                                          ),
                                        )}
                                      </optgroup>
                                    ),
                                  )
                                : learningOptions.map(
                                    (option) => (
                                      <option
                                        key={option}
                                        value={option}
                                      >
                                        {option}
                                      </option>
                                    ),
                                  )}
                            </select>
                          ) : (
                            <input
                              id="roleDetail"
                              name="roleDetail"
                              type="text"
                              value={formData.roleDetail}
                              onChange={handleChange}
                              placeholder={
                                activeRole.detailPlaceholder
                              }
                              required
                              className={`h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:ring-4 ${activeRole.focusClass}`}
                            />
                          )}
                        </div>
                      )}

                      <div>
                        <label
                          htmlFor="password"
                          className="mb-2 block text-sm font-black text-neutral-800"
                        >
                          Password
                        </label>

                        <div className="relative">
                          <input
                            id="password"
                            name="password"
                            type={
                              showPassword ? "text" : "password"
                            }
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 8 characters"
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className={`h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 pr-20 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:ring-4 ${activeRole.focusClass}`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                (current) => !current,
                              )
                            }
                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black ${activeRole.textAccent}`}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="mb-2 block text-sm font-black text-neutral-800"
                        >
                          Confirm password
                        </label>

                        <div className="relative">
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={
                              showConfirmPassword
                                ? "text"
                                : "password"
                            }
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            minLength={8}
                            required
                            className={`h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 pr-20 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:ring-4 ${activeRole.focusClass}`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(
                                (current) => !current,
                              )
                            }
                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black ${activeRole.textAccent}`}
                          >
                            {showConfirmPassword
                              ? "Hide"
                              : "Show"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <input
                        name="agree"
                        type="checkbox"
                        checked={formData.agree}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 accent-red-600"
                      />

                      <span className="text-sm leading-6 text-neutral-600">
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="font-black text-neutral-950 hover:text-red-600"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="font-black text-neutral-950 hover:text-red-600"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>

                    <button
                      type="submit"
                      className={`group mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl px-6 text-sm font-black text-white shadow-[0_15px_45px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 ${activeRole.buttonClass}`}
                    >
                      {activeRole.submitLabel}

                      <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>

                    <p className="mt-6 text-center text-sm text-neutral-500">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className={`font-black ${activeRole.textAccent}`}
                      >
                        Log in here
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-xs leading-6 text-white/40">
              © {new Date().getFullYear()} NexaCore. Academy,
              services, talent and professional project delivery.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}