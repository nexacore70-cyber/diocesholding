import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CLIENT_DEPOSIT_PERCENT,
  CLIENT_FINAL_PERCENT,
  CLIENT_STORAGE_KEYS,
  NEXACORE_FEE_PERCENT,
  TALENT_PAYOUT_PERCENT,
  beginClientAccount,
  calculateEscrowBreakdown,
  defaultClientFiles,
  defaultClientMessages,
  defaultClientProfile,
  defaultClientReviews,
  defaultPayments,
  defaultProjects,
  defaultSupportTickets,
  defaultBids,
  formatProjectMoney,
  getClientLandingPath,
  getProject,
  getServiceCategory,
  getTalentProfile,
  loadClientValue,
  saveClientValue,
  serviceCategories,
  talentProfiles,
} from "./clientData";
import ThemeToggle from "../../theme/ThemeToggle";

const clientNavigation = [
  {
    label: "Overview",
    href: "/client/dashboard",
    icon: "home",
  },
  {
    label: "Browse Services",
    href: "/client/services",
    icon: "services",
  },
  {
    label: "Post Project",
    href: "/client/projects/new",
    icon: "plus",
  },
  {
    label: "Active Projects",
    href: "/client/projects",
    icon: "projects",
  },
  {
    label: "Bids",
    href: "/client/bids",
    icon: "bids",
  },
  {
    label: "Messages",
    href: "/client/messages",
    icon: "messages",
  },
  {
    label: "Payments / Escrow",
    href: "/client/payments",
    icon: "payments",
  },
  {
    label: "Files",
    href: "/client/files",
    icon: "files",
  },
  {
    label: "Reviews",
    href: "/client/reviews",
    icon: "reviews",
  },
  {
    label: "Support",
    href: "/client/support",
    icon: "support",
  },
];

export function isClientPortalPath(pathname) {
  return (
    pathname === "/client" ||
    pathname === "/client/dashboard" ||
    pathname === "/client/services" ||
    pathname === "/client/projects/new" ||
    pathname === "/client/projects" ||
    pathname === "/client/bids" ||
    pathname === "/client/messages" ||
    pathname === "/client/payments" ||
    pathname === "/client/files" ||
    pathname === "/client/reviews" ||
    pathname === "/client/support" ||
    pathname === "/client/settings" ||
    /^\/client\/projects\/[^/]+$/.test(pathname) ||
    /^\/client\/room\/[^/]+$/.test(pathname) ||
    /^\/client\/talent\/[^/]+$/.test(pathname)
  );
}

function useClientState(key, fallback) {
  const [value, setValue] = useState(() =>
    loadClientValue(key, fallback),
  );

  const updateValue = (nextValue) => {
    setValue((currentValue) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? nextValue(currentValue)
          : nextValue;

      saveClientValue(key, resolvedValue);
      return resolvedValue;
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
    services: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    plus: (
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ),
    projects: (
      <>
        <path d="M4 7h16v13H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 7V4h8v3M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    bids: (
      <>
        <path d="M7 4h10v16H7z" stroke="currentColor" strokeWidth="2" />
        <path d="M10 8h4M10 12h4M10 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    messages: (
      <>
        <path d="M4 5h16v12H8l-4 4V5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    payments: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 9h18M7 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    files: (
      <>
        <path d="M6 3h8l4 4v14H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M14 3v5h5M9 13h6M9 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    reviews: (
      <>
        <path d="m12 3 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
    support: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M9.5 9a2.6 2.6 0 1 1 4.3 2c-1 .8-1.8 1.3-1.8 2.5M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
    check: <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    phone: (
      <path d="M5 4c1 7 8 14 15 15l1-5-5-2-2 2c-3-1-5-3-6-6l2-2-2-5-3 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    ),
    video: (
      <>
        <rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="m17 10 4-2v8l-4-2v-4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </>
    ),
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
    screen: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    send: <path d="m3 11 18-8-8 18-2-8-8-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M4 21c1-5 4-7 8-7s7 2 8 7" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-4l-.4 3.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L6 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 3.1h4l.4-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" stroke="currentColor" strokeWidth="1.5" />
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

function Avatar({
  initials,
  image,
  size = "h-11 w-11",
  className = "",
}) {
  if (image) {
    return (
      <img
        src={image}
        alt=""
        className={`${size} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white ${className}`}
    >
      {initials}
    </div>
  );
}

function statusClass(status) {
  const greenStatuses = [
    "active",
    "verified",
    "fully_funded",
    "completed",
    "released",
    "successful",
  ];

  const amberStatuses = [
    "bids_received",
    "deposit_pending",
    "validating",
    "pending",
    "in_progress",
    "final_funding_required",
    "final_delivery_available",
  ];

  if (greenStatuses.includes(status)) {
    return "bg-green-50 text-green-700";
  }

  if (amberStatuses.includes(status)) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-red-50 text-red-700";
}

function PageHero({
  eyebrow,
  title,
  description,
  image = "/images/hero/banner1.png",
  action,
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-neutral-950">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/20" />
      <div className="relative z-10 flex flex-col gap-7 px-7 py-12 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-12">
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
        {action}
      </div>
    </section>
  );
}

function ClientShell({
  profile,
  title,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname;
  const initials = `${profile.firstName?.[0] || "C"}${
    profile.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-neutral-950">
      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 top-[88px] z-40 bg-black/45 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />

          <aside className="fixed left-4 top-[104px] z-50 flex max-h-[calc(100vh-120px)] w-[calc(100%-2rem)] max-w-[365px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950 text-white shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                  Client workspace
                </p>
                <h2 className="mt-1 text-lg font-black">
                  Service marketplace
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] hover:bg-red-600"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="m-4 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
              <Avatar
                initials={initials}
                image={profile.profilePhoto}
                size="h-12 w-12"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-black">
                  {profile.companyName}
                </p>
                <p className="mt-1 truncate text-xs text-white/45">
                  {profile.email}
                </p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 pb-5">
              <div className="space-y-1">
                {clientNavigation.map((item) => {
                  const active =
                    currentPath === item.href ||
                    (item.href !== "/client/dashboard" &&
                      currentPath.startsWith(`${item.href}/`));

                  return (
                    <a
                      key={item.href}
                      href={item.href}
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
                href="/client/settings"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 hover:bg-white/[0.07] hover:text-white"
              >
                <Icon name="settings" />
                Settings
              </a>

              <a
                href="/login"
                className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 hover:bg-red-600/15 hover:text-red-400"
              >
                <Icon name="logout" />
                Log out
              </a>
            </nav>
          </aside>
        </>
      )}

      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="flex h-[88px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <ThemeToggle placement="inline" />
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                menuOpen
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-neutral-200 bg-white hover:border-red-600 hover:text-red-600"
              }`}
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
                Client workspace
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
                placeholder="Search projects, talent and services..."
                className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-12 pr-5 text-sm outline-none focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
              />
            </div>
          </div>

          <a
            href="/client/projects/new"
            className="hidden h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-xs font-black text-white hover:bg-neutral-950 sm:inline-flex"
          >
            <Icon name="plus" className="h-4 w-4" />
            Post project
          </a>

          <a
            href="/client/settings"
            className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white p-1.5 pr-3"
          >
            <Avatar
              initials={initials}
              image={profile.profilePhoto}
              size="h-9 w-9"
            />
            <div className="hidden text-left xl:block">
              <p className="max-w-[160px] truncate text-xs font-black">
                {profile.companyName}
              </p>
              <p className="text-[10px] text-neutral-400">
                Client account
              </p>
            </div>
          </a>
        </div>
      </header>

      <main className="px-5 py-7 sm:px-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}

function DashboardPage({
  projects,
  bids,
  payments,
}) {
  const openProjects = projects.filter(
    (project) =>
      !["completed", "cancelled"].includes(project.status),
  ).length;

  const bidCount = bids.filter((bid) =>
    projects.some(
      (project) =>
        project.id === bid.projectId &&
        project.status !== "completed",
    ),
  ).length;

  const escrowHeld = projects.reduce(
    (sum, project) =>
      sum +
      Number(project.depositPaid || 0) +
      Number(project.finalPaid || 0),
    0,
  );

  const activeTalent = new Set(
    projects
      .map((project) => project.selectedTalentId)
      .filter(Boolean),
  ).size;

  return (
    <>
      <PageHero
        eyebrow="Client dashboard"
        title="Post work, compare talent and manage delivery from one secure workspace."
        description={`Clients fund ${CLIENT_DEPOSIT_PERCENT}% before work begins. The remaining ${CLIENT_FINAL_PERCENT}% must be validated before final files are released. Completed revenue is split ${TALENT_PAYOUT_PERCENT}% to talent and ${NEXACORE_FEE_PERCENT}% to NexaCore.`}
        image="/images/hero/banner1.png"
        action={
          <a
            href="/client/projects/new"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-red-600 px-7 text-sm font-black text-white hover:bg-white hover:text-red-600"
          >
            <Icon name="plus" />
            Post a project
          </a>
        }
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Active projects", openProjects, "projects"],
          ["Received bids", bidCount, "bids"],
          ["Escrow funded", formatProjectMoney(escrowHeld, "USD"), "payments"],
          ["Selected talent", activeTalent, "user"],
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

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                Current work
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Project activity
              </h2>
            </div>
            <a
              href="/client/projects"
              className="text-sm font-black text-red-600"
            >
              View all
            </a>
          </div>

          <div className="mt-6 space-y-4">
            {projects.map((project) => {
              const category = getServiceCategory(
                project.categoryId,
              );

              return (
                <article
                  key={project.id}
                  className="grid gap-4 rounded-2xl border border-neutral-200 p-5 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${statusClass(
                        project.status,
                      )}`}
                    >
                      {project.status.replaceAll("_", " ")}
                    </span>
                    <h3 className="mt-3 text-lg font-black">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-400">
                      {category?.title} ·{" "}
                      {formatProjectMoney(
                        project.budget,
                        project.currency,
                      )}
                    </p>
                  </div>

                  <a
                    href={`/client/projects/${project.id}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-xs font-black text-white hover:bg-red-600"
                  >
                    Open project
                    <Icon name="arrow" className="h-4 w-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Secure marketplace flow
          </p>
          <h2 className="mt-3 text-2xl font-black">
            How project funding works
          </h2>

          <div className="mt-6 space-y-4">
            {[
              [
                "1",
                "Compare bids",
                "Review proposal, price, reviews and portfolio before selecting talent.",
              ],
              [
                "2",
                "Fund 25% deposit",
                "NexaCore validates the payment before dispatching the project.",
              ],
              [
                "3",
                "Complete funding",
                "Pay the remaining 75% before the talent shares final work.",
              ],
              [
                "4",
                "Release and payout",
                "After validated delivery, talent receives 80% and NexaCore retains 20%.",
              ],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="flex gap-4 rounded-2xl bg-white/[0.06] p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-black">
                  {number}
                </span>
                <div>
                  <p className="font-black">{title}</p>
                  <p className="mt-1 text-xs leading-6 text-white/45">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}

function ServicesPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("all");

  const visibleCategories = serviceCategories.filter(
    (category) => {
      const categoryMatches =
        activeCategory === "all" ||
        category.id === activeCategory;

      const text = `${category.title} ${category.description} ${category.services.join(
        " ",
      )}`.toLowerCase();

      return (
        categoryMatches &&
        text.includes(query.toLowerCase())
      );
    },
  );

  return (
    <>
      <PageHero
        eyebrow="Service marketplace"
        title="Find the right professional service before posting your project."
        description="Explore service categories, then create a detailed project so verified talent can submit competitive bids."
        image="/images/hero/banner2.png"
      />

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
            />
            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search services, skills or categories..."
              className="h-14 w-full rounded-2xl border border-neutral-300 pl-12 pr-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            />
          </div>

          <select
            value={activeCategory}
            onChange={(event) =>
              setActiveCategory(event.target.value)
            }
            className="h-14 rounded-2xl border border-neutral-300 bg-white px-4 text-sm font-bold outline-none focus:border-red-600"
          >
            <option value="all">All categories</option>
            {serviceCategories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {visibleCategories.map((category) => (
          <article
            key={category.id}
            className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white"
          >
            <div className="relative h-[220px]">
              <img
                src={category.image}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <h2 className="absolute bottom-5 left-5 right-5 text-2xl font-black text-white">
                {category.title}
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm leading-7 text-neutral-500">
                {category.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {category.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-600"
                  >
                    {service}
                  </span>
                ))}
              </div>

              <a
                href={`/client/projects/new?category=${category.id}`}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
              >
                Post a project
                <Icon name="arrow" />
              </a>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function NewProjectPage({
  setProjects,
  setFiles,
}) {
  const queryCategory = new URLSearchParams(
    window.location.search,
  ).get("category");

  const initialCategory =
    getServiceCategory(queryCategory) ||
    serviceCategories[0];

  const [form, setForm] = useState({
    title: "",
    categoryId: initialCategory.id,
    service: initialCategory.services[0],
    description: "",
    budget: "",
    currency: "USD",
    deadline: "",
    skills: "",
  });

  const [attachmentNames, setAttachmentNames] =
    useState([]);
  const [error, setError] = useState("");

  const category = getServiceCategory(form.categoryId);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "categoryId"
        ? {
            service:
              getServiceCategory(value)?.services[0] ||
              "",
          }
        : {}),
    }));
  };

  const submitProject = (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      Number(form.budget) <= 0 ||
      !form.deadline
    ) {
      setError(
        "Complete the title, description, budget and deadline.",
      );
      return;
    }

    const projectId = `PRJ-${Date.now()}`;
    const skills = form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    setProjects((current) => [
      {
        id: projectId,
        title: form.title.trim(),
        categoryId: form.categoryId,
        service: form.service,
        description: form.description.trim(),
        budget: Number(form.budget),
        currency: form.currency,
        deadline: form.deadline,
        skills,
        attachments: attachmentNames,
        status: "open",
        createdAt: new Date().toISOString(),
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
      ...current,
    ]);

    if (attachmentNames.length > 0) {
      setFiles((current) => [
        ...attachmentNames.map((fileName) => ({
          id: `FILE-${Date.now()}-${fileName}`,
          projectId,
          uploadedBy: "client",
          fileName,
          fileType:
            fileName.split(".").pop()?.toUpperCase() ||
            "FILE",
          visibility: "project",
          deliveryType: "requirement",
          status: "available",
          createdAt: new Date().toISOString(),
        })),
        ...current,
      ]);
    }

    window.location.href = `/client/projects/${projectId}`;
  };

  return (
    <>
      <PageHero
        eyebrow="Post a project"
        title="Describe the outcome, budget and skills you need."
        description="A clear project brief helps verified talent submit accurate bids, delivery timelines and milestones."
        image="/images/hero/banner4.png"
      />

      <form
        onSubmit={submitProject}
        className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]"
      >
        <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-black">
                Project title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={updateField}
                placeholder="Example: Build a responsive logistics platform"
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Service category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={updateField}
                className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600"
              >
                {serviceCategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Required service
              </label>
              <select
                name="service"
                value={form.service}
                onChange={updateField}
                className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600"
              >
                {category.services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-black">
                Project description and expected result
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={8}
                placeholder="Explain the business need, required features, expected result and important constraints."
                className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Budget
              </label>
              <input
                name="budget"
                value={form.budget}
                onChange={updateField}
                type="number"
                min="1"
                placeholder="5000"
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Currency
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={updateField}
                className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600"
              >
                <option value="USD">USD</option>
                <option value="NGN">NGN</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Delivery deadline
              </label>
              <input
                name="deadline"
                value={form.deadline}
                onChange={updateField}
                type="date"
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Required skills
              </label>
              <input
                name="skills"
                value={form.skills}
                onChange={updateField}
                placeholder="React, Node.js, Figma"
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block cursor-pointer rounded-[24px] border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center hover:border-red-600">
                <Icon
                  name="upload"
                  className="mx-auto h-8 w-8 text-red-600"
                />
                <p className="mt-4 font-black">
                  Upload briefs, examples or requirement files
                </p>
                <p className="mt-2 text-xs text-neutral-400">
                  The frontend stores selected filenames. Production uploads must use secure object storage.
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event) =>
                    setAttachmentNames(
                      Array.from(
                        event.target.files || [],
                      ).map((file) => file.name),
                    )
                  }
                />
              </label>

              {attachmentNames.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attachmentNames.map((fileName) => (
                    <span
                      key={fileName}
                      className="rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700"
                    >
                      {fileName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
          >
            <Icon name="plus" />
            Publish project
          </button>
        </section>

        <aside className="h-fit rounded-[28px] bg-neutral-950 p-6 text-white xl:sticky xl:top-[112px]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Marketplace protection
          </p>
          <h2 className="mt-3 text-2xl font-black">
            Payment is not released directly to talent
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/55">
            NexaCore validates client funding into the company escrow account before work is dispatched.
          </p>

          <div className="mt-6 space-y-3">
            {[
              `${CLIENT_DEPOSIT_PERCENT}% deposit before work begins`,
              `${CLIENT_FINAL_PERCENT}% balance before final files unlock`,
              `${TALENT_PAYOUT_PERCENT}% paid to talent after validated delivery`,
              `${NEXACORE_FEE_PERCENT}% retained by NexaCore`,
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl bg-white/[0.06] p-3"
              >
                <Icon
                  name="check"
                  className="h-4 w-4 text-red-500"
                />
                <span className="text-sm text-white/70">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </form>
    </>
  );
}

function ProjectsPage({ projects }) {
  return (
    <>
      <PageHero
        eyebrow="Active projects"
        title="Track every project from bids through final delivery."
        description="Project status, selected talent, funding and files remain connected in one secure project workspace."
        image="/images/hero/banner3.png"
      />

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const talent = getTalentProfile(
            project.selectedTalentId,
          );

          return (
            <article
              key={project.id}
              className="rounded-[28px] border border-neutral-200 bg-white p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${statusClass(
                    project.status,
                  )}`}
                >
                  {project.status.replaceAll("_", " ")}
                </span>
                <span className="text-xs font-black text-neutral-400">
                  {project.id}
                </span>
              </div>

              <h2 className="mt-5 text-xl font-black">
                {project.title}
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                {project.service}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                    Budget
                  </p>
                  <p className="mt-2 font-black">
                    {formatProjectMoney(
                      project.budget,
                      project.currency,
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                    Deadline
                  </p>
                  <p className="mt-2 font-black">
                    {project.deadline}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-neutral-200 p-4">
                {talent ? (
                  <>
                    <Avatar
                      initials={talent.initials}
                      size="h-11 w-11"
                    />
                    <div>
                      <p className="text-sm font-black">
                        {talent.name}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        Selected talent
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                      <Icon name="bids" />
                    </div>
                    <div>
                      <p className="text-sm font-black">
                        Review available bids
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        No talent selected yet
                      </p>
                    </div>
                  </>
                )}
              </div>

              <a
                href={`/client/projects/${project.id}`}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-neutral-950 text-sm font-black text-white hover:bg-red-600"
              >
                Open project
                <Icon name="arrow" />
              </a>
            </article>
          );
        })}
      </section>
    </>
  );
}

function BidsPage({
  projects,
  bids,
}) {
  const activeProject =
    projects.find((project) =>
      bids.some((bid) => bid.projectId === project.id),
    ) || projects[0];

  const [selectedProjectId, setSelectedProjectId] =
    useState(activeProject?.id || "");

  const projectBids = bids.filter(
    (bid) => bid.projectId === selectedProjectId,
  );

  return (
    <>
      <PageHero
        eyebrow="Talent bids"
        title="Compare proposal, portfolio, reviews, cost and delivery plan."
        description="Open each talent profile before accepting a bid. You can message them or start a call directly from the marketplace."
        image="/images/hero/banner2.png"
      />

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-5">
        <label className="text-xs font-black uppercase tracking-[0.14em] text-neutral-500">
          Select project
        </label>
        <select
          value={selectedProjectId}
          onChange={(event) =>
            setSelectedProjectId(event.target.value)
          }
          className="mt-2 h-14 w-full max-w-xl rounded-2xl border border-neutral-300 bg-white px-4 text-sm font-bold outline-none focus:border-red-600"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        {projectBids.map((bid) => {
          const talent = getTalentProfile(bid.talentId);

          return (
            <article
              key={bid.id}
              className="rounded-[28px] border border-neutral-200 bg-white p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <Avatar
                  initials={talent.initials}
                  size="h-16 w-16"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black">
                      {talent.name}
                    </h2>
                    {talent.verified && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-green-700">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {talent.title}
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    ★ {talent.rating} ·{" "}
                    {talent.completedProjects} completed projects
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-neutral-50 p-5">
                <p className="text-sm leading-7 text-neutral-600">
                  {bid.coverLetter}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-red-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-red-600">
                    Bid amount
                  </p>
                  <p className="mt-2 text-lg font-black text-red-700">
                    {formatProjectMoney(
                      bid.amount,
                      bid.currency,
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-100 p-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                    Delivery
                  </p>
                  <p className="mt-2 text-lg font-black">
                    {bid.deliveryDays} days
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {talent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a
                  href={`/client/talent/${talent.id}?project=${selectedProjectId}&bid=${bid.id}`}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-neutral-950 text-xs font-black text-white hover:bg-red-600"
                >
                  View details
                </a>
                <a
                  href={`/client/messages?talent=${talent.id}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-300 text-xs font-black hover:border-red-600 hover:text-red-600"
                >
                  <Icon name="messages" className="h-4 w-4" />
                  Message
                </a>
                <a
                  href={`/client/room/${selectedProjectId}?talent=${talent.id}&mode=single`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-red-600 text-xs font-black text-white hover:bg-neutral-950"
                >
                  <Icon name="video" className="h-4 w-4" />
                  Call
                </a>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

function TalentDetailPage({
  talent,
  project,
  bid,
  projects,
  setProjects,
}) {
  const breakdown = project
    ? calculateEscrowBreakdown(project, bid)
    : null;

  const acceptBid = () => {
    if (!project || !bid) {
      return;
    }

    setProjects((current) =>
      current.map((item) =>
        item.id === project.id
          ? {
              ...item,
              status: "deposit_pending",
              selectedBidId: bid.id,
              selectedTalentId: talent.id,
              budget: bid.amount,
              currency: bid.currency,
              depositRequired: breakdown.deposit,
              finalRequired: breakdown.finalPayment,
              escrowStatus: "deposit_required",
            }
          : item,
      ),
    );

    window.location.href = `/client/projects/${project.id}`;
  };

  return (
    <>
      <PageHero
        eyebrow="Talent profile"
        title={talent.name}
        description={`${talent.title} · ${talent.location} · ${talent.responseTime}`}
        image={talent.portfolio[0]?.image}
        action={
          project && bid ? (
            <button
              type="button"
              onClick={acceptBid}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-red-600 px-7 text-sm font-black text-white hover:bg-white hover:text-red-600"
            >
              Accept bid
              <Icon name="check" />
            </button>
          ) : null
        }
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
          <div className="flex items-center gap-4">
            <Avatar
              initials={talent.initials}
              size="h-20 w-20"
            />
            <div>
              <h2 className="text-2xl font-black">
                {talent.name}
              </h2>
              <p className="mt-1 text-sm text-white/50">
                {talent.title}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-white/40">Rating</p>
              <p className="mt-2 text-xl font-black">
                ★ {talent.rating}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-white/40">
                Completed
              </p>
              <p className="mt-2 text-xl font-black">
                {talent.completedProjects}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-white/40">
                Hourly rate
              </p>
              <p className="mt-2 text-xl font-black">
                {formatProjectMoney(
                  talent.hourlyRate,
                  talent.currency,
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-white/40">
                Availability
              </p>
              <p className="mt-2 text-xl font-black text-green-400">
                {talent.available ? "Available" : "Busy"}
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-7 text-white/60">
            {talent.bio}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {talent.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/[0.07] px-3 py-2 text-xs font-bold text-white/65"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            <a
              href={`/client/messages?talent=${talent.id}`}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black hover:bg-white hover:text-red-600"
            >
              <Icon name="messages" />
              Send message
            </a>
            <a
              href={`/client/room/${project?.id || "consultation"}?talent=${talent.id}&mode=single`}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.05] text-sm font-black hover:bg-white hover:text-neutral-950"
            >
              <Icon name="video" />
              Start video call
            </a>
          </div>
        </aside>

        <div className="space-y-6">
          {project && bid && (
            <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                Bid for {project.title}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-neutral-50 p-5">
                  <p className="text-xs text-neutral-400">
                    Proposal
                  </p>
                  <p className="mt-2 text-xl font-black">
                    {formatProjectMoney(
                      bid.amount,
                      bid.currency,
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-5">
                  <p className="text-xs text-neutral-400">
                    Deposit
                  </p>
                  <p className="mt-2 text-xl font-black">
                    {formatProjectMoney(
                      breakdown.deposit,
                      bid.currency,
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-5">
                  <p className="text-xs text-neutral-400">
                    Delivery
                  </p>
                  <p className="mt-2 text-xl font-black">
                    {bid.deliveryDays} days
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-neutral-600">
                {bid.coverLetter}
              </p>

              <div className="mt-5 space-y-3">
                {bid.milestones.map((milestone, index) => (
                  <div
                    key={milestone.title}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-4"
                  >
                    <div>
                      <p className="text-xs text-neutral-400">
                        Milestone {index + 1}
                      </p>
                      <p className="mt-1 font-black">
                        {milestone.title}
                      </p>
                    </div>
                    <span className="font-black text-red-600">
                      {formatProjectMoney(
                        milestone.amount,
                        bid.currency,
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Portfolio
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {talent.portfolio.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-neutral-200"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-[190px] w-full object-cover"
                  />
                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-red-600">
                      {item.type}
                    </p>
                    <h3 className="mt-2 text-lg font-black">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Client reviews
            </p>
            <div className="mt-5 space-y-4">
              {talent.reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl bg-neutral-50 p-5"
                >
                  <p className="font-black">
                    {review.client}
                  </p>
                  <p className="mt-1 text-sm text-amber-500">
                    {"★".repeat(review.rating)}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                    {review.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

function ProjectDetailPage({
  project,
  projects,
  setProjects,
  bids,
  payments,
  setPayments,
  files,
  setFiles,
}) {
  const projectBids = bids.filter(
    (bid) => bid.projectId === project.id,
  );

  const acceptedBid = projectBids.find(
    (bid) => bid.id === project.selectedBidId,
  );

  const talent = getTalentProfile(
    project.selectedTalentId,
  );

  const breakdown = calculateEscrowBreakdown(
    project,
    acceptedBid,
  );

  const [paymentMessage, setPaymentMessage] =
    useState("");
  const [deliveryName, setDeliveryName] = useState("");

  const simulateVerifiedPayment = (paymentType) => {
    const amount =
      paymentType === "deposit"
        ? breakdown.deposit
        : breakdown.finalPayment;

    setPaymentMessage("Validating payment with company escrow...");

    window.setTimeout(() => {
      const reference = `NX-${paymentType.toUpperCase()}-${Date.now()}`;

      setPayments((current) => [
        {
          id: `PAY-${Date.now()}`,
          projectId: project.id,
          type: paymentType,
          amount,
          currency: project.currency,
          status: "verified",
          createdAt: new Date().toISOString(),
          reference,
          destination: "NexaCore company escrow account",
        },
        ...current,
      ]);

      setProjects((current) =>
        current.map((item) => {
          if (item.id !== project.id) {
            return item;
          }

          if (paymentType === "deposit") {
            return {
              ...item,
              depositPaid: breakdown.deposit,
              depositRequired: breakdown.deposit,
              finalRequired: breakdown.finalPayment,
              escrowStatus: "deposit_verified",
              status: "in_progress",
              dispatchedAt: new Date().toISOString(),
              finalDeliveryStatus: "locked",
            };
          }

          return {
            ...item,
            finalPaid: breakdown.finalPayment,
            escrowStatus: "fully_funded",
            status: "fully_funded",
            finalDeliveryStatus: "available_after_talent_upload",
          };
        }),
      );

      setPaymentMessage(
        paymentType === "deposit"
          ? "Deposit verified in NexaCore escrow. The project has been dispatched to the selected talent."
          : "Full project amount verified in NexaCore escrow. Final delivery can now be released by the talent.",
      );
    }, 900);
  };

  const addFinalDelivery = () => {
    if (project.escrowStatus !== "fully_funded") {
      setPaymentMessage(
        "The remaining balance must be verified before final delivery can be shared.",
      );
      return;
    }

    const fileName =
      deliveryName.trim() || "final-project-delivery.zip";

    setFiles((current) => [
      {
        id: `FILE-${Date.now()}`,
        projectId: project.id,
        uploadedBy: "talent",
        fileName,
        fileType:
          fileName.split(".").pop()?.toUpperCase() || "FILE",
        visibility: "project",
        deliveryType: "final",
        status: "awaiting_client_approval",
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);

    setProjects((current) =>
      current.map((item) =>
        item.id === project.id
          ? {
              ...item,
              finalDeliveryStatus: "awaiting_client_approval",
              status: "final_delivery_available",
            }
          : item,
      ),
    );

    setDeliveryName("");
    setPaymentMessage(
      "Final delivery added to the project room for client review.",
    );
  };

  const approveDeliveryAndRelease = () => {
    const finalFile = files.find(
      (file) =>
        file.projectId === project.id &&
        file.deliveryType === "final",
    );

    if (!finalFile) {
      setPaymentMessage(
        "No final delivery file is available yet.",
      );
      return;
    }

    if (project.escrowStatus !== "fully_funded") {
      setPaymentMessage(
        "Escrow must be fully funded before payout.",
      );
      return;
    }

    setFiles((current) =>
      current.map((file) =>
        file.id === finalFile.id
          ? {
              ...file,
              status: "approved_and_released",
            }
          : file,
      ),
    );

    setProjects((current) =>
      current.map((item) =>
        item.id === project.id
          ? {
              ...item,
              status: "completed",
              finalDeliveryStatus: "approved_and_released",
              payoutStatus: "released",
              talentPayoutAmount: breakdown.talentPayout,
              nexacoreFeeAmount: breakdown.companyFee,
              completedAt: new Date().toISOString(),
            }
          : item,
      ),
    );

    setPayments((current) => [
      {
        id: `PAYOUT-${Date.now()}`,
        projectId: project.id,
        type: "talent_payout",
        amount: breakdown.talentPayout,
        currency: project.currency,
        status: "released",
        createdAt: new Date().toISOString(),
        reference: `NX-PAYOUT-${Date.now()}`,
        destination: talent?.name || "Selected talent",
      },
      {
        id: `FEE-${Date.now()}`,
        projectId: project.id,
        type: "nexacore_fee",
        amount: breakdown.companyFee,
        currency: project.currency,
        status: "retained",
        createdAt: new Date().toISOString(),
        reference: `NX-FEE-${Date.now()}`,
        destination: "NexaCore company account",
      },
      ...current,
    ]);

    setPaymentMessage(
      `Delivery approved. ${formatProjectMoney(
        breakdown.talentPayout,
        project.currency,
      )} released to talent and ${formatProjectMoney(
        breakdown.companyFee,
        project.currency,
      )} retained by NexaCore.`,
    );
  };

  const projectFiles = files.filter(
    (file) => file.projectId === project.id,
  );

  return (
    <>
      <PageHero
        eyebrow={`Project ${project.id}`}
        title={project.title}
        description={`${project.service} · ${formatProjectMoney(
          project.budget,
          project.currency,
        )} · Deadline ${project.deadline}`}
        image={
          getServiceCategory(project.categoryId)?.image
        }
        action={
          <a
            href={`/client/room/${project.id}?talent=${project.selectedTalentId || ""}&mode=group`}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-red-600 px-7 text-sm font-black text-white hover:bg-white hover:text-red-600"
          >
            <Icon name="video" />
            Open project room
          </a>
        }
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                  Project brief
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Work requirements
                </h2>
              </div>
              <span
                className={`rounded-full px-4 py-2 text-xs font-black uppercase ${statusClass(
                  project.status,
                )}`}
              >
                {project.status.replaceAll("_", " ")}
              </span>
            </div>

            <p className="mt-5 text-sm leading-8 text-neutral-600">
              {project.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {!talent ? (
            <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                    Available bids
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Compare talent
                  </h2>
                </div>
                <a
                  href="/client/bids"
                  className="text-sm font-black text-red-600"
                >
                  Open bid manager
                </a>
              </div>

              <div className="mt-6 space-y-4">
                {projectBids.length === 0 ? (
                  <p className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-500">
                    No bids have been received yet.
                  </p>
                ) : (
                  projectBids.map((bid) => {
                    const bidder = getTalentProfile(
                      bid.talentId,
                    );

                    return (
                      <article
                        key={bid.id}
                        className="grid gap-4 rounded-2xl border border-neutral-200 p-5 md:grid-cols-[1fr_auto] md:items-center"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar
                            initials={bidder.initials}
                            size="h-12 w-12"
                          />
                          <div>
                            <p className="font-black">
                              {bidder.name}
                            </p>
                            <p className="mt-1 text-xs text-neutral-400">
                              ★ {bidder.rating} ·{" "}
                              {formatProjectMoney(
                                bid.amount,
                                bid.currency,
                              )}
                            </p>
                          </div>
                        </div>

                        <a
                          href={`/client/talent/${bidder.id}?project=${project.id}&bid=${bid.id}`}
                          className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-5 text-xs font-black text-white hover:bg-red-600"
                        >
                          Review bid
                        </a>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          ) : (
            <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                Selected talent
              </p>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar
                  initials={talent.initials}
                  size="h-16 w-16"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-black">
                    {talent.name}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {talent.title}
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    ★ {talent.rating} ·{" "}
                    {talent.completedProjects} completed
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/client/talent/${talent.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 px-5 text-xs font-black"
                  >
                    Profile
                  </a>
                  <a
                    href={`/client/messages?talent=${talent.id}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-xs font-black text-white"
                  >
                    <Icon name="messages" className="h-4 w-4" />
                    Message
                  </a>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Project files
            </p>

            <div className="mt-5 space-y-3">
              {projectFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col gap-4 rounded-2xl border border-neutral-200 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-950 text-white">
                    <Icon name="files" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black">
                      {file.fileName}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {file.uploadedBy} ·{" "}
                      {file.deliveryType.replaceAll("_", " ")}
                    </p>
                  </div>
                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-black uppercase ${statusClass(
                      file.status,
                    )}`}
                  >
                    {file.status.replaceAll("_", " ")}
                  </span>
                </div>
              ))}
            </div>

            {talent &&
              project.escrowStatus === "fully_funded" &&
              !projectFiles.some(
                (file) =>
                  file.deliveryType === "final",
              ) && (
                <div className="mt-5 rounded-2xl bg-neutral-50 p-5">
                  <p className="text-sm font-black">
                    Simulate talent final delivery
                  </p>
                  <p className="mt-2 text-xs text-neutral-500">
                    This control represents the talent uploading work after full funding is verified.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={deliveryName}
                      onChange={(event) =>
                        setDeliveryName(event.target.value)
                      }
                      placeholder="final-project-delivery.zip"
                      className="h-12 flex-1 rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
                    />
                    <button
                      type="button"
                      onClick={addFinalDelivery}
                      className="h-12 rounded-2xl bg-neutral-950 px-5 text-xs font-black text-white hover:bg-red-600"
                    >
                      Add delivery
                    </button>
                  </div>
                </div>
              )}

            {projectFiles.some(
              (file) =>
                file.deliveryType === "final" &&
                file.status ===
                  "awaiting_client_approval",
            ) && (
              <button
                type="button"
                onClick={approveDeliveryAndRelease}
                className="mt-5 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-green-600 text-sm font-black text-white hover:bg-neutral-950"
              >
                <Icon name="check" />
                Approve delivery and release payout
              </button>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
              Escrow funding
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.06] p-4">
                <span className="text-sm text-white/50">
                  Accepted value
                </span>
                <span className="font-black">
                  {formatProjectMoney(
                    breakdown.total,
                    project.currency,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.06] p-4">
                <span className="text-sm text-white/50">
                  25% deposit
                </span>
                <span className="font-black">
                  {formatProjectMoney(
                    breakdown.deposit,
                    project.currency,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.06] p-4">
                <span className="text-sm text-white/50">
                  75% final balance
                </span>
                <span className="font-black">
                  {formatProjectMoney(
                    breakdown.finalPayment,
                    project.currency,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-green-500/10 p-4">
                <span className="text-sm text-green-300">
                  Talent payout
                </span>
                <span className="font-black text-green-300">
                  {formatProjectMoney(
                    breakdown.talentPayout,
                    project.currency,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-red-500/10 p-4">
                <span className="text-sm text-red-300">
                  NexaCore 20%
                </span>
                <span className="font-black text-red-300">
                  {formatProjectMoney(
                    breakdown.companyFee,
                    project.currency,
                  )}
                </span>
              </div>
            </div>

            {!talent && (
              <p className="mt-5 rounded-2xl bg-amber-500/10 p-4 text-sm leading-7 text-amber-200">
                Select a talent bid before funding the project.
              </p>
            )}

            {talent &&
              project.depositPaid < breakdown.deposit && (
                <button
                  type="button"
                  onClick={() =>
                    simulateVerifiedPayment("deposit")
                  }
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black hover:bg-white hover:text-red-600"
                >
                  <Icon name="payments" />
                  Pay and validate 25% deposit
                </button>
              )}

            {project.depositPaid >= breakdown.deposit &&
              project.finalPaid <
                breakdown.finalPayment && (
                <button
                  type="button"
                  onClick={() =>
                    simulateVerifiedPayment("final")
                  }
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black hover:bg-white hover:text-red-600"
                >
                  <Icon name="payments" />
                  Pay remaining 75%
                </button>
              )}

            {paymentMessage && (
              <p className="mt-5 rounded-2xl bg-white/[0.07] p-4 text-sm leading-7 text-white/70">
                {paymentMessage}
              </p>
            )}
          </section>

          <section className="rounded-[28px] border border-red-200 bg-red-50 p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-red-600">
              Production payment validation
            </p>
            <p className="mt-3 text-sm leading-7 text-red-900/70">
              This frontend simulates a verified company-escrow webhook. Production access, dispatch and payout must only occur after the backend confirms the payment provider’s signed transaction and company-account settlement.
            </p>
          </section>
        </aside>
      </section>
    </>
  );
}

function ProjectRoomPage({
  project,
  talent,
  messages,
  setMessages,
}) {
  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] =
    useState(false);
  const [screenSharing, setScreenSharing] =
    useState(false);
  const [mediaError, setMediaError] = useState("");
  const [draft, setDraft] = useState("");

  const conversationKey = `project-${project.id}`;
  const conversation = messages[conversationKey] || [];

  useEffect(() => {
    return () => {
      mediaStreamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());

      screenStreamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  const startCamera = async () => {
    setMediaError("");

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      mediaStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setCameraOn(true);
      setMicrophoneOn(true);
    } catch {
      setMediaError(
        "Camera or microphone permission was denied.",
      );
    }
  };

  const toggleCamera = () => {
    const track =
      mediaStreamRef.current?.getVideoTracks()?.[0];

    if (!track) {
      startCamera();
      return;
    }

    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  };

  const toggleMicrophone = () => {
    const track =
      mediaStreamRef.current?.getAudioTracks()?.[0];

    if (!track) {
      startCamera();
      return;
    }

    track.enabled = !track.enabled;
    setMicrophoneOn(track.enabled);
  };

  const shareScreen = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

      screenStreamRef.current = stream;

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
      }

      setScreenSharing(true);

      stream.getVideoTracks()[0].addEventListener(
        "ended",
        () => {
          setScreenSharing(false);
          screenStreamRef.current = null;
        },
      );
    } catch {
      setMediaError(
        "Screen sharing was cancelled or unavailable.",
      );
    }
  };

  const sendMessage = (event) => {
    event.preventDefault();

    const text = draft.trim();

    if (!text) {
      return;
    }

    setMessages((current) => ({
      ...current,
      [conversationKey]: [
        ...(current[conversationKey] || []),
        {
          id: `MSG-${Date.now()}`,
          senderType: "client",
          senderName: "You",
          text,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setDraft("");
  };

  return (
    <div className="min-h-[calc(100vh-145px)] overflow-hidden rounded-[30px] bg-neutral-950 text-white">
      <div className="grid min-h-[calc(100vh-145px)] xl:grid-cols-[1fr_360px]">
        <section className="flex min-h-[680px] flex-col p-5 sm:p-7">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
                Project room
              </p>
              <h2 className="mt-2 text-2xl font-black">
                {project.title}
              </h2>
              <p className="mt-1 text-xs text-white/45">
                Client, selected talent and invited project participants
              </p>
            </div>
            <span className="w-fit rounded-full bg-red-600 px-4 py-2 text-xs font-black">
              In-app call
            </span>
          </div>

          <div className="mt-5 grid flex-1 gap-5 lg:grid-cols-2">
            <div className="relative min-h-[330px] overflow-hidden rounded-[24px] bg-black">
              {talent ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Avatar
                      initials={talent.initials}
                      size="mx-auto h-24 w-24"
                    />
                    <p className="mt-4 text-lg font-black">
                      {talent.name}
                    </p>
                    <p className="mt-1 text-xs text-white/45">
                      Talent video stream
                    </p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <Icon
                      name="user"
                      className="mx-auto h-10 w-10 text-white/30"
                    />
                    <p className="mt-4 text-sm text-white/45">
                      Select talent to enable the project call
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative min-h-[330px] overflow-hidden rounded-[24px] bg-black">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`h-full w-full object-cover ${
                  cameraOn ? "block" : "hidden"
                }`}
              />

              {!cameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/[0.05]">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                      <Icon
                        name="camera"
                        className="h-8 w-8"
                      />
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

              <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-2 text-xs font-black">
                Client
              </span>
            </div>
          </div>

          {screenSharing && (
            <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-black">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <p className="text-sm font-black">
                  Shared screen
                </p>
                <button
                  type="button"
                  onClick={() => {
                    screenStreamRef.current
                      ?.getTracks()
                      .forEach((track) => track.stop());
                    setScreenSharing(false);
                  }}
                  className="text-xs font-black text-red-400"
                >
                  Stop sharing
                </button>
              </div>
              <video
                ref={screenVideoRef}
                autoPlay
                muted
                playsInline
                className="max-h-[500px] w-full object-contain"
              />
            </div>
          )}

          {mediaError && (
            <p className="mt-4 rounded-2xl bg-red-600/15 p-4 text-sm text-red-300">
              {mediaError}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-[22px] bg-white/[0.05] p-4">
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                microphoneOn
                  ? "bg-white text-neutral-950"
                  : "bg-red-600"
              }`}
            >
              <Icon name="mic" />
            </button>
            <button
              type="button"
              onClick={toggleCamera}
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                cameraOn
                  ? "bg-white text-neutral-950"
                  : "bg-red-600"
              }`}
            >
              <Icon name="camera" />
            </button>
            <button
              type="button"
              onClick={shareScreen}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-xs font-black"
            >
              <Icon name="screen" />
              Share screen
            </button>
            <a
              href={`/client/projects/${project.id}`}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-6 text-sm font-black"
            >
              <Icon name="phone" />
              Leave room
            </a>
          </div>
        </section>

        <aside className="flex min-h-[680px] flex-col border-l border-white/10 bg-black/25">
          <div className="border-b border-white/10 p-5">
            <h3 className="font-black">
              Project-room chat
            </h3>
            <p className="mt-1 text-xs text-white/40">
              Client, talent and invited team
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {conversation.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl p-4 ${
                  message.senderType === "client"
                    ? "ml-5 bg-red-600"
                    : "mr-5 bg-white/[0.07]"
                }`}
              >
                <p className="text-xs font-black">
                  {message.senderName}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          <form
            onSubmit={sendMessage}
            className="flex gap-3 border-t border-white/10 p-4"
          >
            <input
              value={draft}
              onChange={(event) =>
                setDraft(event.target.value)
              }
              placeholder="Write a project message..."
              className="h-12 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
            />
            <button
              type="submit"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600"
            >
              <Icon name="send" />
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function MessagesPage({
  messages,
  setMessages,
}) {
  const queryTalentId = new URLSearchParams(
    window.location.search,
  ).get("talent");

  const [activeTalentId, setActiveTalentId] = useState(
    getTalentProfile(queryTalentId)
      ? queryTalentId
      : talentProfiles[0].id,
  );

  const [draft, setDraft] = useState("");
  const [attachmentName, setAttachmentName] =
    useState("");

  const talent = getTalentProfile(activeTalentId);
  const conversationKey = `talent-${activeTalentId}`;
  const conversation = messages[conversationKey] || [];

  const sendMessage = (event) => {
    event.preventDefault();

    const text = draft.trim();

    if (!text && !attachmentName) {
      return;
    }

    setMessages((current) => ({
      ...current,
      [conversationKey]: [
        ...(current[conversationKey] || []),
        {
          id: `MSG-${Date.now()}`,
          senderType: "client",
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
      <PageHero
        eyebrow="Marketplace messages"
        title="Speak with talent before and during a project."
        description="Use individual conversations for questions, proposal clarification, calls and project coordination."
        image="/images/hero/banner3.png"
      />

      <section className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
        <div className="grid min-h-[650px] lg:grid-cols-[320px_1fr]">
          <aside className="border-b border-neutral-200 bg-neutral-950 p-4 text-white lg:border-b-0 lg:border-r">
            <p className="px-2 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-500">
              Talent conversations
            </p>

            <div className="mt-2 space-y-2">
              {talentProfiles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActiveTalentId(item.id)
                  }
                  className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left ${
                    item.id === activeTalentId
                      ? "bg-red-600"
                      : "bg-white/[0.05] hover:bg-white/[0.09]"
                  }`}
                >
                  <Avatar
                    initials={item.initials}
                    size="h-11 w-11"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black">
                      {item.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-white/45">
                      {item.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <div className="flex min-h-[650px] flex-col">
            <div className="flex flex-col gap-4 border-b border-neutral-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  initials={talent.initials}
                  size="h-12 w-12"
                />
                <div>
                  <h2 className="font-black">
                    {talent.name}
                  </h2>
                  <p className="mt-1 text-xs text-neutral-400">
                    {talent.title}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`/client/talent/${talent.id}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 px-4 text-xs font-black"
                >
                  View profile
                </a>
                <a
                  href={`/client/room/consultation?talent=${talent.id}&mode=single`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-4 text-xs font-black text-white"
                >
                  <Icon name="video" className="h-4 w-4" />
                  Call
                </a>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
              {conversation.length === 0 ? (
                <div className="rounded-2xl bg-neutral-50 p-6 text-center">
                  <p className="font-black">
                    Start a conversation
                  </p>
                  <p className="mt-2 text-sm text-neutral-500">
                    Ask about experience, availability or the proposed delivery plan.
                  </p>
                </div>
              ) : (
                conversation.map((message) => (
                  <article
                    key={message.id}
                    className={`flex ${
                      message.senderType === "client"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-2xl rounded-2xl p-4 ${
                        message.senderType === "client"
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
                          Attachment:{" "}
                          {message.attachmentName}
                        </p>
                      )}
                    </div>
                  </article>
                ))
              )}
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
                    onClick={() =>
                      setAttachmentName("")
                    }
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
                        event.target.files?.[0]?.name ||
                          "",
                      )
                    }
                  />
                </label>

                <input
                  value={draft}
                  onChange={(event) =>
                    setDraft(event.target.value)
                  }
                  placeholder={`Message ${talent.name}...`}
                  className="h-12 flex-1 rounded-full border border-neutral-300 px-5 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                />

                <button
                  type="submit"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white hover:bg-neutral-950"
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

function PaymentsPage({
  projects,
  payments,
}) {
  return (
    <>
      <PageHero
        eyebrow="Payments and escrow"
        title="Track verified funding, company escrow and talent payout."
        description="Project work starts only after the 25% deposit is validated. Final work unlocks only after the remaining 75% is validated."
        image="/images/hero/banner4.png"
      />

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const acceptedBid = defaultBids.find(
            (bid) => bid.id === project.selectedBidId,
          );

          const breakdown = calculateEscrowBreakdown(
            project,
            acceptedBid,
          );

          return (
            <article
              key={project.id}
              className="rounded-[28px] border border-neutral-200 bg-white p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase ${statusClass(
                    project.escrowStatus,
                  )}`}
                >
                  {project.escrowStatus.replaceAll("_", " ")}
                </span>
                <span className="text-xs text-neutral-400">
                  {project.id}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-black">
                {project.title}
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between gap-4 rounded-2xl bg-neutral-50 p-4">
                  <span className="text-sm text-neutral-500">
                    Project total
                  </span>
                  <span className="font-black">
                    {formatProjectMoney(
                      breakdown.total,
                      project.currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between gap-4 rounded-2xl bg-neutral-50 p-4">
                  <span className="text-sm text-neutral-500">
                    Deposit paid
                  </span>
                  <span className="font-black">
                    {formatProjectMoney(
                      project.depositPaid,
                      project.currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between gap-4 rounded-2xl bg-neutral-50 p-4">
                  <span className="text-sm text-neutral-500">
                    Final paid
                  </span>
                  <span className="font-black">
                    {formatProjectMoney(
                      project.finalPaid,
                      project.currency,
                    )}
                  </span>
                </div>
              </div>

              <a
                href={`/client/projects/${project.id}`}
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-neutral-950 text-xs font-black text-white hover:bg-red-600"
              >
                Manage escrow
              </a>
            </article>
          );
        })}
      </section>

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
          Payment history
        </p>

        <div className="mt-5 space-y-3">
          {payments.map((payment) => (
            <article
              key={payment.id}
              className="grid gap-3 rounded-2xl border border-neutral-200 p-4 md:grid-cols-[1fr_auto_auto] md:items-center"
            >
              <div>
                <p className="font-black">
                  {payment.type.replaceAll("_", " ")}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {payment.projectId} ·{" "}
                  {payment.reference || "No reference"}
                </p>
              </div>
              <span className="font-black">
                {formatProjectMoney(
                  payment.amount,
                  payment.currency,
                )}
              </span>
              <span
                className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-black uppercase ${statusClass(
                  payment.status,
                )}`}
              >
                {payment.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function FilesPage({ files, projects }) {
  return (
    <>
      <PageHero
        eyebrow="Project files"
        title="Requirements, work files and final delivery in one place."
        description="File availability follows project funding and delivery status. Final work should not be released before full escrow funding is verified."
        image="/images/hero/banner2.png"
      />

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6">
        <div className="space-y-4">
          {files.map((file) => {
            const project = getProject(
              projects,
              file.projectId,
            );

            return (
              <article
                key={file.id}
                className="grid gap-4 rounded-2xl border border-neutral-200 p-5 md:grid-cols-[auto_1fr_auto] md:items-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                  <Icon name="files" />
                </div>
                <div>
                  <p className="font-black">
                    {file.fileName}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {project?.title || file.projectId} ·{" "}
                    {file.uploadedBy}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-black uppercase ${statusClass(
                    file.status,
                  )}`}
                >
                  {file.status.replaceAll("_", " ")}
                </span>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function ReviewsPage({
  projects,
  reviews,
  setReviews,
}) {
  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  );

  const [form, setForm] = useState({
    projectId: completedProjects[0]?.id || "",
    rating: 5,
    comment: "",
  });

  const submitReview = (event) => {
    event.preventDefault();

    if (!form.projectId || !form.comment.trim()) {
      return;
    }

    const project = getProject(
      projects,
      form.projectId,
    );

    setReviews((current) => [
      {
        id: `REV-${Date.now()}`,
        projectId: project.id,
        talentId: project.selectedTalentId,
        rating: Number(form.rating),
        comment: form.comment.trim(),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);

    setForm((current) => ({
      ...current,
      comment: "",
    }));
  };

  return (
    <>
      <PageHero
        eyebrow="Client reviews"
        title="Review completed work and marketplace experience."
        description="Reviews become part of the talent’s professional record after a completed and funded project."
        image="/images/hero/banner4.png"
      />

      {completedProjects.length > 0 && (
        <form
          onSubmit={submitReview}
          className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black">
                Completed project
              </label>
              <select
                value={form.projectId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    projectId: event.target.value,
                  }))
                }
                className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600"
              >
                {completedProjects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Rating
              </label>
              <select
                value={form.rating}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    rating: Number(event.target.value),
                  }))
                }
                className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} star{rating === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-black">
                Review
              </label>
              <textarea
                value={form.comment}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    comment: event.target.value,
                  }))
                }
                rows={5}
                className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
          >
            Publish review
          </button>
        </form>
      )}

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        {reviews.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-10 text-center lg:col-span-2">
            <Icon
              name="reviews"
              className="mx-auto h-10 w-10 text-red-600"
            />
            <h2 className="mt-5 text-2xl font-black">
              No project review yet
            </h2>
            <p className="mt-3 text-sm text-neutral-500">
              Complete a funded project before reviewing the talent.
            </p>
          </div>
        ) : (
          reviews.map((review) => {
            const project = getProject(
              projects,
              review.projectId,
            );

            const talent = getTalentProfile(
              review.talentId,
            );

            return (
              <article
                key={review.id}
                className="rounded-[28px] border border-neutral-200 bg-white p-6"
              >
                <p className="text-amber-500">
                  {"★".repeat(review.rating)}
                </p>
                <h2 className="mt-3 text-lg font-black">
                  {project?.title}
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Talent: {talent?.name}
                </p>
                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  {review.comment}
                </p>
              </article>
            );
          })
        )}
      </section>
    </>
  );
}

function SupportPage({
  tickets,
  setTickets,
}) {
  const [form, setForm] = useState({
    subject: "",
    category: "Project Support",
    message: "",
  });

  const submit = (event) => {
    event.preventDefault();

    if (!form.subject.trim() || !form.message.trim()) {
      return;
    }

    setTickets((current) => [
      {
        id: `SUP-${Date.now()}`,
        subject: form.subject.trim(),
        category: form.category,
        message: form.message.trim(),
        status: "open",
        response: "",
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);

    setForm({
      subject: "",
      category: "Project Support",
      message: "",
    });
  };

  return (
    <>
      <PageHero
        eyebrow="Client support"
        title="Get help with projects, payments, disputes or account access."
        description="Support requests remain connected to the client workspace and can later be handled by the NexaCore operations team."
        image="/images/hero/banner3.png"
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={submit}
          className="rounded-[28px] border border-neutral-200 bg-white p-6"
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
            Open support ticket
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-black">
                Subject
              </label>
              <input
                value={form.subject}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    subject: event.target.value,
                  }))
                }
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Category
              </label>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600"
              >
                <option>Project Support</option>
                <option>Payments and Escrow</option>
                <option>Talent and Bids</option>
                <option>Dispute</option>
                <option>Technical Support</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
                rows={7}
                className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
          >
            Submit ticket
          </button>
        </form>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <article
              key={ticket.id}
              className="rounded-[28px] border border-neutral-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-red-600">
                  {ticket.category}
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase ${statusClass(
                    ticket.status,
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-black">
                {ticket.subject}
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                {ticket.message}
              </p>
              {ticket.response && (
                <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-neutral-400">
                    NexaCore response
                  </p>
                  <p className="mt-2 text-sm leading-7 text-neutral-600">
                    {ticket.response}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function SettingsPage({
  profile,
  setProfile,
}) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setSaved(false);
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    setProfile(form);
    setSaved(true);
  };

  const initials = `${form.firstName?.[0] || "C"}${
    form.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <>
      <PageHero
        eyebrow="Client settings"
        title="Manage company and account information."
        description="Client details are used for projects, escrow records, invoices and marketplace communication."
        image="/images/hero/banner1.png"
      />

      <form
        onSubmit={submit}
        className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"
      >
        <div className="flex flex-col gap-5 rounded-2xl bg-neutral-50 p-6 sm:flex-row sm:items-center">
          <Avatar
            initials={initials}
            image={form.profilePhoto}
            size="h-24 w-24"
          />
          <div>
            <p className="font-black">Company profile</p>
            <p className="mt-2 text-sm text-neutral-500">
              Complete these details for project and payment records.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {[
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["companyName", "Company name"],
            ["companyWebsite", "Company website"],
            ["industry", "Industry"],
            ["location", "Location"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="mb-2 block text-sm font-black">
                {label}
              </label>
              <input
                name={name}
                value={form[name] || ""}
                onChange={updateField}
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
        >
          Save client profile
        </button>

        {saved && (
          <p className="mt-4 rounded-2xl bg-green-50 p-4 text-center text-sm font-bold text-green-700">
            Client profile saved.
          </p>
        )}
      </form>
    </>
  );
}

export default function ClientPortal() {
  const path = window.location.pathname;

  const [profile, setProfile] = useClientState(
    CLIENT_STORAGE_KEYS.profile,
    defaultClientProfile,
  );

  const [projects, setProjects] = useClientState(
    CLIENT_STORAGE_KEYS.projects,
    defaultProjects,
  );

  const [bids] = useClientState(
    CLIENT_STORAGE_KEYS.bids,
    defaultBids,
  );

  const [messages, setMessages] = useClientState(
    CLIENT_STORAGE_KEYS.messages,
    defaultClientMessages,
  );

  const [payments, setPayments] = useClientState(
    CLIENT_STORAGE_KEYS.payments,
    defaultPayments,
  );

  const [files, setFiles] = useClientState(
    CLIENT_STORAGE_KEYS.files,
    defaultClientFiles,
  );

  const [reviews, setReviews] = useClientState(
    CLIENT_STORAGE_KEYS.reviews,
    defaultClientReviews,
  );

  const [tickets, setTickets] = useClientState(
    CLIENT_STORAGE_KEYS.support,
    defaultSupportTickets,
  );

  if (path === "/client") {
    window.location.replace("/client/dashboard");
    return null;
  }

  let title = "Client workspace";
  let page = null;

  const projectMatch = path.match(
    /^\/client\/projects\/([^/]+)$/,
  );

  const talentMatch = path.match(
    /^\/client\/talent\/([^/]+)$/,
  );

  const roomMatch = path.match(
    /^\/client\/room\/([^/]+)$/,
  );

  if (path === "/client/dashboard") {
    title = "Dashboard overview";
    page = (
      <DashboardPage
        projects={projects}
        bids={bids}
        payments={payments}
      />
    );
  } else if (path === "/client/services") {
    title = "Browse Services";
    page = <ServicesPage />;
  } else if (path === "/client/projects/new") {
    title = "Post Project";
    page = (
      <NewProjectPage
        setProjects={setProjects}
        setFiles={setFiles}
      />
    );
  } else if (path === "/client/projects") {
    title = "Active Projects";
    page = <ProjectsPage projects={projects} />;
  } else if (path === "/client/bids") {
    title = "Bids";
    page = (
      <BidsPage projects={projects} bids={bids} />
    );
  } else if (projectMatch) {
    const project = getProject(
      projects,
      projectMatch[1],
    );

    title = project?.title || "Project";

    page = project ? (
      <ProjectDetailPage
        project={project}
        projects={projects}
        setProjects={setProjects}
        bids={bids}
        payments={payments}
        setPayments={setPayments}
        files={files}
        setFiles={setFiles}
      />
    ) : null;
  } else if (talentMatch) {
    const talent = getTalentProfile(
      talentMatch[1],
    );

    const params = new URLSearchParams(
      window.location.search,
    );

    const project = getProject(
      projects,
      params.get("project"),
    );

    const bid = bids.find(
      (item) => item.id === params.get("bid"),
    );

    title = talent?.name || "Talent profile";

    page = talent ? (
      <TalentDetailPage
        talent={talent}
        project={project}
        bid={bid}
        projects={projects}
        setProjects={setProjects}
      />
    ) : null;
  } else if (roomMatch) {
    const project =
      getProject(projects, roomMatch[1]) || {
        id: roomMatch[1],
        title: "Talent consultation",
      };

    const talent = getTalentProfile(
      new URLSearchParams(
        window.location.search,
      ).get("talent") || project.selectedTalentId,
    );

    title = "Project Room";

    page = (
      <ProjectRoomPage
        project={project}
        talent={talent}
        messages={messages}
        setMessages={setMessages}
      />
    );
  } else if (path === "/client/messages") {
    title = "Messages";
    page = (
      <MessagesPage
        messages={messages}
        setMessages={setMessages}
      />
    );
  } else if (path === "/client/payments") {
    title = "Payments and Escrow";
    page = (
      <PaymentsPage
        projects={projects}
        payments={payments}
      />
    );
  } else if (path === "/client/files") {
    title = "Files";
    page = (
      <FilesPage files={files} projects={projects} />
    );
  } else if (path === "/client/reviews") {
    title = "Reviews";
    page = (
      <ReviewsPage
        projects={projects}
        reviews={reviews}
        setReviews={setReviews}
      />
    );
  } else if (path === "/client/support") {
    title = "Support";
    page = (
      <SupportPage
        tickets={tickets}
        setTickets={setTickets}
      />
    );
  } else if (path === "/client/settings") {
    title = "Settings";
    page = (
      <SettingsPage
        profile={profile}
        setProfile={setProfile}
      />
    );
  }

  if (!page) {
    page = (
      <section className="rounded-[28px] border border-neutral-200 bg-white p-10 text-center">
        <h2 className="text-2xl font-black">
          Client page not found
        </h2>
        <a
          href="/client/dashboard"
          className="mt-5 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white"
        >
          Return to dashboard
        </a>
      </section>
    );
  }

  return (
    <ClientShell profile={profile} title={title}>
      {page}
    </ClientShell>
  );
}

export {
  beginClientAccount,
  getClientLandingPath,
};
