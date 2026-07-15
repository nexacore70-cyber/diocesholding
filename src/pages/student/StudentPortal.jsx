import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CURRENCY_OPTIONS,
  STORAGE_KEYS,
  calculateCourseProgress,
  calculateProfileProgress,
  courseCatalog,
  detectPreferredCurrency,
  defaultEnrollments,
  defaultLearningState,
  defaultMessages,
  defaultNotifications,
  defaultProfile,
  formatCurrency,
  getCourse,
  getCoursePrice,
  getEnrollment,
  getNextPaymentAmount,
  getPaymentPlans,
  isCourseAccessible,
  loadStoredValue,
  saveStoredValue,
  setPreferredCurrency,
} from "./studentData";
import SiteSettingsMenu from "../../components/common/SiteSettingsMenu";

const navigationItems = [
  { label: "Overview", href: "/student/dashboard", icon: "home" },
  { label: "My Courses", href: "/student/courses", icon: "courses" },
  { label: "Curriculum", href: "/student/curriculum", icon: "assignment" },
  { label: "Live Classes", href: "/student/classes", icon: "video" },
  { label: "Assignments", href: "/student/assignments", icon: "assignment" },
  { label: "Projects", href: "/student/projects", icon: "projects" },
  { label: "Scores", href: "/student/scores", icon: "scores" },
  { label: "Certificates", href: "/student/certificates", icon: "certificate" },
  { label: "Portfolio", href: "/student/portfolio", icon: "portfolio" },
  { label: "Messages", href: "/student/messages", icon: "messages" },
  { label: "AI Assistant", href: "/student/ai-assistant", icon: "spark" },
  { label: "Payments", href: "/student/payments", icon: "payments" },
];

export function isStudentPortalPath(pathname) {
  return (
    pathname === "/student/dashboard" ||
    pathname === "/student/profile" ||
    pathname === "/student/settings" ||
    pathname === "/student/courses" ||
    pathname === "/student/curriculum" ||
    pathname === "/student/classes" ||
    pathname === "/student/assignments" ||
    pathname === "/student/projects" ||
    pathname === "/student/scores" ||
    pathname === "/student/certificates" ||
    pathname === "/student/portfolio" ||
    pathname === "/student/messages" ||
    pathname === "/student/ai-assistant" ||
    pathname === "/student/payments" ||
    /^\/student\/courses\/\d+$/.test(pathname) ||
    /^\/student\/classes\/\d+\/room$/.test(pathname) ||
    /^\/student\/assignments\/\d+$/.test(pathname) ||
    /^\/student\/projects\/\d+$/.test(pathname)
  );
}

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() =>
    loadStoredValue(key, fallback),
  );

  const updateValue = (nextValue) => {
    setValue((currentValue) => {
      const resolved =
        typeof nextValue === "function"
          ? nextValue(currentValue)
          : nextValue;

      saveStoredValue(key, resolved);
      return resolved;
    });
  };

  return [value, updateValue];
}

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };

  const icons = {
    home: (
      <>
        <path d="m3 11 9-8 9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
    courses: (
      <>
        <path d="M5 4h14v16H5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 4v16M12 8h4M12 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    video: (
      <>
        <rect x="3" y="5" width="13" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="m16 10 5-3v10l-5-3v-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
    assignment: (
      <>
        <path d="M7 4h10v16H7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9 4V2h6v2M10 9h4M10 13h4M10 17h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    projects: (
      <>
        <path d="M4 7h16v13H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 7V4h8v3M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    scores: (
      <>
        <path d="M5 20V10M12 20V4M19 20v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    certificate: (
      <>
        <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="m9 14-1 7 4-2 4 2-1-7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
    portfolio: (
      <>
        <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M9 6V4h6v2M4 11h16M10 11v2h4v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    messages: (
      <>
        <path d="M4 5h16v12H8l-4 4V5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.4 4.1L18 8.5l-4.6 1.4L12 14l-1.4-4.1L6 8.5l4.6-1.4L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </>
    ),
    payments: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 9h18M7 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-4l-.4 3.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L6 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 3.1h4l.4-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M10 21h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
    close: <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    send: <path d="m3 11 18-8-8 18-2-8-8-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
    mic: (
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    camera: (
      <>
        <rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="m17 10 4-2v8l-4-2v-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
    phone: <path d="M5 4c1 7 8 14 15 15l1-5-5-2-2 2c-3-1-5-3-6-6l2-2-2-5-3 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
    screen: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M4 21c1-5 4-7 8-7s7 2 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

function getInitials(profile) {
  return `${profile.firstName?.[0] || "S"}${
    profile.lastName?.[0] || ""
  }`.toUpperCase();
}

function Avatar({
  profile,
  size = "h-11 w-11",
  text = "text-xs",
  className = "",
}) {
  if (profile.profilePhoto) {
    return (
      <img
        src={profile.profilePhoto}
        alt={`${profile.firstName} ${profile.lastName}`}
        className={`${size} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-red-600 font-black text-white ${text} ${className}`}
    >
      {getInitials(profile)}
    </div>
  );
}

function StudentShell({
  title,
  profile,
  profileProgress,
  notifications,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname;
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-neutral-950">
      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 top-[88px] z-40 bg-black/45 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          />

          <aside className="fixed left-4 top-[104px] z-50 flex max-h-[calc(100vh-120px)] w-[calc(100%-2rem)] max-w-[355px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950 text-white shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                  Navigation
                </p>
                <h2 className="mt-1 text-lg font-black">
                  Student workspace
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] transition hover:bg-red-600"
                aria-label="Close navigation"
              >
                <Icon name="close" />
              </button>
            </div>

            <a
              href="/student/profile"
              className="m-4 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3 transition hover:bg-white/[0.1]"
            >
              <Avatar profile={profile} size="h-12 w-12" />
              <div className="min-w-0">
                <p className="truncate text-sm font-black">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="mt-1 text-xs text-white/45">
                  View profile
                </p>
              </div>
            </a>

            <nav className="flex-1 overflow-y-auto px-4 pb-5">
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const active =
                    currentPath === item.href ||
                    currentPath.startsWith(`${item.href}/`);

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                        active
                          ? "bg-red-600 text-white"
                          : "text-white/55 hover:bg-white/[0.07] hover:text-white"
                      }`}
                    >
                      <Icon name={item.icon} />
                      {item.label}
                    </a>
                  );
                })}
              </div>

              <div className="my-5 h-px bg-white/10" />

              <a
                href="/student/settings"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 transition hover:bg-white/[0.07] hover:text-white"
              >
                <Icon name="settings" />
                Settings
              </a>

              <a
                href="/login"
                className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 transition hover:bg-red-600/15 hover:text-red-400"
              >
                <Icon name="logout" />
                Log out
              </a>
            </nav>

            <div className="border-t border-white/10 p-4">
              <div className="rounded-2xl bg-gradient-to-br from-red-600 to-red-900 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/65">
                    Profile progress
                  </p>
                  <span className="text-xs font-black">
                    {profileProgress}%
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/25">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${profileProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="flex h-[88px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition ${
                menuOpen
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-neutral-200 bg-white hover:border-red-600 hover:text-red-600"
              }`}
              aria-label="Open navigation"
            >
              <Icon name={menuOpen ? "close" : "menu"} className="h-6 w-6" />
            </button>

            <a href="/" className="hidden sm:inline-flex">
              <img
                src="/images/logo/nexacore-logo-light.png"
                alt="NexaCore"
                className="h-11 w-auto max-w-[170px] object-contain"
              />
            </a>

            <div className="hidden h-9 w-px bg-neutral-200 sm:block" />

            <div className="min-w-0">
              <p className="hidden text-xs font-bold uppercase tracking-[0.16em] text-neutral-400 sm:block">
                Student workspace
              </p>
              <h1 className="truncate text-base font-black sm:mt-1 sm:text-xl">
                {title}
              </h1>
            </div>
          </div>

          <div className="hidden max-w-md flex-1 lg:block">
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="search"
                placeholder="Search your courses and workspace..."
                className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-12 pr-5 text-sm outline-none transition focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:bg-red-50 hover:text-red-600"
              aria-label="Notifications"
            >
              <Icon name="bell" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <a
              href="/student/profile"
              className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white p-1.5 pr-3"
            >
              <Avatar profile={profile} size="h-9 w-9" />
              <div className="hidden text-left xl:block">
                <p className="text-xs font-black">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-[10px] text-neutral-400">
                  View profile
                </p>
              </div>
            </a>
          </div>
        </div>
      </header>

      <main className="px-5 py-7 sm:px-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}

function HeroPanel({ eyebrow, title, description, image }) {
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-neutral-950">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/25" />
      <div className="relative z-10 px-7 py-12 sm:px-10 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProgressBar({ value }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-neutral-500">
          Automatic progress
        </span>
        <span className="text-xs font-black text-red-600">
          {value}%
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-red-600 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function LockedPanel({ course }) {
  return (
    <section className="rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <Icon name="lock" className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-black">
        Payment is required
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-500">
        Complete the first payment for {course.title} before opening
        lessons, tutor chat, assignments and live classes.
      </p>
      <a
        href={`/student/payments?course=${course.id}`}
        className="mt-6 inline-flex items-center gap-3 rounded-full bg-red-600 px-6 py-3.5 text-sm font-black text-white hover:bg-neutral-950"
      >
        View payment plans
        <Icon name="arrow" />
      </a>
    </section>
  );
}

function DashboardPage({
  enrollments,
  learningState,
}) {
  const enrolledCourses = enrollments
    .map((enrollment) => ({
      enrollment,
      course: getCourse(enrollment.courseId),
    }))
    .filter((item) => item.course);

  const activeCount = enrollments.filter(
    (enrollment) => enrollment.accessActive,
  ).length;

  const totalProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (sum, item) =>
              sum +
              calculateCourseProgress(item.course, learningState),
            0,
          ) / enrolledCourses.length,
        )
      : 0;

  const pendingPayments = enrollments.filter(
    (enrollment) =>
      enrollment.amountPaid <
      getCourse(enrollment.courseId).price,
  ).length;

  return (
    <>
      <HeroPanel
        eyebrow="Student dashboard"
        title="Your learning, tutor support and course activity in one place."
        description="Course access is controlled by payment status. Progress increases automatically from lessons, attendance, submitted assignments and tutor-approved projects."
        image="/images/hero/banner1.png"
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Active courses", activeCount, "courses"],
          ["Overall progress", `${totalProgress}%`, "scores"],
          ["Payment actions", pendingPayments, "payments"],
          ["Tutor conversations", enrolledCourses.length, "messages"],
        ].map(([label, value, icon]) => (
          <article
            key={label}
            className="rounded-[24px] border border-neutral-200 bg-white p-5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Icon name={icon} />
            </div>
            <p className="mt-6 text-3xl font-black">{value}</p>
            <p className="mt-1 text-sm font-black text-neutral-700">
              {label}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Registered courses
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Your course access
            </h2>
          </div>
          <a
            href="/student/payments"
            className="text-sm font-black text-red-600"
          >
            Manage payments
          </a>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {enrolledCourses.map(({ enrollment, course }) => {
            const progress = calculateCourseProgress(
              course,
              learningState,
            );

            return (
              <article
                key={enrollment.id}
                className="overflow-hidden rounded-[24px] border border-neutral-200"
              >
                <div className="relative h-[190px]">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${
                      enrollment.accessActive
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {enrollment.accessActive
                      ? "Access active"
                      : "Payment pending"}
                  </span>
                  <h3 className="absolute bottom-4 left-4 right-4 text-xl font-black text-white">
                    {course.title}
                  </h3>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">
                      {course.tutor.initials}
                    </div>
                    <div>
                      <p className="text-sm font-black">
                        {course.tutor.name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        Assigned tutor
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <ProgressBar value={progress} />
                  </div>

                  <a
                    href={
                      enrollment.accessActive
                        ? `/student/courses/${course.id}`
                        : `/student/payments?course=${course.id}`
                    }
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 text-xs font-black text-white hover:bg-red-600"
                  >
                    {enrollment.accessActive
                      ? "Open course"
                      : "Complete payment"}
                    <Icon name="arrow" className="h-4 w-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function PaymentsPage({
  enrollments,
  setEnrollments,
}) {
  const params = new URLSearchParams(window.location.search);
  const requestedCourseId = Number(params.get("course"));

  const selectedEnrollment =
    enrollments.find(
      (enrollment) =>
        enrollment.courseId === requestedCourseId,
    ) || enrollments[0];

  const [activeCourseId, setActiveCourseId] = useState(
    selectedEnrollment?.courseId || 1,
  );
  const [currency, setCurrency] = useState(
    selectedEnrollment?.currency ||
      detectPreferredCurrency(),
  );
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const course = getCourse(activeCourseId);
  const enrollment = getEnrollment(enrollments, activeCourseId);
  const coursePrice = getCoursePrice(course, currency);
  const plans = getPaymentPlans(course, currency);

  const handleCurrencyChange = (event) => {
    const nextCurrency = event.target.value;

    if (enrollment.amountPaid > 0) {
      return;
    }

    setCurrency(nextCurrency);
    setPreferredCurrency(nextCurrency);

    setEnrollments((current) =>
      current.map((item) =>
        item.courseId === activeCourseId
          ? {
              ...item,
              currency: nextCurrency,
            }
          : item,
      ),
    );
  };

  const updatePlan = (planId) => {
    setMessage("");
    setEnrollments((current) =>
      current.map((item) =>
        item.courseId === activeCourseId
          ? { ...item, selectedPlan: planId }
          : item,
      ),
    );
  };

  const processPayment = () => {
    const amount = getNextPaymentAmount(course, {
      ...enrollment,
      currency,
    });

    if (amount <= 0) {
      setMessage("This course has already been paid in full.");
      return;
    }

    setProcessing(true);
    setMessage("");

    window.setTimeout(() => {
      setEnrollments((current) =>
        current.map((item) => {
          if (item.courseId !== activeCourseId) {
            return item;
          }

          const nextAmountPaid = Math.min(
            coursePrice,
            item.amountPaid + amount,
          );

          const fullyPaid = nextAmountPaid >= coursePrice;

          return {
            ...item,
            currency,
            amountPaid: nextAmountPaid,
            accessActive: true,
            paymentStatus: fullyPaid ? "paid" : "partially_paid",
            paymentHistory: [
              ...(item.paymentHistory || []),
              {
                id: `PAY-${Date.now()}`,
                amount,
                currency,
                date: new Date().toISOString(),
                status: "successful",
              },
            ],
          };
        }),
      );

      setProcessing(false);
      setMessage(
        "Payment recorded successfully. Course lessons, tutor chat and live classes are now unlocked.",
      );
    }, 900);
  };

  const outstanding = Math.max(
    0,
    coursePrice - enrollment.amountPaid,
  );
  const nextAmount = getNextPaymentAmount(course, {
    ...enrollment,
    currency,
  });

  return (
    <>
      <HeroPanel
        eyebrow="Course payment"
        title="Choose a payment plan before starting your class."
        description="The first successful payment activates course access. Remaining balances stay visible until the course fee is fully settled."
        image="/images/hero/banner3.png"
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <aside className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Registered courses
          </p>

          <div className="mt-5 space-y-3">
            {enrollments.map((item) => {
              const itemCourse = getCourse(item.courseId);
              const active = item.courseId === activeCourseId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveCourseId(item.courseId);
                    setCurrency(
                      item.currency ||
                        detectPreferredCurrency(),
                    );
                    setMessage("");
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-red-600 bg-red-600"
                      : "border-white/10 bg-white/[0.05] hover:border-white/25"
                  }`}
                >
                  <p className="font-black">{itemCourse.title}</p>
                  <p className="mt-2 text-xs text-white/55">
                    Paid:{" "}
                    {formatCurrency(
                      item.amountPaid,
                      item.currency || "NGN",
                    )}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[180px_1fr] lg:items-center">
            <img
              src={course.image}
              alt={course.title}
              className="h-[180px] w-full rounded-2xl object-cover"
            />

            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-red-600">
                {course.category}
              </p>
              <h2 className="mt-2 text-3xl font-black">
                {course.title}
              </h2>
              <p className="mt-3 text-sm text-neutral-500">
                Tutor: {course.tutor.name} · {course.duration}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label
                  htmlFor="paymentCurrency"
                  className="text-xs font-black uppercase tracking-[0.12em] text-neutral-500"
                >
                  Payment currency
                </label>

                <select
                  id="paymentCurrency"
                  value={currency}
                  onChange={handleCurrencyChange}
                  disabled={enrollment.amountPaid > 0}
                  className="h-11 rounded-full border border-neutral-300 bg-white px-4 text-xs font-black outline-none focus:border-red-600 disabled:cursor-not-allowed disabled:bg-neutral-100"
                >
                  {CURRENCY_OPTIONS.map((option) => (
                    <option
                      key={option.code}
                      value={option.code}
                    >
                      {option.code} · {option.label}
                    </option>
                  ))}
                </select>

                <span className="text-xs text-neutral-400">
                  Currency is locked after the first payment.
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                    Course fee
                  </p>
                  <p className="mt-2 font-black">
                    {formatCurrency(
                      coursePrice,
                      currency,
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-green-600">
                    Amount paid
                  </p>
                  <p className="mt-2 font-black text-green-700">
                    {formatCurrency(
                      enrollment.amountPaid,
                      currency,
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-red-600">
                    Outstanding
                  </p>
                  <p className="mt-2 font-black text-red-700">
                    {formatCurrency(
                      outstanding,
                      currency,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-black">
              Select payment plan
            </p>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {plans.map((plan) => {
                const active =
                  enrollment.selectedPlan === plan.id;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => updatePlan(plan.id)}
                    disabled={enrollment.amountPaid > 0}
                    className={`rounded-2xl border p-5 text-left transition ${
                      active
                        ? "border-red-600 bg-red-50"
                        : "border-neutral-200 bg-white hover:border-neutral-400"
                    } ${
                      enrollment.amountPaid > 0
                        ? "cursor-not-allowed opacity-70"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-black">{plan.title}</h3>
                      <span
                        className={`h-5 w-5 rounded-full border ${
                          active
                            ? "border-red-600 bg-red-600"
                            : "border-neutral-300"
                        }`}
                      />
                    </div>
                    <p className="mt-3 text-xs leading-6 text-neutral-500">
                      {plan.description}
                    </p>
                    <p className="mt-4 text-sm font-black text-red-600">
                      First payment:{" "}
                      {formatCurrency(
                        plan.firstPayment,
                        currency,
                      )}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 rounded-[24px] bg-neutral-950 p-6 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-white/40">
                  Amount due now
                </p>
                <p className="mt-2 text-3xl font-black text-red-500">
                  {formatCurrency(
                    nextAmount,
                    currency,
                  )}
                </p>
                <p className="mt-2 text-xs text-white/45">
                  Course access activates after this payment succeeds.
                </p>
              </div>

              <button
                type="button"
                onClick={processPayment}
                disabled={processing || nextAmount === 0}
                className="inline-flex h-13 items-center justify-center gap-3 rounded-2xl bg-red-600 px-7 text-sm font-black text-white transition hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="payments" />
                {processing
                  ? "Processing..."
                  : nextAmount === 0
                    ? "Fully paid"
                    : "Pay securely"}
              </button>
            </div>
          </div>

          {message && (
            <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
              {message}
            </p>
          )}

          <p className="mt-5 text-xs leading-6 text-neutral-400">
            This frontend currently simulates payment confirmation. Connect
            the same action to Paystack, Flutterwave or your approved payment
            provider and verify the transaction on the backend before
            activating access in production.
          </p>
        </div>
      </section>
    </>
  );
}

function CoursesPage({
  enrollments,
  learningState,
}) {
  return (
    <>
      <HeroPanel
        eyebrow="My courses"
        title="Only courses connected to your account appear here."
        description="Paid courses open normally. Courses awaiting payment stay visible but their lessons, chat and classes remain locked."
        image="/images/hero/banner1.png"
      />

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {enrollments.map((enrollment) => {
          const course = getCourse(enrollment.courseId);
          const progress = calculateCourseProgress(
            course,
            learningState,
          );

          return (
            <article
              key={enrollment.id}
              className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white"
            >
              <div className="relative h-[230px]">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <span
                  className={`absolute left-5 top-5 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white ${
                    enrollment.accessActive
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {enrollment.accessActive
                    ? "Active"
                    : "Locked"}
                </span>
                <h2 className="absolute bottom-5 left-5 right-5 text-2xl font-black text-white">
                  {course.title}
                </h2>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">
                    {course.tutor.initials}
                  </div>
                  <div>
                    <p className="text-sm font-black">
                      {course.tutor.name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Assigned tutor
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <ProgressBar value={progress} />
                </div>

                <a
                  href={
                    enrollment.accessActive
                      ? `/student/courses/${course.id}`
                      : `/student/payments?course=${course.id}`
                  }
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-neutral-950 text-sm font-black text-white hover:bg-red-600"
                >
                  {enrollment.accessActive
                    ? "Open classroom"
                    : "Pay to unlock"}
                  <Icon
                    name={
                      enrollment.accessActive ? "arrow" : "lock"
                    }
                  />
                </a>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}


function CurriculumPage({
  enrollments,
  learningState,
}) {
  const enrolledCourses = enrollments
    .map((enrollment) => ({
      enrollment,
      course: getCourse(enrollment.courseId),
    }))
    .filter((item) => item.course);

  return (
    <>
      <HeroPanel
        eyebrow="Your curriculum"
        title="See the complete learning path for every registered course."
        description="Curriculum titles and module descriptions are visible before payment so students understand what they are registering for. Lesson completion, tutor files and assessments unlock after payment."
        image="/images/hero/banner2.png"
      />

      <section className="mt-6 space-y-6">
        {enrolledCourses.map(({ enrollment, course }) => {
          const progress = calculateCourseProgress(
            course,
            learningState,
          );

          return (
            <article
              key={enrollment.id}
              className="overflow-hidden rounded-[30px] border border-neutral-200 bg-white shadow-sm"
            >
              <div className="grid lg:grid-cols-[320px_1fr]">
                <div className="relative min-h-[300px] overflow-hidden bg-neutral-950">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/65" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="relative z-10 flex min-h-[300px] flex-col justify-between p-6 text-white">
                    <div>
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] ${
                          enrollment.accessActive
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {enrollment.accessActive
                          ? "Learning access active"
                          : "Curriculum preview"}
                      </span>

                      <h2 className="mt-5 text-3xl font-black leading-tight">
                        {course.title}
                      </h2>

                      <p className="mt-3 text-sm text-white/55">
                        {course.category} · {course.duration}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-white/40">
                        Automatic progress
                      </p>
                      <p className="mt-2 text-3xl font-black text-red-500">
                        {progress}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                        Ten-module curriculum
                      </p>
                      <h3 className="mt-2 text-2xl font-black">
                        Programme learning sequence
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-neutral-500">
                        Modules are arranged in sequence because later
                        practical work builds on earlier foundations.
                      </p>
                    </div>

                    <a
                      href={
                        enrollment.accessActive
                          ? `/student/courses/${course.id}`
                          : `/student/payments?course=${course.id}`
                      }
                      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-xs font-black text-white ${
                        enrollment.accessActive
                          ? "bg-neutral-950 hover:bg-red-600"
                          : "bg-red-600 hover:bg-neutral-950"
                      }`}
                    >
                      <Icon
                        name={
                          enrollment.accessActive
                            ? "arrow"
                            : "lock"
                        }
                        className="h-4 w-4"
                      />
                      {enrollment.accessActive
                        ? "Open course lessons"
                        : "Pay to unlock lessons"}
                    </a>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {course.lessons.map((lesson) => {
                      const completed = (
                        learningState.completedLessons[
                          course.id
                        ] || []
                      ).includes(lesson.id);

                      return (
                        <article
                          key={lesson.id}
                          className={`rounded-2xl border p-4 ${
                            completed
                              ? "border-green-200 bg-green-50"
                              : "border-neutral-200 bg-neutral-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white ${
                                completed
                                  ? "bg-green-600"
                                  : "bg-neutral-950"
                              }`}
                            >
                              {lesson.module}
                            </span>

                            <div>
                              <h4 className="text-sm font-black">
                                {lesson.title}
                              </h4>
                              <p className="mt-2 text-xs leading-6 text-neutral-500">
                                {lesson.description}
                              </p>

                              <p
                                className={`mt-3 text-[10px] font-black uppercase tracking-[0.1em] ${
                                  enrollment.accessActive
                                    ? completed
                                      ? "text-green-700"
                                      : "text-red-600"
                                    : "text-neutral-400"
                                }`}
                              >
                                {!enrollment.accessActive
                                  ? "Preview available · lesson locked"
                                  : completed
                                    ? "Completed"
                                    : "Available to study"}
                              </p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

function CourseDetailPage({
  course,
  enrollments,
  learningState,
  setLearningState,
}) {
  if (!isCourseAccessible(enrollments, course.id)) {
    return <LockedPanel course={course} />;
  }

  const completedLessons =
    learningState.completedLessons[course.id] || [];
  const progress = calculateCourseProgress(course, learningState);

  const toggleLesson = (lessonId) => {
    setLearningState((current) => {
      const currentIds =
        current.completedLessons[course.id] || [];

      return {
        ...current,
        completedLessons: {
          ...current.completedLessons,
          [course.id]: currentIds.includes(lessonId)
            ? currentIds.filter((id) => id !== lessonId)
            : [...currentIds, lessonId],
        },
      };
    });
  };

  return (
    <>
      <HeroPanel
        eyebrow={course.cohort}
        title={course.title}
        description={`Tutor: ${course.tutor.name}. Progress updates from completed lessons, class attendance, submitted assignments and tutor-approved projects.`}
        image={course.image}
      />

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Programme depth
            </p>
            <h2 className="mt-2 text-2xl font-black">
              What this course develops
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-500">
              {course.lessons.length} detailed modules, tutor-led live
              classes, practical assignments and a professional capstone.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {course.learningOutcomes.map((outcome) => (
              <div
                key={outcome}
                className="flex items-start gap-3 rounded-2xl bg-neutral-50 p-4"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm leading-6 text-neutral-600">
                  {outcome}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                Course lessons
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Continue learning
              </h2>
            </div>
            <div className="min-w-[220px]">
              <ProgressBar value={progress} />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {course.lessons.map((lesson, index) => {
              const completed = completedLessons.includes(
                lesson.id,
              );

              return (
                <article
                  key={lesson.id}
                  className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center ${
                    completed
                      ? "border-green-200 bg-green-50"
                      : "border-neutral-200"
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black">{lesson.title}</h3>
                    <p className="mt-1 text-xs text-neutral-400">
                      {lesson.duration}
                    </p>

                    {lesson.description && (
                      <p className="mt-3 text-sm leading-6 text-neutral-500">
                        {lesson.description}
                      </p>
                    )}

                    {lesson.topics?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {lesson.topics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full bg-neutral-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-neutral-500"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleLesson(lesson.id)}
                    className={`rounded-full px-5 py-3 text-xs font-black ${
                      completed
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white hover:bg-neutral-950"
                    }`}
                  >
                    {completed ? "Completed" : "Mark complete"}
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Course community
          </p>

          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-white/[0.06] p-4">
            <div className="relative">
              <div className="flex h-13 w-13 items-center justify-center rounded-full bg-red-600 text-sm font-black">
                {course.tutor.initials}
              </div>
              <span
                className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-neutral-950 ${
                  course.tutor.online
                    ? "bg-green-500"
                    : "bg-neutral-500"
                }`}
              />
            </div>
            <div>
              <h3 className="font-black">{course.tutor.name}</h3>
              <p className="mt-1 text-xs text-white/45">
                {course.tutor.title}
              </p>
            </div>
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-white/35">
            Students in {course.cohort}
          </p>

          <div className="mt-3 grid gap-2">
            {course.classmates.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 rounded-xl bg-white/[0.05] p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-black">
                  {student.initials}
                </div>
                <span className="text-sm text-white/70">
                  {student.name}
                </span>
              </div>
            ))}
          </div>

          <a
            href={`/student/messages?course=${course.id}`}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black hover:bg-white hover:text-red-600"
          >
            <Icon name="messages" />
            Chat with tutor
          </a>

          <a
            href={`/student/ai-assistant?course=${course.id}`}
            className="mt-3 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.05] text-sm font-black hover:bg-white hover:text-neutral-950"
          >
            <Icon name="spark" />
            Ask AI assistant
          </a>
        </aside>
      </section>
    </>
  );
}

function ClassesPage({
  enrollments,
  learningState,
}) {
  const classes = enrollments.flatMap((enrollment) => {
    const course = getCourse(enrollment.courseId);
    return course.classes.map((liveClass) => ({
      ...liveClass,
      course,
      accessActive: enrollment.accessActive,
      attended: (
        learningState.attendedClasses[course.id] || []
      ).includes(liveClass.id),
    }));
  });

  return (
    <>
      <HeroPanel
        eyebrow="Live classes"
        title="Join video classes inside the NexaCore application."
        description="The classroom includes camera, microphone, participant display and class chat. Access is limited to paid students in the correct course cohort."
        image="/images/hero/banner2.png"
      />

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {classes.map((liveClass) => (
          <article
            key={liveClass.id}
            className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white"
          >
            <div className="relative h-[220px]">
              <img
                src={liveClass.course.image}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                {liveClass.dateLabel} · {liveClass.timeLabel}
              </span>
              <h2 className="absolute bottom-5 left-5 right-5 text-2xl font-black text-white">
                {liveClass.title}
              </h2>
            </div>

            <div className="p-6">
              <p className="font-black">
                {liveClass.course.title}
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                Tutor: {liveClass.course.tutor.name}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Duration: {liveClass.duration}
              </p>

              <a
                href={
                  liveClass.accessActive
                    ? `/student/classes/${liveClass.id}/room`
                    : `/student/payments?course=${liveClass.course.id}`
                }
                className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl text-sm font-black text-white ${
                  liveClass.accessActive
                    ? "bg-red-600 hover:bg-neutral-950"
                    : "bg-neutral-400"
                }`}
              >
                <Icon
                  name={
                    liveClass.accessActive ? "video" : "lock"
                  }
                />
                {liveClass.accessActive
                  ? liveClass.attended
                    ? "Rejoin classroom"
                    : "Join classroom"
                  : "Pay to unlock"}
              </a>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function LiveRoomPage({
  liveClass,
  course,
  enrollments,
  learningState,
  setLearningState,
}) {
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const screenStreamRef = useRef(null);
const [screenSharing, setScreenSharing] = useState(false);
  const [roomMessages, setRoomMessages] = useState([
    {
      id: "ROOM-1",
      sender: course.tutor.name,
      text: "Welcome to class. Use the room chat for questions during the session.",
    },
  ]);
  const [draft, setDraft] = useState("");

  const accessible = isCourseAccessible(
    enrollments,
    course.id,
  );

  useEffect(() => {
  return () => {
    streamRef.current?.getTracks().forEach((track) =>
      track.stop(),
    );

    screenStreamRef.current?.getTracks().forEach((track) =>
      track.stop(),
    );
  };
}, []);

  const startCamera = async () => {
    setCameraError("");

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setCameraOn(true);
      setMicrophoneOn(true);

      setLearningState((current) => {
        const currentAttendance =
          current.attendedClasses[course.id] || [];

        return {
          ...current,
          attendedClasses: {
            ...current.attendedClasses,
            [course.id]: currentAttendance.includes(
              liveClass.id,
            )
              ? currentAttendance
              : [...currentAttendance, liveClass.id],
          },
        };
      });
    } catch {
      setCameraError(
        "Camera or microphone permission was denied. Allow browser access and try again.",
      );
    }
  };

  const toggleCamera = () => {
    const track =
      streamRef.current?.getVideoTracks()?.[0];

    if (!track) {
      startCamera();
      return;
    }

    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  };

  const toggleMicrophone = () => {
    const track =
      streamRef.current?.getAudioTracks()?.[0];

    if (!track) {
      startCamera();
      return;
    }

    track.enabled = !track.enabled;
    setMicrophoneOn(track.enabled);
  };

  const stopScreenShare = () => {
  screenStreamRef.current?.getTracks().forEach((track) =>
    track.stop(),
  );

  screenStreamRef.current = null;
  setScreenSharing(false);

  if (localVideoRef.current) {
    localVideoRef.current.srcObject =
      streamRef.current || null;
  }
};

const startScreenShare = async () => {
  setCameraError("");

  try {
    const screenStream =
      await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: true,
      });

    screenStreamRef.current = screenStream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = screenStream;
    }

    setScreenSharing(true);

    const screenTrack = screenStream.getVideoTracks()[0];

    screenTrack.onended = () => {
      stopScreenShare();
    };
  } catch {
    setCameraError(
      "Screen sharing was cancelled or the browser denied permission.",
    );
  }
};

const toggleScreenShare = () => {
  if (screenSharing) {
    stopScreenShare();
    return;
  }

  startScreenShare();
};

  const leaveRoom = () => {
    streamRef.current?.getTracks().forEach((track) =>
      track.stop(),
    );
    streamRef.current = null;
    setCameraOn(false);
    setMicrophoneOn(false);
    window.location.href = "/student/classes";
  };

  const sendRoomMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();

    if (!text) {
      return;
    }

    setRoomMessages((current) => [
      ...current,
      {
        id: `ROOM-${Date.now()}`,
        sender: "You",
        text,
      },
    ]);
    setDraft("");
  };

  if (!accessible) {
    return <LockedPanel course={course} />;
  }

  return (
    <div className="min-h-[calc(100vh-145px)] overflow-hidden rounded-[30px] bg-neutral-950 text-white">
      <div className="grid min-h-[calc(100vh-145px)] xl:grid-cols-[1fr_360px]">
        <section className="flex min-h-[680px] flex-col p-5 sm:p-7">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
                Live classroom
              </p>
              <h2 className="mt-2 text-2xl font-black">
                {liveClass.title}
              </h2>
              <p className="mt-1 text-xs text-white/45">
                {course.title} · {course.cohort}
              </p>
            </div>
            <span className="w-fit rounded-full bg-red-600 px-4 py-2 text-xs font-black">
              In-app video room
            </span>
          </div>

          <div className="mt-5 grid flex-1 gap-5 lg:grid-cols-2">
            <div className="relative min-h-[330px] overflow-hidden rounded-[24px] bg-black">
              <img
                src={course.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-600 text-3xl font-black">
                    {course.tutor.initials}
                  </div>
                  <p className="mt-4 text-lg font-black">
                    {course.tutor.name}
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    Tutor video stream
                  </p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[330px] overflow-hidden rounded-[24px] bg-black">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`h-full w-full object-cover ${
                cameraOn || screenSharing ? "block" : "hidden"
                }`}
              />

              {!cameraOn && !screenSharing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/[0.05]">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                      <Icon name="camera" className="h-8 w-8" />
                    </div>
                    <p className="mt-4 font-black">
                      Your camera is off
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="mt-4 rounded-full bg-red-600 px-5 py-3 text-xs font-black"
                    >
                      Enable camera and microphone
                    </button>
                  </div>
                </div>
              )}

              <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-2 text-xs font-black backdrop-blur-md">
                You
              </span>
            </div>
          </div>

          {cameraError && (
            <p className="mt-4 rounded-2xl bg-red-600/15 p-4 text-sm text-red-300">
              {cameraError}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-[22px] bg-white/[0.05] p-4">
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                microphoneOn
                  ? "bg-white text-neutral-950"
                  : "bg-red-600 text-white"
              }`}
              aria-label="Toggle microphone"
            >
              <Icon name="mic" />
            </button>

            <button
              type="button"
              onClick={toggleCamera}
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                cameraOn
                  ? "bg-white text-neutral-950"
                  : "bg-red-600 text-white"
              }`}
              aria-label="Toggle camera"
            >
              <Icon name="camera" />
            </button>

            <button
             type="button"
              onClick={toggleScreenShare}
              className={`flex h-12 items-center justify-center gap-2 rounded-full px-4 ${
              screenSharing
                    ? "bg-green-600 text-white"
                    : "bg-white/10 text-white"
                }`}
                aria-label={
                  screenSharing
                    ? "Stop sharing screen"
                    : "Share screen"
                }
              >
                <Icon name="screen" />

                <span className="hidden text-xs font-black sm:inline">
                  {screenSharing ? "Stop sharing" : "Share screen"}
                </span>
              </button>

            <button
              type="button"
              onClick={leaveRoom}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-6 text-sm font-black"
            >
              <Icon name="phone" />
              Leave
            </button>
          </div>
        </section>

        <aside className="flex min-h-[680px] flex-col border-l border-white/10 bg-black/25">
          <div className="border-b border-white/10 p-5">
            <h3 className="font-black">Class chat</h3>
            <p className="mt-1 text-xs text-white/40">
              Tutor and cohort messages
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {roomMessages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl p-4 ${
                  message.sender === "You"
                    ? "ml-5 bg-red-600"
                    : "mr-5 bg-white/[0.07]"
                }`}
              >
                <p className="text-xs font-black">
                  {message.sender}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          <form
            onSubmit={sendRoomMessage}
            className="flex gap-3 border-t border-white/10 p-4"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask a class question..."
              className="h-12 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
            />
            <button
              type="submit"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600"
              aria-label="Send"
            >
              <Icon name="send" />
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function AssignmentsPage({
  enrollments,
  learningState,
}) {
  const assignments = enrollments.flatMap((enrollment) => {
    const course = getCourse(enrollment.courseId);

    return course.assignments.map((assignment) => ({
      ...assignment,
      course,
      accessActive: enrollment.accessActive,
      submission:
        learningState.assignmentSubmissions[course.id]?.[
          assignment.id
        ],
    }));
  });

  return (
    <>
      <HeroPanel
        eyebrow="Tutor assignments"
        title="Assignments are created and assigned by your tutors."
        description="Open an assignment to read the tutor instructions, upload your work and submit it for grading."
        image="/images/hero/banner4.png"
      />

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <article
              key={assignment.id}
              className="flex flex-col gap-5 rounded-2xl border border-neutral-200 p-5 lg:flex-row lg:items-center"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <Icon name="assignment" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">
                  {assignment.course.title}
                </p>
                <h2 className="mt-2 font-black">
                  {assignment.title}
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Assigned by {assignment.tutorName}
                </p>
              </div>

              <span className="w-fit rounded-full bg-amber-50 px-4 py-2 text-xs font-black text-amber-700">
                {assignment.due}
              </span>

              <a
                href={
                  assignment.accessActive
                    ? `/student/assignments/${assignment.id}`
                    : `/student/payments?course=${assignment.course.id}`
                }
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black text-white ${
                  assignment.accessActive
                    ? "bg-red-600 hover:bg-neutral-950"
                    : "bg-neutral-400"
                }`}
              >
                <Icon
                  name={
                    assignment.accessActive
                      ? "arrow"
                      : "lock"
                  }
                  className="h-4 w-4"
                />
                {assignment.submission
                  ? "View submission"
                  : assignment.accessActive
                    ? "Open assignment"
                    : "Pay to unlock"}
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function AssignmentDetailPage({
  assignment,
  course,
  enrollments,
  learningState,
  setLearningState,
}) {
  const [fileName, setFileName] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [note, setNote] = useState("");

  if (!isCourseAccessible(enrollments, course.id)) {
    return <LockedPanel course={course} />;
  }

  const existing =
    learningState.assignmentSubmissions[course.id]?.[
      assignment.id
    ];

  const submit = (event) => {
    event.preventDefault();

    if (!fileName && !submissionLink.trim()) {
      setNote("Upload a file or provide a submission link.");
      return;
    }

    setLearningState((current) => ({
      ...current,
      assignmentSubmissions: {
        ...current.assignmentSubmissions,
        [course.id]: {
          ...(current.assignmentSubmissions[course.id] || {}),
          [assignment.id]: {
            status: "submitted",
            fileName,
            submissionLink: submissionLink.trim(),
            submittedAt: new Date().toISOString(),
            tutorFeedback: "",
            score: null,
          },
        },
      },
    }));

    setNote("Assignment submitted to your tutor successfully.");
  };

  return (
    <>
      <HeroPanel
        eyebrow="Tutor-assigned task"
        title={assignment.title}
        description={`Course: ${course.title}. Assigned by ${assignment.tutorName}.`}
        image={course.image}
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[28px] bg-neutral-950 p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Assignment instructions
          </p>
          <p className="mt-5 text-sm leading-8 text-white/65">
            {assignment.instructions}
          </p>

          <div className="mt-6 rounded-2xl bg-white/[0.06] p-5">
            <p className="text-xs text-white/40">Deadline</p>
            <p className="mt-2 font-black">{assignment.due}</p>
          </div>

          <div className="mt-3 rounded-2xl bg-white/[0.06] p-5">
            <p className="text-xs text-white/40">
              Maximum score
            </p>
            <p className="mt-2 font-black">
              {assignment.maximumScore} marks
            </p>
          </div>
        </aside>

        <form
          onSubmit={submit}
          className="rounded-[28px] border border-neutral-200 bg-white p-7"
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
            Submit your work
          </p>

          <label className="mt-6 block cursor-pointer rounded-[24px] border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center transition hover:border-red-600">
            <Icon
              name="upload"
              className="mx-auto h-8 w-8 text-red-600"
            />
            <p className="mt-4 font-black">
              Upload assignment file
            </p>
            <p className="mt-2 text-xs text-neutral-400">
              PDF, DOCX, ZIP, image or project document
            </p>
            <input
              type="file"
              className="hidden"
              onChange={(event) =>
                setFileName(
                  event.target.files?.[0]?.name || "",
                )
              }
            />
          </label>

          {fileName && (
            <p className="mt-3 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
              Selected file: {fileName}
            </p>
          )}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-black">
              GitHub, deployed project or document link
            </label>
            <input
              value={submissionLink}
              onChange={(event) =>
                setSubmissionLink(event.target.value)
              }
              placeholder="https://..."
              className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            />
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
          >
            <Icon name="send" />
            {existing ? "Resubmit assignment" : "Submit to tutor"}
          </button>

          {note && (
            <p className="mt-4 rounded-2xl bg-neutral-100 p-4 text-sm font-bold text-neutral-700">
              {note}
            </p>
          )}
        </form>
      </section>
    </>
  );
}

function ProjectsPage({
  enrollments,
  learningState,
}) {
  const projects = enrollments.flatMap((enrollment) => {
    const course = getCourse(enrollment.courseId);

    return course.projects.map((project) => ({
      ...project,
      course,
      accessActive: enrollment.accessActive,
      submission:
        learningState.projectSubmissions[course.id]?.[
          project.id
        ],
    }));
  });

  return (
    <>
      <HeroPanel
        eyebrow="Tutor-assigned projects"
        title="Official projects come from your assigned tutors."
        description="Students can work on and submit projects, but only tutors can approve, grade or request revisions."
        image="/images/hero/banner3.png"
      />

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const status =
            project.submission?.status || "assigned";

          return (
            <article
              key={project.id}
              className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white"
            >
              <div className="relative h-[220px]">
                <img
                  src={project.course.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                  {status.replaceAll("_", " ")}
                </span>
                <h2 className="absolute bottom-5 left-5 right-5 text-2xl font-black text-white">
                  {project.title}
                </h2>
              </div>

              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">
                  Assigned by {project.tutorName}
                </p>
                <p className="mt-3 text-sm leading-7 text-neutral-500">
                  Deadline: {project.deadline}
                </p>

                <a
                  href={
                    project.accessActive
                      ? `/student/projects/${project.id}`
                      : `/student/payments?course=${project.course.id}`
                  }
                  className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl text-sm font-black text-white ${
                    project.accessActive
                      ? "bg-neutral-950 hover:bg-red-600"
                      : "bg-neutral-400"
                  }`}
                >
                  <Icon
                    name={
                      project.accessActive
                        ? "arrow"
                        : "lock"
                    }
                  />
                  {project.accessActive
                    ? "Open project"
                    : "Pay to unlock"}
                </a>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

function ProjectDetailPage({
  project,
  course,
  enrollments,
  learningState,
  setLearningState,
}) {
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");

  if (!isCourseAccessible(enrollments, course.id)) {
    return <LockedPanel course={course} />;
  }

  const submission =
    learningState.projectSubmissions[course.id]?.[
      project.id
    ];

  const submitProject = (event) => {
    event.preventDefault();

    if (!githubUrl.trim() && !liveUrl.trim() && !fileName) {
      setMessage(
        "Add at least one project link or upload a project file.",
      );
      return;
    }

    setLearningState((current) => ({
      ...current,
      projectSubmissions: {
        ...current.projectSubmissions,
        [course.id]: {
          ...(current.projectSubmissions[course.id] || {}),
          [project.id]: {
            status: "submitted",
            githubUrl: githubUrl.trim(),
            liveUrl: liveUrl.trim(),
            fileName,
            submittedAt: new Date().toISOString(),
            tutorFeedback: "",
            score: null,
          },
        },
      },
    }));

    setMessage(
      "Project submitted. It is now waiting for tutor review and approval.",
    );
  };

  return (
    <>
      <HeroPanel
        eyebrow="Tutor-assigned project"
        title={project.title}
        description={`${course.title} · Assigned by ${project.tutorName} · Deadline ${project.deadline}`}
        image={course.image}
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-[28px] bg-neutral-950 p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Project brief
          </p>
          <p className="mt-5 text-sm leading-8 text-white/65">
            {project.instructions}
          </p>

          <p className="mt-7 text-xs font-black uppercase tracking-[0.14em] text-white/35">
            Required deliverables
          </p>
          <div className="mt-3 space-y-3">
            {project.deliverables.map((deliverable) => (
              <div
                key={deliverable}
                className="flex items-center gap-3 rounded-xl bg-white/[0.06] p-3"
              >
                <Icon name="check" className="h-4 w-4 text-red-500" />
                <span className="text-sm text-white/70">
                  {deliverable}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-amber-500/10 p-5 text-sm leading-7 text-amber-200">
            Students cannot approve official projects. Only the assigned
            tutor can approve, grade or request a revision.
          </div>
        </aside>

        <form
          onSubmit={submitProject}
          className="rounded-[28px] border border-neutral-200 bg-white p-7"
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
            Project submission
          </p>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-black">
                GitHub repository
              </label>
              <input
                value={githubUrl}
                onChange={(event) =>
                  setGithubUrl(event.target.value)
                }
                placeholder="https://github.com/..."
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Deployed project or demonstration link
              </label>
              <input
                value={liveUrl}
                onChange={(event) =>
                  setLiveUrl(event.target.value)
                }
                placeholder="https://..."
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
              />
            </div>

            <label className="cursor-pointer rounded-[24px] border-2 border-dashed border-neutral-300 bg-neutral-50 p-7 text-center hover:border-red-600">
              <Icon
                name="upload"
                className="mx-auto h-8 w-8 text-red-600"
              />
              <p className="mt-4 font-black">
                Upload project document or ZIP file
              </p>
              <input
                type="file"
                className="hidden"
                onChange={(event) =>
                  setFileName(
                    event.target.files?.[0]?.name || "",
                  )
                }
              />
            </label>

            {fileName && (
              <p className="rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
                Selected file: {fileName}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
          >
            <Icon name="send" />
            {submission ? "Resubmit project" : "Submit project to tutor"}
          </button>

          {message && (
            <p className="mt-4 rounded-2xl bg-neutral-100 p-4 text-sm font-bold text-neutral-700">
              {message}
            </p>
          )}
        </form>
      </section>
    </>
  );
}

function MessagesPage({
  enrollments,
  messages,
  setMessages,
}) {
  const paidEnrollments = enrollments.filter(
    (enrollment) => enrollment.accessActive,
  );

  const queryCourseId = Number(
    new URLSearchParams(window.location.search).get("course"),
  );

  const [activeCourseId, setActiveCourseId] = useState(
    paidEnrollments.some(
      (enrollment) =>
        enrollment.courseId === queryCourseId,
    )
      ? queryCourseId
      : paidEnrollments[0]?.courseId,
  );

  const [draft, setDraft] = useState("");
  const [attachmentName, setAttachmentName] = useState("");

  if (paidEnrollments.length === 0) {
    return (
      <LockedPanel
        course={getCourse(enrollments[0]?.courseId || 1)}
      />
    );
  }

  const course = getCourse(activeCourseId);
  const conversation = messages[activeCourseId] || [];

  const sendMessage = (event) => {
    event.preventDefault();

    const text = draft.trim();

    if (!text && !attachmentName) {
      return;
    }

    setMessages((current) => ({
      ...current,
      [activeCourseId]: [
        ...(current[activeCourseId] || []),
        {
          id: `MSG-${Date.now()}`,
          senderType: "student",
          senderName: "You",
          text:
            text ||
            `Shared an attachment: ${attachmentName}`,
          attachmentName,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setDraft("");
    setAttachmentName("");
  };

  return (
    <>
      <HeroPanel
        eyebrow="Tutor messages"
        title="Chat privately with the tutor assigned to each course."
        description="Every paid course has its own tutor conversation. Students only see conversations connected to their registered courses."
        image="/images/hero/banner3.png"
      />

      <section className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
        <div className="grid min-h-[650px] lg:grid-cols-[310px_1fr]">
          <aside className="border-b border-neutral-200 bg-neutral-950 p-4 text-white lg:border-b-0 lg:border-r">
            <p className="px-2 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-500">
              Course tutors
            </p>

            <div className="mt-2 space-y-2">
              {paidEnrollments.map((enrollment) => {
                const itemCourse = getCourse(
                  enrollment.courseId,
                );
                const active =
                  itemCourse.id === activeCourseId;

                return (
                  <button
                    key={enrollment.id}
                    type="button"
                    onClick={() =>
                      setActiveCourseId(itemCourse.id)
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left ${
                      active
                        ? "bg-red-600"
                        : "bg-white/[0.05] hover:bg-white/[0.09]"
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xs font-black">
                      {itemCourse.tutor.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">
                        {itemCourse.tutor.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-white/45">
                        {itemCourse.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="flex min-h-[650px] flex-col">
            <div className="flex items-center gap-4 border-b border-neutral-200 p-5">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-xs font-black text-white">
                  {course.tutor.initials}
                </div>
                <span
                  className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                    course.tutor.online
                      ? "bg-green-500"
                      : "bg-neutral-400"
                  }`}
                />
              </div>
              <div>
                <h2 className="font-black">
                  {course.tutor.name}
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  {course.title}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
              {conversation.map((message) => (
                <article
                  key={message.id}
                  className={`flex ${
                    message.senderType === "student"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl p-4 ${
                      message.senderType === "student"
                        ? "bg-red-600 text-white"
                        : "bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    <p className="text-xs font-black">
                      {message.senderName}
                    </p>
                    <p className="mt-2 text-sm leading-7">
                      {message.text}
                    </p>
                    {message.attachmentName && (
                      <p className="mt-3 rounded-xl bg-black/10 p-3 text-xs font-bold">
                        Attachment: {message.attachmentName}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <form
              onSubmit={sendMessage}
              className="border-t border-neutral-200 p-4"
            >
              {attachmentName && (
                <div className="mb-3 flex items-center justify-between rounded-2xl bg-neutral-100 p-3 text-xs font-bold">
                  <span>{attachmentName}</span>
                  <button
                    type="button"
                    onClick={() => setAttachmentName("")}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <label className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:border-red-600 hover:text-red-600">
                  <Icon name="upload" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) =>
                      setAttachmentName(
                        event.target.files?.[0]?.name || "",
                      )
                    }
                  />
                </label>

                <input
                  value={draft}
                  onChange={(event) =>
                    setDraft(event.target.value)
                  }
                  placeholder={`Message ${course.tutor.name}...`}
                  className="h-12 flex-1 rounded-full border border-neutral-300 px-5 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                />

                <button
                  type="submit"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white hover:bg-neutral-950"
                  aria-label="Send message"
                >
                  <Icon name="send" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function buildLocalAiResponse(course, question) {
  const lower = question.toLowerCase();

  if (lower.includes("project")) {
    return `For ${course.title}, start by reading the tutor's project brief and separating the required deliverables into smaller tasks. I can help you create a checklist, but your tutor remains responsible for approval and grading.`;
  }

  if (
    lower.includes("assignment") ||
    lower.includes("submit")
  ) {
    return `Review the tutor instructions for the selected assignment, confirm every required file or link, then submit through the assignment page. I can review your draft explanation before you send it.`;
  }

  if (
    lower.includes("class") ||
    lower.includes("video")
  ) {
    return `Your next ${course.title} live class appears on the Live Classes page. Payment must be active before the in-app classroom opens.`;
  }

  if (
    lower.includes("explain") ||
    lower.includes("lesson")
  ) {
    return `Tell me the exact ${course.title} lesson or concept you want explained. I will break it into simple steps and give you a practice example.`;
  }

  return `I am using the context of ${course.title}. I can explain lessons, create practice questions, review a draft, help debug work or break an assigned project into manageable steps.`;
}

function AiAssistantPage({
  enrollments,
}) {
  const paidEnrollments = enrollments.filter(
    (enrollment) => enrollment.accessActive,
  );

  const queryCourseId = Number(
    new URLSearchParams(window.location.search).get("course"),
  );

  const [courseId, setCourseId] = useState(
    paidEnrollments.some(
      (enrollment) =>
        enrollment.courseId === queryCourseId,
    )
      ? queryCourseId
      : paidEnrollments[0]?.courseId,
  );

  const [messages, setAiMessages] = useState([
    {
      id: "AI-1",
      role: "assistant",
      text: "Hello. Select one of your paid courses and ask for help with a lesson, assignment or tutor-assigned project.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);

  if (paidEnrollments.length === 0) {
    return (
      <LockedPanel
        course={getCourse(enrollments[0]?.courseId || 1)}
      />
    );
  }

  const course = getCourse(courseId);

  const sendQuestion = async (event) => {
    event.preventDefault();
    const question = draft.trim();

    if (!question) {
      return;
    }

    setAiMessages((current) => [
      ...current,
      {
        id: `AI-U-${Date.now()}`,
        role: "user",
        text: question,
      },
    ]);
    setDraft("");
    setThinking(true);

    let answer = "";

    try {
      const response = await fetch(
        "/api/student/ai-assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: course.id,
            courseTitle: course.title,
            question,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("AI endpoint unavailable");
      }

      const data = await response.json();
      answer = data.answer;
    } catch {
      answer = buildLocalAiResponse(course, question);
    }

    setAiMessages((current) => [
      ...current,
      {
        id: `AI-A-${Date.now()}`,
        role: "assistant",
        text: answer,
      },
    ]);
    setThinking(false);
  };

  return (
    <>
      <HeroPanel
        eyebrow="AI learning assistant"
        title="Get course-aware help with lessons and assigned work."
        description="The assistant can explain, review and guide. It cannot grade work, approve projects, unlock payment access or replace the tutor."
        image="/images/hero/banner4.png"
      />

      <section className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-5">
          <label className="text-xs font-black uppercase tracking-[0.14em] text-neutral-500">
            Active course context
          </label>
          <select
            value={courseId}
            onChange={(event) =>
              setCourseId(Number(event.target.value))
            }
            className="mt-2 h-12 w-full max-w-xl rounded-2xl border border-neutral-300 bg-white px-4 text-sm font-bold outline-none focus:border-red-600"
          >
            {paidEnrollments.map((enrollment) => {
              const itemCourse = getCourse(
                enrollment.courseId,
              );

              return (
                <option
                  key={enrollment.id}
                  value={itemCourse.id}
                >
                  {itemCourse.title}
                </option>
              );
            })}
          </select>
        </div>

        <div className="min-h-[480px] space-y-4 p-5 sm:p-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl rounded-2xl p-4 text-sm leading-7 ${
                  message.role === "user"
                    ? "bg-red-600 text-white"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {thinking && (
            <p className="text-sm font-bold text-neutral-400">
              Assistant is preparing a response...
            </p>
          )}
        </div>

        <form
          onSubmit={sendQuestion}
          className="flex gap-3 border-t border-neutral-200 p-4"
        >
          <input
            value={draft}
            onChange={(event) =>
              setDraft(event.target.value)
            }
            placeholder={`Ask about ${course.title}...`}
            className="h-13 flex-1 rounded-full border border-neutral-300 px-5 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
          />
          <button
            type="submit"
            className="flex h-13 w-13 items-center justify-center rounded-full bg-red-600 text-white hover:bg-neutral-950"
            aria-label="Ask AI"
          >
            <Icon name="send" />
          </button>
        </form>
      </section>
    </>
  );
}

function ScoresPage({
  enrollments,
  learningState,
}) {
  const records = enrollments.flatMap((enrollment) => {
    const course = getCourse(enrollment.courseId);
    const assignmentScores =
      learningState.scores[course.id] || {};

    return course.assignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      courseTitle: course.title,
      score:
        assignmentScores[assignment.id]?.score ?? null,
      feedback:
        assignmentScores[assignment.id]?.feedback ?? "",
    }));
  });

  return (
    <>
      <HeroPanel
        eyebrow="Scores and feedback"
        title="Tutor grades appear after submitted work is reviewed."
        description="Only tutors can award official scores and feedback. Ungraded submissions remain marked as awaiting review."
        image="/images/hero/banner2.png"
      />

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6">
        <div className="space-y-4">
          {records.map((record) => (
            <article
              key={record.id}
              className="grid gap-4 rounded-2xl border border-neutral-200 p-5 md:grid-cols-[1fr_140px] md:items-center"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">
                  {record.courseTitle}
                </p>
                <h2 className="mt-2 font-black">
                  {record.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  {record.feedback ||
                    "Tutor review has not been completed yet."}
                </p>
              </div>

              <div
                className={`rounded-2xl p-4 text-center ${
                  record.score === null
                    ? "bg-neutral-100"
                    : "bg-red-50"
                }`}
              >
                <p className="text-xs text-neutral-400">
                  Score
                </p>
                <p className="mt-2 text-2xl font-black">
                  {record.score === null
                    ? "Pending"
                    : `${record.score}%`}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function CertificatesPage({
  enrollments,
  learningState,
}) {
  const completedCourses = enrollments
    .map((enrollment) => getCourse(enrollment.courseId))
    .filter(
      (course) =>
        calculateCourseProgress(course, learningState) ===
        100,
    );

  return (
    <>
      <HeroPanel
        eyebrow="Certificates"
        title="Certificates unlock after all course requirements are completed."
        description="Lessons, attendance and assignments contribute to progress, but the final tutor-approved project is required before a certificate reaches 100% eligibility."
        image="/images/hero/banner4.png"
      />

      <section className="mt-6">
        {completedCourses.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-10 text-center">
            <Icon
              name="certificate"
              className="mx-auto h-10 w-10 text-red-600"
            />
            <h2 className="mt-5 text-2xl font-black">
              No certificate unlocked yet
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-500">
              Continue learning and wait for tutor approval of the final
              project. Eligible certificates will appear automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {completedCourses.map((course) => (
              <article
                key={course.id}
                className="rounded-[28px] bg-neutral-950 p-8 text-white"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
                  NexaCore certificate
                </p>
                <h2 className="mt-4 text-3xl font-black">
                  {course.title}
                </h2>
                <button
                  type="button"
                  className="mt-7 rounded-full bg-red-600 px-6 py-3 text-sm font-black"
                >
                  Download certificate
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function PortfolioPage({
  enrollments,
  learningState,
}) {
  const approvedProjects = enrollments.flatMap(
    (enrollment) => {
      const course = getCourse(enrollment.courseId);

      return course.projects
        .filter(
          (project) =>
            learningState.projectSubmissions[course.id]?.[
              project.id
            ]?.status === "approved",
        )
        .map((project) => ({ project, course }));
    },
  );

  return (
    <>
      <HeroPanel
        eyebrow="Student portfolio"
        title="Only tutor-approved projects become public portfolio work."
        description="Submitted projects remain private until the assigned tutor reviews and approves them."
        image="/images/hero/banner1.png"
      />

      <section className="mt-6">
        {approvedProjects.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-10 text-center">
            <Icon
              name="portfolio"
              className="mx-auto h-10 w-10 text-red-600"
            />
            <h2 className="mt-5 text-2xl font-black">
              No approved portfolio project yet
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-500">
              Submit your assigned project and wait for tutor approval.
              Approved projects will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {approvedProjects.map(({ project, course }) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white"
              >
                <img
                  src={course.image}
                  alt=""
                  className="h-[220px] w-full object-cover"
                />
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">
                    {course.title}
                  </p>
                  <h2 className="mt-3 text-xl font-black">
                    {project.title}
                  </h2>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ProfilePage({
  profile,
  profileProgress,
}) {
  return (
    <>
      <HeroPanel
        eyebrow="Student profile"
        title={`${profile.firstName} ${profile.lastName}`}
        description="Your profile is used for classes, certificates, tutor communication and approved portfolio work."
        image="/images/hero/banner4.png"
      />

      <section className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="rounded-[28px] bg-neutral-950 p-7 text-center text-white">
          <Avatar
            profile={profile}
            size="mx-auto h-28 w-28"
            text="text-3xl"
          />
          <h2 className="mt-5 text-2xl font-black">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="mt-2 text-sm text-white/45">
            {profile.email}
          </p>

          <div className="mt-7 rounded-2xl bg-white/[0.06] p-5">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-white/50">
                Profile progress
              </span>
              <span className="font-black text-red-400">
                {profileProgress}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-red-600"
                style={{ width: `${profileProgress}%` }}
              />
            </div>
          </div>

          <a
            href="/student/settings"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-red-600 text-sm font-black"
          >
            Edit profile
          </a>
        </aside>

        <div className="rounded-[28px] border border-neutral-200 bg-white p-7">
          <h2 className="text-2xl font-black">
            Profile information
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Phone", profile.phone || "Not added"],
              ["Location", profile.location || "Not added"],
              ["Career goal", profile.careerGoal || "Not added"],
              ["LinkedIn", profile.linkedIn || "Not added"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-neutral-200 p-5"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">
                  {label}
                </p>
                <p className="mt-3 text-sm font-bold">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-neutral-200 p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-400">
              About
            </p>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              {profile.bio ||
                "No biography has been added yet."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function SettingsPage({
  profile,
  setProfile,
  profileProgress,
}) {
  const [draft, setDraft] = useState(profile);
  const [photoError, setPhotoError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    setSaved(false);
    setDraft((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const uploadPhoto = (event) => {
    const file = event.target.files?.[0];
    setPhotoError("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("The image must be 2 MB or smaller.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setDraft((current) => ({
        ...current,
        profilePhoto: String(reader.result),
      }));
    };

    reader.readAsDataURL(file);
  };

  const save = (event) => {
    event.preventDefault();
    setProfile(draft);
    setSaved(true);
  };

  return (
    <>
      <HeroPanel
        eyebrow="Account settings"
        title="Complete your profile and upload your picture."
        description="Profile progress increases automatically as required details are completed."
        image="/images/hero/banner1.png"
      />

      <form
        onSubmit={save}
        className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"
      >
        <div className="rounded-[24px] bg-neutral-50 p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar
              profile={draft}
              size="h-28 w-28"
              text="text-3xl"
            />
            <div>
              <p className="font-black">Profile picture</p>
              <p className="mt-2 text-sm text-neutral-500">
                Upload JPG, PNG or WebP. Maximum size is 2 MB.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <label className="cursor-pointer rounded-full bg-red-600 px-5 py-3 text-xs font-black text-white hover:bg-neutral-950">
                  Upload picture
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={uploadPhoto}
                  />
                </label>

                {draft.profilePhoto && (
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        profilePhoto: "",
                      }))
                    }
                    className="rounded-full border border-neutral-300 px-5 py-3 text-xs font-black"
                  >
                    Remove picture
                  </button>
                )}
              </div>

              {photoError && (
                <p className="mt-3 text-xs font-bold text-red-600">
                  {photoError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {[
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["email", "Email address"],
            ["phone", "Phone number"],
            ["location", "Location"],
            ["careerGoal", "Career goal"],
            ["linkedIn", "LinkedIn profile"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="mb-2 block text-sm font-black">
                {label}
              </label>
              <input
                name={name}
                type={name === "email" ? "email" : "text"}
                value={draft[name]}
                onChange={handleChange}
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-black">
              About you
            </label>
            <textarea
              name="bio"
              value={draft.bio}
              onChange={handleChange}
              rows={6}
              className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
        >
          <Icon name="check" />
          Save changes · {profileProgress}% complete
        </button>

        {saved && (
          <p className="mt-4 rounded-2xl bg-green-50 p-4 text-center text-sm font-bold text-green-700">
            Profile saved successfully.
          </p>
        )}
      </form>
    </>
  );
}

function findClass(classId) {
  for (const course of courseCatalog) {
    const liveClass = course.classes.find(
      (item) => item.id === Number(classId),
    );

    if (liveClass) {
      return { liveClass, course };
    }
  }

  return null;
}

function findAssignment(assignmentId) {
  for (const course of courseCatalog) {
    const assignment = course.assignments.find(
      (item) => item.id === Number(assignmentId),
    );

    if (assignment) {
      return { assignment, course };
    }
  }

  return null;
}

function findProject(projectId) {
  for (const course of courseCatalog) {
    const project = course.projects.find(
      (item) => item.id === Number(projectId),
    );

    if (project) {
      return { project, course };
    }
  }

  return null;
}

export default function StudentPortal() {
  const path = window.location.pathname;

  const [profile, setProfile] = usePersistentState(
    STORAGE_KEYS.profile,
    defaultProfile,
  );

  const [enrollments, setEnrollments] = usePersistentState(
    STORAGE_KEYS.enrollments,
    defaultEnrollments,
  );

  const [learningState, setLearningState] =
    usePersistentState(
      STORAGE_KEYS.learning,
      defaultLearningState,
    );

  const [messages, setMessages] = usePersistentState(
    STORAGE_KEYS.messages,
    defaultMessages,
  );

  const [notifications] = usePersistentState(
    STORAGE_KEYS.notifications,
    defaultNotifications,
  );

  const profileProgress = useMemo(
    () => calculateProfileProgress(profile),
    [profile],
  );

  let title = "Student workspace";
  let page = null;

  const courseMatch = path.match(
    /^\/student\/courses\/(\d+)$/,
  );
  const classMatch = path.match(
    /^\/student\/classes\/(\d+)\/room$/,
  );
  const assignmentMatch = path.match(
    /^\/student\/assignments\/(\d+)$/,
  );
  const projectMatch = path.match(
    /^\/student\/projects\/(\d+)$/,
  );

  if (path === "/student/dashboard") {
    title = "Dashboard overview";
    page = (
      <DashboardPage
        enrollments={enrollments}
        learningState={learningState}
      />
    );
  } else if (path === "/student/payments") {
    title = "Payments";
    page = (
      <PaymentsPage
        enrollments={enrollments}
        setEnrollments={setEnrollments}
      />
    );
  } else if (path === "/student/courses") {
    title = "My Courses";
    page = (
      <CoursesPage
        enrollments={enrollments}
        learningState={learningState}
      />
    );
  } else if (path === "/student/curriculum") {
    title = "Curriculum";
    page = (
      <CurriculumPage
        enrollments={enrollments}
        learningState={learningState}
      />
    );
  } else if (courseMatch) {
    const course = getCourse(courseMatch[1]);
    title = course?.title || "Course";
    page = course ? (
      <CourseDetailPage
        course={course}
        enrollments={enrollments}
        learningState={learningState}
        setLearningState={setLearningState}
      />
    ) : null;
  } else if (path === "/student/classes") {
    title = "Live Classes";
    page = (
      <ClassesPage
        enrollments={enrollments}
        learningState={learningState}
      />
    );
  } else if (classMatch) {
    const result = findClass(classMatch[1]);
    title = result?.liveClass.title || "Live Classroom";
    page = result ? (
      <LiveRoomPage
        liveClass={result.liveClass}
        course={result.course}
        enrollments={enrollments}
        learningState={learningState}
        setLearningState={setLearningState}
      />
    ) : null;
  } else if (path === "/student/assignments") {
    title = "Assignments";
    page = (
      <AssignmentsPage
        enrollments={enrollments}
        learningState={learningState}
      />
    );
  } else if (assignmentMatch) {
    const result = findAssignment(assignmentMatch[1]);
    title = result?.assignment.title || "Assignment";
    page = result ? (
      <AssignmentDetailPage
        assignment={result.assignment}
        course={result.course}
        enrollments={enrollments}
        learningState={learningState}
        setLearningState={setLearningState}
      />
    ) : null;
  } else if (path === "/student/projects") {
    title = "Projects";
    page = (
      <ProjectsPage
        enrollments={enrollments}
        learningState={learningState}
      />
    );
  } else if (projectMatch) {
    const result = findProject(projectMatch[1]);
    title = result?.project.title || "Project";
    page = result ? (
      <ProjectDetailPage
        project={result.project}
        course={result.course}
        enrollments={enrollments}
        learningState={learningState}
        setLearningState={setLearningState}
      />
    ) : null;
  } else if (path === "/student/messages") {
    title = "Tutor Messages";
    page = (
      <MessagesPage
        enrollments={enrollments}
        messages={messages}
        setMessages={setMessages}
      />
    );
  } else if (path === "/student/ai-assistant") {
    title = "AI Assistant";
    page = (
      <AiAssistantPage enrollments={enrollments} />
    );
  } else if (path === "/student/scores") {
    title = "Scores";
    page = (
      <ScoresPage
        enrollments={enrollments}
        learningState={learningState}
      />
    );
  } else if (path === "/student/certificates") {
    title = "Certificates";
    page = (
      <CertificatesPage
        enrollments={enrollments}
        learningState={learningState}
      />
    );
  } else if (path === "/student/portfolio") {
    title = "Portfolio";
    page = (
      <PortfolioPage
        enrollments={enrollments}
        learningState={learningState}
      />
    );
  } else if (path === "/student/profile") {
    title = "Student Profile";
    page = (
      <ProfilePage
        profile={profile}
        profileProgress={profileProgress}
      />
    );
  } else if (path === "/student/settings") {
    title = "Settings";
    page = (
      <SettingsPage
        profile={profile}
        setProfile={setProfile}
        profileProgress={profileProgress}
      />
    );
  }

  if (!page) {
    page = (
      <section className="rounded-[28px] border border-neutral-200 bg-white p-10 text-center">
        <h2 className="text-2xl font-black">
          Student page not found
        </h2>
        <a
          href="/student/dashboard"
          className="mt-5 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white"
        >
          Return to dashboard
        </a>
      </section>
    );
  }

  return (
    <StudentShell
      title={title}
      profile={profile}
      profileProgress={profileProgress}
      notifications={notifications}
    >
      {page}
    </StudentShell>
  );
}
