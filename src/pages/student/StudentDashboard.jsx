import { useState } from "react";

const studentNavigation = [
  {
    label: "Overview",
    href: "/student/dashboard",
    icon: "home",
  },
  {
    label: "My Courses",
    href: "/student/courses",
    icon: "courses",
  },
  {
    label: "Live Classes",
    href: "/student/classes",
    icon: "video",
  },
  {
    label: "Assignments",
    href: "/student/assignments",
    icon: "assignment",
    badge: "3",
  },
  {
    label: "Projects",
    href: "/student/projects",
    icon: "projects",
  },
  {
    label: "Scores",
    href: "/student/scores",
    icon: "scores",
  },
  {
    label: "Certificates",
    href: "/student/certificates",
    icon: "certificate",
  },
  {
    label: "Portfolio",
    href: "/student/portfolio",
    icon: "portfolio",
  },
  {
    label: "Messages",
    href: "/student/messages",
    icon: "messages",
    badge: "5",
  },
  {
    label: "Payments",
    href: "/student/payments",
    icon: "payments",
  },
];

const enrolledCourses = [
  {
    id: 1,
    title: "Frontend Development with React",
    category: "Software Development",
    tutor: "NexaCore Academy Tutor",
    progress: 68,
    nextLesson: "React State and Component Lifecycle",
    image: "/images/hero/banner1.png",
  },
  {
    id: 2,
    title: "Data Analysis with Power BI",
    category: "Data and Analytics",
    tutor: "NexaCore Data Tutor",
    progress: 42,
    nextLesson: "Building Interactive Dashboards",
    image: "/images/hero/banner2.png",
  },
  {
    id: 3,
    title: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    tutor: "NexaCore Security Tutor",
    progress: 25,
    nextLesson: "Network Threats and Protection",
    image: "/images/hero/banner3.png",
  },
];

const assignments = [
  {
    id: 1,
    title: "Build a Responsive Landing Page",
    course: "Frontend Development",
    due: "Due tomorrow",
    status: "Urgent",
  },
  {
    id: 2,
    title: "Power BI Sales Dashboard",
    course: "Data Analysis",
    due: "Due in 3 days",
    status: "Pending",
  },
  {
    id: 3,
    title: "Network Security Risk Report",
    course: "Cybersecurity Fundamentals",
    due: "Due in 6 days",
    status: "Pending",
  },
];

const opportunities = [
  {
    id: 1,
    title: "Junior Frontend Practice Project",
    category: "Software Development",
    level: "Beginner friendly",
    image: "/images/hero/banner1.png",
  },
  {
    id: 2,
    title: "Data Dashboard Internship Task",
    category: "Data Analysis",
    level: "Portfolio opportunity",
    image: "/images/hero/banner2.png",
  },
];

function DashboardIcon({ name, className = "h-5 w-5" }) {
  const commonProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };

  const paths = {
    home: (
      <>
        <path
          d="m3 11 9-8 9 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 10v10h14V10M9 20v-6h6v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </>
    ),
    courses: (
      <>
        <path
          d="M5 4h14v16H5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 4v16M12 8h4M12 12h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    video: (
      <>
        <rect
          x="3"
          y="5"
          width="13"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="m16 10 5-3v10l-5-3v-4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </>
    ),
    assignment: (
      <>
        <path
          d="M7 4h10v16H7z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 4V2h6v2M10 9h4M10 13h4M10 17h3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    projects: (
      <>
        <path
          d="M4 7h16v13H4z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 7V4h8v3M4 12h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    scores: (
      <>
        <path
          d="M5 20V10M12 20V4M19 20v-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M3 20h18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    certificate: (
      <>
        <circle
          cx="12"
          cy="9"
          r="5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="m9 14-1 7 4-2 4 2-1-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </>
    ),
    portfolio: (
      <>
        <rect
          x="4"
          y="6"
          width="16"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M9 6V4h6v2M4 11h16M10 11v2h4v-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    messages: (
      <>
        <path
          d="M4 5h16v12H8l-4 4V5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 9h8M8 13h5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    payments: (
      <>
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M3 9h18M7 15h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    settings: (
      <>
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.8 2.8-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.6V21H10v-.1A1.8 1.8 0 0 0 8.9 19a1.8 1.8 0 0 0-2 .4l-.1.1L4 16.7l.1-.1a1.8 1.8 0 0 0 .4-2A1.8 1.8 0 0 0 3 13.5H3v-4h.1A1.8 1.8 0 0 0 4.8 8a1.8 1.8 0 0 0-.4-2l-.1-.1L7.1 3l.1.1a1.8 1.8 0 0 0 2 .4A1.8 1.8 0 0 0 10.3 2H14v.1A1.8 1.8 0 0 0 15.1 4a1.8 1.8 0 0 0 2-.4l.1-.1L20 6.3l-.1.1a1.8 1.8 0 0 0-.4 2A1.8 1.8 0 0 0 21 9.5h.1v4H21a1.8 1.8 0 0 0-1.6 1.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </>
    ),
    bell: (
      <>
        <path
          d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10 21h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    menu: (
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    close: (
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    search: (
      <>
        <circle
          cx="11"
          cy="11"
          r="7"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="m16 16 4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    arrow: (
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    play: (
      <path
        d="m9 7 8 5-8 5V7Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ),
    calendar: (
      <>
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M7 3v4M17 3v4M3 10h18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    logout: (
      <>
        <path
          d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  };

  return <svg {...commonProps}>{paths[name]}</svg>;
}

function ProgressCircle({ value }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-24 w-24">
      <svg
        className="h-24 w-24 -rotate-90"
        viewBox="0 0 80 80"
        aria-hidden="true"
      >
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="7"
        />

        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#dc2626"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">
        {value}%
      </span>
    </div>
  );
}

function StudentSidebar({ mobileOpen, closeMobile }) {
  const currentPath = window.location.pathname;

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[285px] flex-col bg-neutral-950 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[88px] items-center justify-between border-b border-white/10 px-6">
          <a
            href="/"
            aria-label="Go to NexaCore homepage"
            className="inline-flex items-center"
          >
            <img
              src="/images/logo/nexacore-logo-light.png"
              alt="NexaCore"
              className="h-12 w-auto max-w-[205px] object-contain"
            />
          </a>

          <button
            type="button"
            onClick={closeMobile}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white lg:hidden"
            aria-label="Close navigation"
          >
            <DashboardIcon name="close" />
          </button>
        </div>

        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-black">
              S
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black">Student Account</p>

              <p className="mt-1 truncate text-xs text-white/45">
                student@nexacore.com
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
            Student workspace
          </p>

          <div className="mt-3 space-y-1">
            {studentNavigation.map((item) => {
              const isActive = currentPath === item.href;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeMobile}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-red-600 text-white shadow-[0_12px_30px_rgba(220,38,38,0.2)]"
                      : "text-white/55 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <DashboardIcon
                    name={item.icon}
                    className="h-5 w-5 shrink-0"
                  />

                  <span className="flex-1">{item.label}</span>

                  {item.badge && (
                    <span
                      className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[10px] font-black ${
                        isActive
                          ? "bg-white text-red-600"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          <p className="mt-7 px-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
            Account
          </p>

          <div className="mt-3 space-y-1">
            <a
              href="/student/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 transition hover:bg-white/[0.07] hover:text-white"
            >
              <DashboardIcon name="settings" />
              Settings
            </a>

            <a
              href="/login"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 transition hover:bg-red-600/15 hover:text-red-400"
            >
              <DashboardIcon name="logout" />
              Log out
            </a>
          </div>
        </nav>

        <div className="border-t border-white/10 p-5">
          <div className="rounded-2xl bg-gradient-to-br from-red-600 to-red-900 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/65">
              Profile progress
            </p>

            <p className="mt-2 text-sm font-black text-white">
              Complete your student profile
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/25">
              <div className="h-full w-[70%] rounded-full bg-white" />
            </div>

            <a
              href="/student/settings"
              className="mt-4 inline-flex items-center gap-2 text-xs font-black text-white"
            >
              Complete profile
              <DashboardIcon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

function StudentTopbar({ openMobile }) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
      <div className="flex h-[88px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={openMobile}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-950 lg:hidden"
            aria-label="Open navigation"
          >
            <DashboardIcon name="menu" />
          </button>

          <div className="hidden min-w-0 sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-neutral-400">
              Student workspace
            </p>

            <h1 className="mt-1 truncate text-xl font-black text-neutral-950">
              Dashboard overview
            </h1>
          </div>
        </div>

        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <DashboardIcon name="search" />
            </span>

            <input
              type="search"
              placeholder="Search courses, assignments and projects..."
              className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-12 pr-5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label="Notifications"
          >
            <DashboardIcon name="bell" />

            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-600" />
          </button>

          <a
            href="/student/settings"
            className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white p-1.5 pr-3 transition hover:border-red-200"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-sm font-black text-white">
              S
            </div>

            <div className="hidden text-left xl:block">
              <p className="text-xs font-black text-neutral-950">
                Student Account
              </p>

              <p className="text-[10px] text-neutral-400">
                View profile
              </p>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}

function SummaryCard({ icon, label, value, note }) {
  return (
    <article className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <DashboardIcon name={icon} />
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-green-700">
          Active
        </span>
      </div>

      <p className="mt-6 text-3xl font-black tracking-tight text-neutral-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-black text-neutral-700">{label}</p>

      <p className="mt-2 text-xs leading-5 text-neutral-400">{note}</p>
    </article>
  );
}

export default function StudentDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-neutral-950">
      <StudentSidebar
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />

      <div className="lg:pl-[285px]">
        <StudentTopbar openMobile={() => setMobileOpen(true)} />

        <main className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          {/* WELCOME BANNER */}
          <section className="relative min-h-[330px] overflow-hidden rounded-[30px] bg-neutral-950">
            <img
              src="/images/hero/banner1.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            <div className="relative z-10 flex min-h-[330px] items-center px-7 py-10 sm:px-10 lg:px-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-9 bg-red-500" />

                  <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
                    Welcome to your dashboard
                  </p>
                </div>

                <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
                  Continue building skills that
                  <span className="block text-red-500">
                    move your career forward.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                  Resume your courses, join upcoming classes, complete
                  assignments and turn approved projects into professional
                  portfolio evidence.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/student/courses"
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-red-600 px-6 py-3.5 text-sm font-black text-white transition hover:bg-white hover:text-red-600"
                  >
                    Continue learning
                    <DashboardIcon name="arrow" />
                  </a>

                  <a
                    href="/courses"
                    className="inline-flex items-center justify-center rounded-full border border-white/35 bg-black/25 px-6 py-3.5 text-sm font-black text-white backdrop-blur-md transition hover:bg-white hover:text-neutral-950"
                  >
                    Explore courses
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon="courses"
              value="3"
              label="Active courses"
              note="Two courses have new lessons"
            />

            <SummaryCard
              icon="video"
              value="2"
              label="Upcoming classes"
              note="Next class begins tomorrow"
            />

            <SummaryCard
              icon="assignment"
              value="3"
              label="Pending assignments"
              note="One assignment is due tomorrow"
            />

            <SummaryCard
              icon="certificate"
              value="1"
              label="Certificate earned"
              note="View or share your certificate"
            />
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
            {/* ACTIVE COURSES */}
            <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                    Learning progress
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-neutral-950">
                    Continue your courses
                  </h2>
                </div>

                <a
                  href="/student/courses"
                  className="inline-flex items-center gap-2 text-sm font-black text-red-600"
                >
                  View all courses
                  <DashboardIcon name="arrow" className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-6 space-y-4">
                {enrolledCourses.map((course) => (
                  <article
                    key={course.id}
                    className="group grid gap-5 rounded-[22px] border border-neutral-200 p-4 transition hover:border-red-200 hover:bg-red-50/20 sm:grid-cols-[155px_1fr]"
                  >
                    <div className="relative h-[150px] overflow-hidden rounded-2xl sm:h-full">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/20" />

                      <span className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md">
                        {course.category}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-col justify-center">
                      <h3 className="text-lg font-black leading-6 text-neutral-950">
                        {course.title}
                      </h3>

                      <p className="mt-2 text-xs text-neutral-400">
                        Tutor: {course.tutor}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-neutral-500">
                          Course progress
                        </span>

                        <span className="text-xs font-black text-red-600">
                          {course.progress}%
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-red-600"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs leading-5 text-neutral-500">
                          Next:{" "}
                          <span className="font-bold text-neutral-700">
                            {course.nextLesson}
                          </span>
                        </p>

                        <a
                          href={`/student/courses/${course.id}`}
                          className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-red-600"
                        >
                          Continue
                          <DashboardIcon
                            name="arrow"
                            className="h-3.5 w-3.5"
                          />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* UPCOMING CLASS */}
            <section className="overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-950 shadow-sm">
              <div className="relative min-h-[245px] overflow-hidden">
                <img
                  src="/images/hero/banner2.png"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="inline-flex rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]">
                    Next live class
                  </span>

                  <h2 className="mt-4 text-2xl font-black">
                    React State and Component Lifecycle
                  </h2>

                  <p className="mt-2 text-sm text-white/60">
                    Frontend Development with React
                  </p>
                </div>
              </div>

              <div className="p-6 text-white">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600">
                    <DashboardIcon name="calendar" />
                  </div>

                  <div>
                    <p className="text-sm font-black">
                      Tomorrow, 10:00 AM
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Duration: 1 hour 30 minutes
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 inline-flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-5 py-4 text-sm font-black text-white transition hover:bg-white hover:text-red-600"
                >
                  <DashboardIcon name="play" />
                  Join classroom
                </button>
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            {/* ASSIGNMENTS */}
            <section className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                    Action required
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-neutral-950">
                    Upcoming assignments
                  </h2>
                </div>

                <a
                  href="/student/assignments"
                  className="hidden text-sm font-black text-red-600 sm:inline-flex"
                >
                  View all
                </a>
              </div>

              <div className="mt-6 space-y-3">
                {assignments.map((assignment) => (
                  <article
                    key={assignment.id}
                    className="flex flex-col gap-4 rounded-2xl border border-neutral-200 p-4 transition hover:border-red-200 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                      <DashboardIcon name="assignment" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-neutral-950">
                        {assignment.title}
                      </h3>

                      <p className="mt-1 text-xs text-neutral-400">
                        {assignment.course}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${
                          assignment.status === "Urgent"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {assignment.due}
                      </span>

                      <a
                        href={`/student/assignments/${assignment.id}`}
                        className="mt-0 inline-flex text-xs font-black text-neutral-950 hover:text-red-600 sm:mt-3"
                      >
                        Open task
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* LEARNING PROGRESS */}
            <section className="rounded-[28px] bg-neutral-950 p-6 text-white shadow-sm sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">
                Overall progress
              </p>

              <div className="mt-6 flex items-center gap-6">
                <ProgressCircle value={54} />

                <div>
                  <h2 className="text-2xl font-black">
                    Keep moving forward
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/50">
                    You have completed more than half of your current learning
                    activities.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/[0.06] p-4 text-center">
                  <p className="text-xl font-black">18</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/35">
                    Lessons
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.06] p-4 text-center">
                  <p className="text-xl font-black">7</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/35">
                    Tasks
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.06] p-4 text-center">
                  <p className="text-xl font-black">2</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/35">
                    Projects
                  </p>
                </div>
              </div>

              <a
                href="/student/scores"
                className="mt-6 inline-flex items-center gap-2 text-sm font-black text-red-400 transition hover:text-white"
              >
                View performance
                <DashboardIcon name="arrow" className="h-4 w-4" />
              </a>
            </section>
          </div>

          {/* OPPORTUNITIES */}
          <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                  Recommended for you
                </p>

                <h2 className="mt-2 text-2xl font-black text-neutral-950">
                  Beginner opportunities
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Practice projects and internship tasks based on your current
                  learning path.
                </p>
              </div>

              <a
                href="/student/opportunities"
                className="inline-flex items-center gap-2 text-sm font-black text-red-600"
              >
                View opportunities
                <DashboardIcon name="arrow" className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {opportunities.map((opportunity) => (
                <article
                  key={opportunity.id}
                  className="group grid overflow-hidden rounded-[22px] border border-neutral-200 transition hover:border-red-200 hover:shadow-lg sm:grid-cols-[185px_1fr]"
                >
                  <div className="relative min-h-[190px] overflow-hidden">
                    <img
                      src={opportunity.image}
                      alt={opportunity.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/25" />
                  </div>

                  <div className="flex flex-col justify-center p-5">
                    <span className="w-fit rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-red-600">
                      {opportunity.level}
                    </span>

                    <h3 className="mt-4 text-lg font-black text-neutral-950">
                      {opportunity.title}
                    </h3>

                    <p className="mt-2 text-xs font-bold text-neutral-400">
                      {opportunity.category}
                    </p>

                    <a
                      href={`/student/opportunities/${opportunity.id}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-black text-red-600"
                    >
                      View opportunity
                      <DashboardIcon name="arrow" className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}