import { useEffect, useMemo, useRef, useState } from "react";

import {
  NEXACORE_SHARE_PERCENT,
  TALENT_SHARE_PERCENT,
  TALENT_STORAGE_KEYS,
  beginTalentAccount,
  calculateTalentProjectMoney,
  defaultAvailability,
  defaultMatchingJobs,
  defaultNotifications,
  defaultPayout,
  defaultPortfolio,
  defaultSubscription,
  defaultTalentBids,
  defaultTalentMessages,
  defaultTalentProfile,
  defaultTalentRatings,
  fallbackClientFiles,
  fallbackClientProjects,
  formatTalentMoney,
  getMatchingJob,
  getTalentBidForProject,
  getTalentEarningsSummary,
  getTalentInitials,
  getTalentLandingPath,
  loadTalentValue,
  publishTalentProfile,
  saveTalentValue,
  subscriptionPlans,
} from "./talentData";

const NAV_ITEMS = [
  ["Overview", "/talent/dashboard", "⌂"],
  ["Matching Jobs", "/talent/jobs", "⌕"],
  ["Bid Management", "/talent/bids", "▤"],
  ["Active Work", "/talent/work", "▣"],
  ["Deliverables", "/talent/deliverables", "▧"],
  ["Messages", "/talent/messages", "✉"],
  ["Portfolio", "/talent/portfolio", "▦"],
  ["Earnings", "/talent/earnings", "₦"],
  ["Ratings", "/talent/ratings", "★"],
  ["Subscription", "/talent/subscription", "◇"],
  ["Availability", "/talent/availability", "◷"],
];

export function isTalentPortalPath(pathname) {
  return (
    pathname === "/talent" ||
    pathname === "/talent/dashboard" ||
    pathname === "/talent/jobs" ||
    pathname === "/talent/bids" ||
    pathname === "/talent/work" ||
    pathname === "/talent/deliverables" ||
    pathname === "/talent/messages" ||
    pathname === "/talent/portfolio" ||
    pathname === "/talent/earnings" ||
    pathname === "/talent/ratings" ||
    pathname === "/talent/subscription" ||
    pathname === "/talent/availability" ||
    pathname === "/talent/settings" ||
    /^\/talent\/jobs\/[^/]+$/.test(pathname) ||
    /^\/talent\/work\/[^/]+$/.test(pathname) ||
    /^\/talent\/room\/[^/]+$/.test(pathname)
  );
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() =>
    loadTalentValue(key, fallback),
  );

  const update = (nextValue) => {
    setValue((current) => {
      const resolved =
        typeof nextValue === "function"
          ? nextValue(current)
          : nextValue;

      saveTalentValue(key, resolved);
      return resolved;
    });
  };

  return [value, update];
}

function Avatar({ profile, initials, size = "h-11 w-11" }) {
  const label =
    initials || (profile ? getTalentInitials(profile) : "TP");

  if (profile?.profilePhoto) {
    return (
      <img
        src={profile.profilePhoto}
        alt=""
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white`}
    >
      {label}
    </div>
  );
}

function Pill({ children, tone = "neutral" }) {
  const classes = {
    neutral: "bg-neutral-100 text-neutral-600",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${classes[tone]}`}
    >
      {children}
    </span>
  );
}

function statusTone(status) {
  if (
    [
      "active",
      "available",
      "released",
      "completed",
      "published",
      "fully_funded",
      "approved_and_released",
      "verified",
    ].includes(status)
  ) {
    return "green";
  }

  if (
    [
      "pending",
      "in_progress",
      "deposit_verified",
      "final_delivery_available",
      "awaiting_client_approval",
      "active_bid",
    ].includes(status)
  ) {
    return "amber";
  }

  return "red";
}

function Hero({ eyebrow, title, description, image, action }) {
  return (
    <section className="relative overflow-hidden rounded-[30px] bg-neutral-950">
      <img
        src={image || "/images/hero/banner1.png"}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/75" />
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

function Shell({ profile, notifications, title, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = window.location.pathname;
  const unread = notifications.filter((item) => !item.read).length;

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

          <aside className="fixed left-4 top-[104px] z-50 flex max-h-[calc(100vh-120px)] w-[calc(100%-2rem)] max-w-[365px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-neutral-950 text-white shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                  Talent marketplace
                </p>
                <h2 className="mt-1 text-lg font-black">
                  Professional workspace
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-xl hover:bg-red-600"
              >
                ×
              </button>
            </div>

            <div className="m-4 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
              <Avatar profile={profile} size="h-12 w-12" />
              <div className="min-w-0">
                <p className="truncate text-sm font-black">
                  {profile.displayName}
                </p>
                <p className="mt-1 truncate text-xs text-white/45">
                  {profile.title}
                </p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 pb-5">
              <div className="space-y-1">
                {NAV_ITEMS.map(([label, href, icon]) => {
                  const active =
                    path === href ||
                    (href !== "/talent/dashboard" &&
                      path.startsWith(`${href}/`));

                  return (
                    <a
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                        active
                          ? "bg-red-600 text-white"
                          : "text-white/55 hover:bg-white/[0.07] hover:text-white"
                      }`}
                    >
                      <span className="w-5 text-center text-base">
                        {icon}
                      </span>
                      {label}
                    </a>
                  );
                })}
              </div>

              <div className="my-5 h-px bg-white/10" />

              <a
                href="/talent/settings"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 hover:bg-white/[0.07] hover:text-white"
              >
                <span className="w-5 text-center">⚙</span>
                Settings
              </a>

              <a
                href="/login"
                className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/55 hover:bg-red-600/15 hover:text-red-400"
              >
                <span className="w-5 text-center">↪</span>
                Log out
              </a>
            </nav>
          </aside>
        </>
      )}

      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="flex h-[88px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-xl ${
                menuOpen
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-neutral-200 bg-white hover:border-red-600 hover:text-red-600"
              }`}
            >
              {menuOpen ? "×" : "☰"}
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
                Talent workspace
              </p>
              <h1 className="truncate text-base font-black sm:mt-1 sm:text-xl">
                {title}
              </h1>
            </div>
          </div>

          <div className="hidden max-w-md flex-1 lg:block">
            <input
              type="search"
              placeholder="Search jobs, clients and projects..."
              className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 px-5 text-sm outline-none focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/10"
            />
          </div>

          <a
            href="/talent/jobs"
            className="hidden h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-xs font-black text-white hover:bg-neutral-950 sm:inline-flex"
          >
            Find work
          </a>

          <a
            href="/talent/messages"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-lg"
          >
            ♢
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                {unread}
              </span>
            )}
          </a>

          <a
            href="/talent/settings"
            className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white p-1.5 pr-3"
          >
            <Avatar profile={profile} size="h-9 w-9" />
            <div className="hidden text-left xl:block">
              <p className="max-w-[150px] truncate text-xs font-black">
                {profile.displayName}
              </p>
              <p className="text-[10px] text-neutral-400">
                Talent account
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
  profile,
  jobs,
  bids,
  projects,
  portfolio,
  availability,
  ratings,
}) {
  const activeBids = bids.filter(
    (bid) => bid.talentId === profile.id && bid.status === "active",
  );

  const activeProjects = projects.filter(
    (project) =>
      project.selectedTalentId === profile.id &&
      !["completed", "cancelled"].includes(project.status),
  );

  const earnings = getTalentEarningsSummary(projects, profile.id);

  return (
    <>
      <Hero
        eyebrow="Talent dashboard"
        title="Find better-fit work, build trust and deliver from one workspace."
        description="NexaCore combines smart job matching, direct client calls, public portfolio pages, secure escrow visibility and an 80% talent revenue share."
        image="/images/hero/banner1.png"
        action={
          <a
            href="/talent/jobs"
            className="inline-flex h-14 items-center justify-center rounded-2xl bg-red-600 px-7 text-sm font-black text-white hover:bg-white hover:text-red-600"
          >
            View matching jobs
          </a>
        }
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["High-fit jobs", jobs.filter((job) => job.fitScore >= 70).length],
          ["Active proposals", activeBids.length],
          ["Active work", activeProjects.length],
          [
            "Available earnings",
            formatTalentMoney(earnings.available, profile.currency),
          ],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-[24px] border border-neutral-200 bg-white p-5"
          >
            <p className="text-3xl font-black">{value}</p>
            <p className="mt-2 text-sm font-black text-neutral-700">
              {label}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
                Smart matching
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Recommended opportunities
              </h2>
            </div>
            <a href="/talent/jobs" className="text-sm font-black text-red-600">
              See all
            </a>
          </div>

          <div className="mt-6 space-y-4">
            {jobs
              .slice()
              .sort((a, b) => b.fitScore - a.fitScore)
              .slice(0, 3)
              .map((job) => (
                <article
                  key={job.id}
                  className="grid gap-4 rounded-2xl border border-neutral-200 p-5 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Pill tone="green">{job.fitScore}% fit</Pill>
                      {job.clientVerified && (
                        <Pill tone="blue">Verified client</Pill>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-black">{job.title}</h3>
                    <p className="mt-2 text-xs text-neutral-400">
                      {job.clientName} · {formatTalentMoney(job.budget, job.currency)} · {job.proposals} proposals
                    </p>
                  </div>

                  <a
                    href={`/talent/jobs/${job.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-950 px-5 text-xs font-black text-white hover:bg-red-600"
                  >
                    View job
                  </a>
                </article>
              ))}
          </div>
        </div>

        <aside className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Public professional profile
          </p>

          <div className="mt-5 flex items-center gap-4">
            <Avatar profile={profile} size="h-16 w-16" />
            <div>
              <h2 className="text-xl font-black">{profile.displayName}</h2>
              <p className="mt-1 text-sm text-white/45">{profile.title}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-white/40">Portfolio</p>
              <p className="mt-2 text-xl font-black">
                {portfolio.filter((item) => item.visibility === "public").length}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.06] p-4">
              <p className="text-xs text-white/40">Rating</p>
              <p className="mt-2 text-xl font-black">
                {ratings.length
                  ? (
                      ratings.reduce(
                        (sum, rating) => sum + Number(rating.rating),
                        0,
                      ) / ratings.length
                    ).toFixed(1)
                  : "New"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white/[0.06] p-4">
            <p className="text-xs text-white/40">Availability</p>
            <p className="mt-2 font-black capitalize">
              {availability.status.replaceAll("_", " ")}
            </p>
            <p className="mt-1 text-xs text-white/40">
              {availability.weeklyCapacityHours} hours per week
            </p>
          </div>

          <a
            href="/talent/portfolio"
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-red-600 text-sm font-black hover:bg-white hover:text-red-600"
          >
            Improve public profile
          </a>
        </aside>
      </section>
    </>
  );
}

function JobsPage({ jobs, savedJobs, setSavedJobs, bids, profile }) {
  const [query, setQuery] = useState("");
  const [minimumFit, setMinimumFit] = useState(0);

  const visible = jobs
    .filter((job) => job.status === "open")
    .filter((job) => {
      const text = `${job.title} ${job.category} ${job.service} ${job.skills.join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase()) && job.fitScore >= minimumFit;
    })
    .sort((a, b) => b.fitScore - a.fitScore);

  const toggleSaved = (jobId) => {
    setSavedJobs((current) =>
      current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [...current, jobId],
    );
  };

  return (
    <>
      <Hero
        eyebrow="Matching jobs"
        title="See opportunities ranked by fit, not only by posting time."
        description="Matching considers skills, category, budget, experience, portfolio history and client verification."
        image="/images/hero/banner2.png"
      />

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by service, skill or client need..."
            className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
          />
          <select
            value={minimumFit}
            onChange={(event) => setMinimumFit(Number(event.target.value))}
            className="h-14 rounded-2xl border border-neutral-300 bg-white px-4 text-sm font-bold outline-none focus:border-red-600"
          >
            <option value={0}>All fit scores</option>
            <option value={50}>50% and above</option>
            <option value={70}>70% and above</option>
            <option value={90}>90% and above</option>
          </select>
        </div>
      </section>

      <section className="mt-6 space-y-5">
        {visible.map((job) => {
          const alreadyBid = Boolean(
            getTalentBidForProject(bids, job.id, profile.id),
          );
          const saved = savedJobs.includes(job.id);

          return (
            <article
              key={job.id}
              className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-7"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <div className="flex flex-wrap gap-2">
                    <Pill tone="green">{job.fitScore}% fit</Pill>
                    <Pill>{job.experienceLevel}</Pill>
                    {job.clientVerified && (
                      <Pill tone="blue">Payment verified</Pill>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-black">{job.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                    {job.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="min-w-[250px] rounded-2xl bg-neutral-950 p-5 text-white">
                  <p className="text-xs text-white/40">Project budget</p>
                  <p className="mt-2 text-2xl font-black">
                    {formatTalentMoney(job.budget, job.currency)}
                  </p>
                  <p className="mt-2 text-xs text-white/40">
                    {job.proposals} proposals · Deadline {job.deadline}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials={job.clientInitials} />
                  <div>
                    <p className="text-sm font-black">{job.clientName}</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      ★ {job.clientRating} · {formatTalentMoney(job.clientSpend, "USD")} spent
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSaved(job.id)}
                    className={`h-11 rounded-full border px-5 text-xs font-black ${
                      saved
                        ? "border-red-600 bg-red-50 text-red-600"
                        : "border-neutral-300"
                    }`}
                  >
                    {saved ? "Saved" : "Save"}
                  </button>
                  <a
                    href={`/talent/jobs/${job.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-6 text-xs font-black text-white hover:bg-neutral-950"
                  >
                    {alreadyBid ? "View proposal" : "View and propose"}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

function JobDetailPage({ job, bids, setBids, profile }) {
  const existingBid = getTalentBidForProject(bids, job.id, profile.id);
  const [form, setForm] = useState({
    amount: existingBid?.amount || Math.round(job.budget * 0.95),
    deliveryDays: existingBid?.deliveryDays || 30,
    coverLetter: existingBid?.coverLetter || "",
  });
  const [milestones, setMilestones] = useState(existingBid?.milestones || []);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneAmount, setMilestoneAmount] = useState("");
  const [message, setMessage] = useState("");

  const draftWithAi = () => {
    const matchingSkills = job.skills.filter((skill) =>
      profile.skills.some(
        (profileSkill) =>
          profileSkill.toLowerCase() === skill.toLowerCase(),
      ),
    );

    setForm((current) => ({
      ...current,
      coverLetter: `Hello ${job.clientName},\n\nI reviewed your ${job.service} project and can deliver it through a clear milestone-based process.\n\nMy relevant experience includes ${
        matchingSkills.join(", ") || profile.skills.slice(0, 4).join(", ")
      }. I will confirm requirements, deliver each stage for review, test the completed work and provide final documentation.\n\nI am available for a voice or video call inside NexaCore before work begins.\n\nRegards,\n${profile.displayName}`,
    }));
  };

  const addMilestone = () => {
    const amount = Number(milestoneAmount);
    if (!milestoneTitle.trim() || amount <= 0) {
      setMessage("Enter a milestone title and amount.");
      return;
    }

    setMilestones((current) => [
      ...current,
      {
        id: `MS-${Date.now()}`,
        title: milestoneTitle.trim(),
        amount,
        durationDays: 7,
      },
    ]);
    setMilestoneTitle("");
    setMilestoneAmount("");
    setMessage("");
  };

  const submit = (event) => {
    event.preventDefault();
    if (
      Number(form.amount) <= 0 ||
      Number(form.deliveryDays) <= 0 ||
      !form.coverLetter.trim()
    ) {
      setMessage("Complete the proposal amount, delivery period and cover letter.");
      return;
    }

    const proposal = {
      id: existingBid?.id || `BID-${Date.now()}`,
      projectId: job.id,
      talentId: profile.id,
      amount: Number(form.amount),
      currency: job.currency,
      deliveryDays: Number(form.deliveryDays),
      coverLetter: form.coverLetter.trim(),
      milestones,
      status: "active",
      createdAt: existingBid?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBids((current) => {
      const exists = current.some((bid) => bid.id === proposal.id);
      return exists
        ? current.map((bid) => (bid.id === proposal.id ? proposal : bid))
        : [proposal, ...current];
    });

    setMessage(existingBid ? "Proposal updated." : "Proposal submitted to the client.");
  };

  return (
    <>
      <Hero
        eyebrow={`${job.fitScore}% smart match`}
        title={job.title}
        description={`${job.clientName} · ${job.category} · ${formatTalentMoney(job.budget, job.currency)} · ${job.proposals} proposals`}
        image="/images/hero/banner2.png"
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <Pill tone="green">{job.fitScore}% fit</Pill>
              {job.clientVerified && <Pill tone="blue">Verified client</Pill>}
            </div>
            <h2 className="mt-5 text-2xl font-black">Project description</h2>
            <p className="mt-4 text-sm leading-8 text-neutral-600">
              {job.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Why this job matches
            </p>
            <div className="mt-5 space-y-3">
              {job.matchReasons.map((reason) => (
                <div
                  key={reason}
                  className="rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-800"
                >
                  ✓ {reason}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
            <div className="flex items-center gap-4">
              <Avatar initials={job.clientInitials} size="h-14 w-14" />
              <div>
                <h2 className="text-xl font-black">{job.clientName}</h2>
                <p className="mt-1 text-sm text-white/45">{job.clientLocation}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/[0.06] p-4">
                <p className="text-xs text-white/40">Rating</p>
                <p className="mt-2 text-xl font-black">★ {job.clientRating}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.06] p-4">
                <p className="text-xs text-white/40">Spend</p>
                <p className="mt-2 text-xl font-black">
                  {formatTalentMoney(job.clientSpend, "USD")}
                </p>
              </div>
            </div>
          </section>
        </div>

        <form
          onSubmit={submit}
          className="h-fit rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8 xl:sticky xl:top-[112px]"
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
            {existingBid ? "Edit proposal" : "Send proposal"}
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black">Proposal amount</label>
              <input
                type="number"
                min="1"
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, amount: event.target.value }))
                }
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-black">Delivery days</label>
              <input
                type="number"
                min="1"
                value={form.deliveryDays}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    deliveryDays: event.target.value,
                  }))
                }
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-black">Cover letter</label>
              <button
                type="button"
                onClick={draftWithAi}
                className="text-xs font-black text-red-600"
              >
                ✦ Draft with AI
              </button>
            </div>
            <textarea
              value={form.coverLetter}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  coverLetter: event.target.value,
                }))
              }
              rows={12}
              className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
            />
          </div>

          <div className="mt-5 rounded-2xl bg-neutral-50 p-5">
            <p className="text-sm font-black">Proposal milestones</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px_auto]">
              <input
                value={milestoneTitle}
                onChange={(event) => setMilestoneTitle(event.target.value)}
                placeholder="Milestone title"
                className="h-12 rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
              <input
                type="number"
                min="1"
                value={milestoneAmount}
                onChange={(event) => setMilestoneAmount(event.target.value)}
                placeholder="Amount"
                className="h-12 rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
              <button
                type="button"
                onClick={addMilestone}
                className="h-12 rounded-2xl bg-neutral-950 px-4 text-xs font-black text-white hover:bg-red-600"
              >
                Add
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id || milestone.title}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 text-sm"
                >
                  <span className="font-bold">{milestone.title}</span>
                  <span className="font-black text-red-600">
                    {formatTalentMoney(milestone.amount, job.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm leading-7 text-red-900/70">
            Work starts after the client’s 25% deposit is verified. Your total project share is {TALENT_SHARE_PERCENT}% after validated completion.
          </div>

          {message && (
            <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
          >
            {existingBid ? "Update proposal" : "Submit proposal"}
          </button>
        </form>
      </section>
    </>
  );
}

function BidsPage({ bids, jobs, profile }) {
  const talentBids = bids.filter((bid) => bid.talentId === profile.id);

  return (
    <>
      <Hero
        eyebrow="Bid management"
        title="Manage proposals, prices, milestones and client responses."
        description="Every proposal remains connected to the matching job, client conversation and project status."
        image="/images/hero/banner3.png"
      />

      <section className="mt-6 space-y-5">
        {talentBids.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-black">No proposal submitted</h2>
            <a
              href="/talent/jobs"
              className="mt-5 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white"
            >
              Find matching jobs
            </a>
          </div>
        ) : (
          talentBids.map((bid) => {
            const job = getMatchingJob(jobs, bid.projectId) || {
              id: bid.projectId,
              title: "Client project",
              clientName: "Client",
              fitScore: 0,
            };

            return (
              <article
                key={bid.id}
                className="rounded-[28px] border border-neutral-200 bg-white p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Pill tone={statusTone(bid.status)}>{bid.status}</Pill>
                      {job.fitScore > 0 && (
                        <Pill tone="green">{job.fitScore}% fit</Pill>
                      )}
                    </div>
                    <h2 className="mt-4 text-2xl font-black">{job.title}</h2>
                    <p className="mt-2 text-sm text-neutral-500">{job.clientName}</p>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600">
                      {bid.coverLetter}
                    </p>
                  </div>

                  <div className="min-w-[240px] rounded-2xl bg-neutral-950 p-5 text-white">
                    <p className="text-xs text-white/40">Your proposal</p>
                    <p className="mt-2 text-2xl font-black">
                      {formatTalentMoney(bid.amount, bid.currency)}
                    </p>
                    <p className="mt-2 text-xs text-white/40">
                      {bid.deliveryDays} days · {bid.milestones.length} milestones
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 border-t border-neutral-200 pt-5">
                  <a
                    href={`/talent/jobs/${bid.projectId}`}
                    className="h-11 rounded-full bg-neutral-950 px-5 py-3 text-xs font-black text-white hover:bg-red-600"
                  >
                    Edit proposal
                  </a>
                  <a
                    href="/talent/messages"
                    className="h-11 rounded-full border border-neutral-300 px-5 py-3 text-xs font-black hover:border-red-600 hover:text-red-600"
                  >
                    Message client
                  </a>
                </div>
              </article>
            );
          })
        )}
      </section>
    </>
  );
}

function WorkPage({ projects, profile, files }) {
  const active = projects.filter(
    (project) =>
      project.selectedTalentId === profile.id &&
      !["completed", "cancelled"].includes(project.status),
  );

  return (
    <>
      <Hero
        eyebrow="Active work"
        title="Track funding, communication and delivery conditions."
        description="The project activates after the 25% deposit is verified. Final files remain protected until the remaining balance is verified."
        image="/images/hero/banner4.png"
      />

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {active.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white p-10 text-center lg:col-span-2 xl:col-span-3">
            <h2 className="text-2xl font-black">No active project yet</h2>
            <p className="mt-3 text-sm text-neutral-500">
              Accepted proposals appear after client escrow validation.
            </p>
          </div>
        ) : (
          active.map((project) => {
            const amounts = calculateTalentProjectMoney(project);
            const projectFiles = files.filter((file) => file.projectId === project.id);

            return (
              <article
                key={project.id}
                className="rounded-[28px] border border-neutral-200 bg-white p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <Pill tone={statusTone(project.status)}>
                    {project.status.replaceAll("_", " ")}
                  </Pill>
                  <span className="text-xs text-neutral-400">{project.id}</span>
                </div>

                <h2 className="mt-5 text-xl font-black">{project.title}</h2>
                <p className="mt-2 text-sm text-neutral-500">{project.service}</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-neutral-50 p-4">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                      Secured share
                    </p>
                    <p className="mt-2 font-black">
                      {formatTalentMoney(amounts.securedTalentShare, project.currency)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-neutral-50 p-4">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                      Files
                    </p>
                    <p className="mt-2 font-black">{projectFiles.length}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-neutral-200 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-neutral-400">
                    Escrow
                  </p>
                  <p className="mt-2 font-black capitalize">
                    {project.escrowStatus.replaceAll("_", " ")}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-neutral-500">
                    {project.escrowStatus === "fully_funded"
                      ? "Final deliverables can now be submitted."
                      : "Final delivery remains locked until full funding is verified."}
                  </p>
                </div>

                <a
                  href={`/talent/work/${project.id}`}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-neutral-950 text-xs font-black text-white hover:bg-red-600"
                >
                  Open workspace
                </a>
              </article>
            );
          })
        )}
      </section>
    </>
  );
}

function WorkDetailPage({
  project,
  profile,
  files,
  setFiles,
  messages,
  setMessages,
}) {
  const amounts = calculateTalentProjectMoney(project);
  const projectFiles = files.filter((file) => file.projectId === project.id);
  const [fileName, setFileName] = useState("");
  const [deliveryType, setDeliveryType] = useState("progress");
  const [notice, setNotice] = useState("");
  const conversationKey = `project-${project.id}`;
  const [draft, setDraft] = useState("");

  const upload = () => {
    const name = fileName.trim();
    if (!name) {
      setNotice("Enter a deliverable filename.");
      return;
    }

    if (deliveryType === "final" && project.escrowStatus !== "fully_funded") {
      setNotice(
        "Final work is locked until the client’s remaining 75% is verified.",
      );
      return;
    }

    setFiles((current) => [
      {
        id: `FILE-${Date.now()}`,
        projectId: project.id,
        uploadedBy: "talent",
        fileName: name,
        fileType: name.split(".").pop()?.toUpperCase() || "FILE",
        visibility: "project",
        deliveryType,
        status:
          deliveryType === "final"
            ? "awaiting_client_approval"
            : "available",
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);

    setFileName("");
    setNotice(
      deliveryType === "final"
        ? "Final delivery submitted for client approval."
        : "Progress file shared.",
    );
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setMessages((current) => ({
      ...current,
      [conversationKey]: [
        ...(current[conversationKey] || []),
        {
          id: `MSG-${Date.now()}`,
          senderType: "talent",
          senderName: profile.displayName,
          text,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    setDraft("");
  };

  return (
    <>
      <Hero
        eyebrow={`Project ${project.id}`}
        title={project.title}
        description={`${project.service} · ${formatTalentMoney(project.budget, project.currency)} · ${TALENT_SHARE_PERCENT}% talent share`}
        image="/images/hero/banner1.png"
        action={
          <a
            href={`/talent/room/${project.id}`}
            className="inline-flex h-14 items-center justify-center rounded-2xl bg-red-600 px-7 text-sm font-black text-white hover:bg-white hover:text-red-600"
          >
            Open call room
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
                <h2 className="mt-2 text-2xl font-black">Delivery workspace</h2>
              </div>
              <Pill tone={statusTone(project.status)}>
                {project.status.replaceAll("_", " ")}
              </Pill>
            </div>
            <p className="mt-5 text-sm leading-8 text-neutral-600">
              {project.description}
            </p>
          </section>

          <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Deliverables
            </p>

            <div className="mt-5 space-y-3">
              {projectFiles.map((file) => (
                <article
                  key={file.id}
                  className="grid gap-4 rounded-2xl border border-neutral-200 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <p className="font-black">{file.fileName}</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {file.uploadedBy} · {file.deliveryType.replaceAll("_", " ")}
                    </p>
                  </div>
                  <Pill tone={statusTone(file.status)}>
                    {file.status.replaceAll("_", " ")}
                  </Pill>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
              <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
                <input
                  value={fileName}
                  onChange={(event) => setFileName(event.target.value)}
                  placeholder="deliverable-file.zip"
                  className="h-12 rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
                />
                <select
                  value={deliveryType}
                  onChange={(event) => setDeliveryType(event.target.value)}
                  className="h-12 rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600"
                >
                  <option value="progress">Progress file</option>
                  <option value="final">Final delivery</option>
                </select>
                <button
                  type="button"
                  onClick={upload}
                  className="h-12 rounded-2xl bg-red-600 px-5 text-xs font-black text-white hover:bg-neutral-950"
                >
                  Share file
                </button>
              </div>
            </div>

            {notice && (
              <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
                {notice}
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
              Escrow and earnings
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between gap-4 rounded-2xl bg-white/[0.06] p-4">
                <span className="text-sm text-white/50">Verified client funds</span>
                <span className="font-black">
                  {formatTalentMoney(amounts.verifiedClientFunds, project.currency)}
                </span>
              </div>
              <div className="flex justify-between gap-4 rounded-2xl bg-green-500/10 p-4">
                <span className="text-sm text-green-300">Your secured 80%</span>
                <span className="font-black text-green-300">
                  {formatTalentMoney(amounts.securedTalentShare, project.currency)}
                </span>
              </div>
              <div className="flex justify-between gap-4 rounded-2xl bg-red-500/10 p-4">
                <span className="text-sm text-red-300">NexaCore 20%</span>
                <span className="font-black text-red-300">
                  {formatTalentMoney(amounts.nexacoreShare, project.currency)}
                </span>
              </div>
            </div>
            <p className="mt-5 rounded-2xl bg-white/[0.06] p-4 text-sm leading-7 text-white/60">
              Your 80% becomes withdrawable after full funding and approved final delivery.
            </p>
          </section>

          <section className="rounded-[28px] border border-neutral-200 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
              Project messages
            </p>
            <div className="mt-4 max-h-[340px] space-y-3 overflow-y-auto">
              {(messages[conversationKey] || []).map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl p-4 ${
                    item.senderType === "talent"
                      ? "ml-5 bg-red-600 text-white"
                      : "mr-5 bg-neutral-100"
                  }`}
                >
                  <p className="text-xs font-black">{item.senderName}</p>
                  <p className="mt-2 text-sm leading-6">{item.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="mt-4 flex gap-3">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write a project update..."
                className="h-12 flex-1 rounded-full border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
              <button
                type="submit"
                className="h-12 rounded-full bg-red-600 px-5 text-xs font-black text-white"
              >
                Send
              </button>
            </form>
          </section>
        </aside>
      </section>
    </>
  );
}

function DeliverablesPage({ projects, files, profile }) {
  const projectIds = new Set(
    projects
      .filter((project) => project.selectedTalentId === profile.id)
      .map((project) => project.id),
  );

  const talentFiles = files.filter(
    (file) => file.uploadedBy === "talent" && projectIds.has(file.projectId),
  );

  return (
    <>
      <Hero
        eyebrow="Deliverables"
        title="Track progress files and protected final delivery."
        description="Progress work can be shared during the project. Final deliverables remain locked until the full client payment is verified."
        image="/images/hero/banner3.png"
      />

      <section className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6">
        {talentFiles.length === 0 ? (
          <div className="py-12 text-center">
            <h2 className="text-2xl font-black">No deliverable shared</h2>
            <p className="mt-3 text-sm text-neutral-500">
              Open an active project to share progress or final files.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {talentFiles.map((file) => {
              const project = projects.find((item) => item.id === file.projectId);
              return (
                <article
                  key={file.id}
                  className="grid gap-4 rounded-2xl border border-neutral-200 p-5 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div>
                    <p className="font-black">{file.fileName}</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {project?.title || file.projectId} · {file.deliveryType}
                    </p>
                  </div>
                  <Pill tone={statusTone(file.status)}>
                    {file.status.replaceAll("_", " ")}
                  </Pill>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

function MessagesPage({ profile, messages, setMessages, projects }) {
  const clientConversationKey = `talent-${profile.id}`;
  const activeProject =
    projects.find((project) => project.selectedTalentId === profile.id) || null;
  const projectConversationKey = activeProject
    ? `project-${activeProject.id}`
    : "";

  const [activeConversation, setActiveConversation] = useState(
    clientConversationKey,
  );
  const [draft, setDraft] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const conversation = messages[activeConversation] || [];

  const sendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text && !attachmentName) return;

    setMessages((current) => ({
      ...current,
      [activeConversation]: [
        ...(current[activeConversation] || []),
        {
          id: `MSG-${Date.now()}`,
          senderType: "talent",
          senderName: profile.displayName,
          text: text || `Shared an attachment: ${attachmentName}`,
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
      <Hero
        eyebrow="Client communication"
        title="Write messages and receive voice or video calls."
        description="Direct communication stays connected to the proposal or active project so agreements and updates remain visible."
        image="/images/hero/banner4.png"
      />

      <section className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
        <div className="grid min-h-[650px] lg:grid-cols-[310px_1fr]">
          <aside className="border-b border-neutral-200 bg-neutral-950 p-4 text-white lg:border-b-0 lg:border-r">
            <p className="px-2 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-500">
              Conversations
            </p>

            <button
              type="button"
              onClick={() => setActiveConversation(clientConversationKey)}
              className={`mt-2 flex w-full items-center gap-3 rounded-2xl p-4 text-left ${
                activeConversation === clientConversationKey
                  ? "bg-red-600"
                  : "bg-white/[0.05]"
              }`}
            >
              <Avatar initials="CL" />
              <div>
                <p className="text-sm font-black">Client conversation</p>
                <p className="mt-1 text-xs text-white/45">Proposal and enquiries</p>
              </div>
            </button>

            {activeProject && (
              <button
                type="button"
                onClick={() => setActiveConversation(projectConversationKey)}
                className={`mt-2 flex w-full items-center gap-3 rounded-2xl p-4 text-left ${
                  activeConversation === projectConversationKey
                    ? "bg-red-600"
                    : "bg-white/[0.05]"
                }`}
              >
                <Avatar initials="PR" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{activeProject.title}</p>
                  <p className="mt-1 text-xs text-white/45">Project room</p>
                </div>
              </button>
            )}
          </aside>

          <div className="flex min-h-[650px] flex-col">
            <div className="flex flex-col gap-4 border-b border-neutral-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-black">
                  {activeConversation === clientConversationKey
                    ? "Client conversation"
                    : activeProject?.title}
                </h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Messages and call invitations
                </p>
              </div>

              <div className="flex gap-2">
                <a
                  href={`/talent/room/${activeProject?.id || "consultation"}?mode=voice`}
                  className="h-11 rounded-full border border-neutral-300 px-4 py-3 text-xs font-black hover:border-red-600 hover:text-red-600"
                >
                  Voice call
                </a>
                <a
                  href={`/talent/room/${activeProject?.id || "consultation"}?mode=video`}
                  className="h-11 rounded-full bg-red-600 px-4 py-3 text-xs font-black text-white"
                >
                  Video call
                </a>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
              {conversation.length === 0 ? (
                <div className="rounded-2xl bg-neutral-50 p-6 text-center">
                  <p className="font-black">Start the conversation</p>
                  <p className="mt-2 text-sm text-neutral-500">
                    Write a professional introduction or project update.
                  </p>
                </div>
              ) : (
                conversation.map((message) => (
                  <article
                    key={message.id}
                    className={`flex ${
                      message.senderType === "talent"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-2xl rounded-2xl p-4 ${
                        message.senderType === "talent"
                          ? "bg-red-600 text-white"
                          : "bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      <p className="text-xs font-black">{message.senderName}</p>
                      <p className="mt-2 text-sm leading-7">{message.text}</p>
                      {message.attachmentName && (
                        <p className="mt-3 rounded-xl bg-black/10 p-3 text-xs font-bold">
                          Attachment: {message.attachmentName}
                        </p>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>

            <form onSubmit={sendMessage} className="border-t border-neutral-200 p-4">
              {attachmentName && (
                <div className="mb-3 rounded-2xl bg-neutral-100 p-3 text-xs font-bold">
                  {attachmentName}
                </div>
              )}
              <div className="flex gap-3">
                <label className="flex h-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-300 px-4 text-xs font-black hover:border-red-600 hover:text-red-600">
                  Attach
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) =>
                      setAttachmentName(event.target.files?.[0]?.name || "")
                    }
                  />
                </label>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Construct your message..."
                  className="h-12 flex-1 rounded-full border border-neutral-300 px-5 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                />
                <button
                  type="submit"
                  className="h-12 rounded-full bg-red-600 px-5 text-xs font-black text-white hover:bg-neutral-950"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function CallRoomPage({ project, profile, messages, setMessages }) {
  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const params = new URLSearchParams(window.location.search);
  const [mode, setMode] = useState(params.get("mode") === "voice" ? "voice" : "video");
  const [cameraOn, setCameraOn] = useState(false);
  const [microphoneOn, setMicrophoneOn] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const conversationKey = project ? `project-${project.id}` : `talent-${profile.id}`;
  const conversation = messages[conversationKey] || [];

  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startMedia = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera and microphone require localhost or HTTPS.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: mode === "video",
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setCameraOn(mode === "video");
      setMicrophoneOn(true);
      setError("");
    } catch {
      setError("Camera or microphone permission was denied.");
    }
  };

  const toggleCamera = async () => {
    const track = mediaStreamRef.current?.getVideoTracks()?.[0];
    if (!track) {
      setMode("video");
      await startMedia();
      return;
    }
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  };

  const toggleMicrophone = async () => {
    const track = mediaStreamRef.current?.getAudioTracks()?.[0];
    if (!track) {
      await startMedia();
      return;
    }
    track.enabled = !track.enabled;
    setMicrophoneOn(track.enabled);
  };

  const shareScreen = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setError("Screen sharing requires a supported browser on HTTPS or localhost.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      screenStreamRef.current = stream;
      if (screenVideoRef.current) screenVideoRef.current.srcObject = stream;
      setScreenSharing(true);
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setScreenSharing(false);
        screenStreamRef.current = null;
      });
    } catch {
      setError("Screen sharing was cancelled or unavailable.");
    }
  };

  const send = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => ({
      ...current,
      [conversationKey]: [
        ...(current[conversationKey] || []),
        {
          id: `MSG-${Date.now()}`,
          senderType: "talent",
          senderName: profile.displayName,
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
                Talent call room
              </p>
              <h2 className="mt-2 text-2xl font-black">
                {project?.title || "Client consultation"}
              </h2>
            </div>
            <span className="w-fit rounded-full bg-red-600 px-4 py-2 text-xs font-black capitalize">
              {mode} call
            </span>
          </div>

          <div className="mt-5 grid flex-1 gap-5 lg:grid-cols-2">
            <div className="relative min-h-[330px] overflow-hidden rounded-[24px] bg-black">
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <Avatar initials="CL" size="mx-auto h-24 w-24" />
                  <p className="mt-4 text-lg font-black">Client participant</p>
                  <p className="mt-1 text-xs text-white/45">Remote stream placeholder</p>
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
                  cameraOn && mode === "video" ? "block" : "hidden"
                }`}
              />
              {(!cameraOn || mode === "voice") && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/[0.05] text-center">
                  <div>
                    <Avatar profile={profile} size="mx-auto h-24 w-24" />
                    <p className="mt-4 font-black">
                      {mode === "voice" ? "Voice call mode" : "Your camera is off"}
                    </p>
                    <button
                      type="button"
                      onClick={startMedia}
                      className="mt-4 rounded-full bg-red-600 px-5 py-3 text-xs font-black"
                    >
                      Enable media
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {screenSharing && (
            <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-black">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <p className="text-sm font-black">Shared screen</p>
                <button
                  type="button"
                  onClick={() => {
                    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
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

          {error && (
            <p className="mt-4 rounded-2xl bg-red-600/15 p-4 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-[22px] bg-white/[0.05] p-4">
            <button
              type="button"
              onClick={toggleMicrophone}
              className={`h-12 rounded-full px-5 text-xs font-black ${
                microphoneOn ? "bg-white text-neutral-950" : "bg-red-600"
              }`}
            >
              Microphone
            </button>
            <button
              type="button"
              onClick={toggleCamera}
              className={`h-12 rounded-full px-5 text-xs font-black ${
                cameraOn ? "bg-white text-neutral-950" : "bg-red-600"
              }`}
            >
              Camera
            </button>
            <button
              type="button"
              onClick={shareScreen}
              className="h-12 rounded-full bg-white/10 px-5 text-xs font-black"
            >
              Share screen
            </button>
            <button
              type="button"
              onClick={() => setMode((current) => (current === "video" ? "voice" : "video"))}
              className="h-12 rounded-full bg-white/10 px-5 text-xs font-black"
            >
              Switch to {mode === "video" ? "voice" : "video"}
            </button>
            <a
              href={project ? `/talent/work/${project.id}` : "/talent/messages"}
              className="h-12 rounded-full bg-red-600 px-6 py-4 text-xs font-black"
            >
              Leave
            </a>
          </div>
        </section>

        <aside className="flex min-h-[680px] flex-col border-l border-white/10 bg-black/25">
          <div className="border-b border-white/10 p-5">
            <h3 className="font-black">Call chat</h3>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {conversation.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl p-4 ${
                  message.senderType === "talent"
                    ? "ml-5 bg-red-600"
                    : "mr-5 bg-white/[0.07]"
                }`}
              >
                <p className="text-xs font-black">{message.senderName}</p>
                <p className="mt-2 text-sm leading-6 text-white/75">{message.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-3 border-t border-white/10 p-4">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write during the call..."
              className="h-12 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
            />
            <button
              type="submit"
              className="h-12 rounded-full bg-red-600 px-5 text-xs font-black"
            >
              Send
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function PortfolioPage({
  profile,
  setProfile,
  portfolio,
  setPortfolio,
  availability,
  ratings,
}) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    image: "/images/hero/banner1.png",
    liveUrl: "",
    repositoryUrl: "",
    skills: "",
    featured: false,
  });
  const [message, setMessage] = useState("");

  const add = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.category.trim() || !form.description.trim()) {
      setMessage("Enter the title, category and description.");
      return;
    }

    setPortfolio((current) => [
      {
        id: `PORT-${Date.now()}`,
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        image: form.image,
        liveUrl: form.liveUrl.trim(),
        repositoryUrl: form.repositoryUrl.trim(),
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        featured: Boolean(form.featured),
        visibility: "public",
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);

    setForm({
      title: "",
      category: "",
      description: "",
      image: "/images/hero/banner1.png",
      liveUrl: "",
      repositoryUrl: "",
      skills: "",
      featured: false,
    });
    setMessage("Portfolio project added.");
  };

  const publish = () => {
    const publicProfile = publishTalentProfile(
      { ...profile, profilePublished: true },
      portfolio,
      availability,
      ratings,
    );

    setProfile((current) => ({
      ...current,
      profilePublished: true,
      rating: publicProfile.rating,
    }));

    setMessage("Your public portfolio is now available to clients.");
  };

  return (
    <>
      <Hero
        eyebrow="Portfolio builder"
        title="Create proof of work clients can inspect before hiring."
        description="Show completed work, explain your contribution, list skills and publish the profile directly into the client marketplace."
        image="/images/hero/banner2.png"
        action={
          <button
            type="button"
            onClick={publish}
            className="h-14 rounded-2xl bg-red-600 px-7 text-sm font-black text-white hover:bg-white hover:text-red-600"
          >
            Publish profile
          </button>
        }
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form
          onSubmit={add}
          className="h-fit rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8 xl:sticky xl:top-[112px]"
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
            Add portfolio work
          </p>

          <div className="mt-5 space-y-4">
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Project title"
              className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
            />
            <input
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              placeholder="Project type: Web App, UI/UX, AI Video..."
              className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={6}
              placeholder="Describe the project, problem, your role and result."
              className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600"
            />
            <select
              value={form.image}
              onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
              className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600"
            >
              <option value="/images/hero/banner1.png">Banner 1</option>
              <option value="/images/hero/banner2.png">Banner 2</option>
              <option value="/images/hero/banner3.png">Banner 3</option>
              <option value="/images/hero/banner4.png">Banner 4</option>
            </select>
            <input
              value={form.liveUrl}
              onChange={(event) => setForm((current) => ({ ...current, liveUrl: event.target.value }))}
              placeholder="Live link"
              className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
            />
            <input
              value={form.repositoryUrl}
              onChange={(event) => setForm((current) => ({ ...current, repositoryUrl: event.target.value }))}
              placeholder="Repository link"
              className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
            />
            <input
              value={form.skills}
              onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))}
              placeholder="Skills used, separated by commas"
              className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
            />
            <label className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                className="h-4 w-4 accent-red-600"
              />
              <span className="text-sm font-bold">Feature this project</span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 h-14 w-full rounded-2xl bg-neutral-950 text-sm font-black text-white hover:bg-red-600"
          >
            Add portfolio project
          </button>

          {message && (
            <p className="mt-4 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
              {message}
            </p>
          )}
        </form>

        <div className="space-y-5">
          {portfolio.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white"
            >
              <div className="relative h-[260px]">
                <img src={item.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {item.featured && (
                  <span className="absolute left-5 top-5 rounded-full bg-red-600 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                    Featured
                  </span>
                )}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-red-300">
                    {item.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-black">{item.title}</h2>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm leading-7 text-neutral-600">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="h-11 rounded-full bg-neutral-950 px-5 py-3 text-xs font-black text-white"
                    >
                      Live project
                    </a>
                  )}
                  {item.repositoryUrl && (
                    <a
                      href={item.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="h-11 rounded-full border border-neutral-300 px-5 py-3 text-xs font-black"
                    >
                      Repository
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setPortfolio((current) => current.filter((entry) => entry.id !== item.id))
                    }
                    className="h-11 rounded-full border border-red-200 px-5 text-xs font-black text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function EarningsPage({ projects, profile, payout, setPayout }) {
  const summary = getTalentEarningsSummary(projects, profile.id);
  const talentProjects = projects.filter((project) => project.selectedTalentId === profile.id);
  const [form, setForm] = useState(payout);
  const [message, setMessage] = useState("");

  const saveAccount = (event) => {
    event.preventDefault();
    if (!form.bankName.trim() || !form.accountName.trim() || !form.accountNumber.trim()) {
      setMessage("Complete the payout account details.");
      return;
    }
    setPayout({ ...form, verified: true });
    setMessage("Payout account saved for backend verification.");
  };

  const requestPayout = () => {
    if (!payout.verified) {
      setMessage("Verify your payout account before requesting withdrawal.");
      return;
    }
    if (summary.available <= 0) {
      setMessage("There is no released balance available for withdrawal.");
      return;
    }

    setPayout((current) => ({
      ...current,
      payoutRequests: [
        {
          id: `WITHDRAW-${Date.now()}`,
          amount: summary.available,
          currency: profile.currency,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        ...(current.payoutRequests || []),
      ],
    }));
    setMessage("Withdrawal request created for backend verification.");
  };

  return (
    <>
      <Hero
        eyebrow="Talent earnings"
        title="See escrow, pending approval and withdrawable income."
        description={`For completed projects, ${TALENT_SHARE_PERCENT}% belongs to talent and ${NEXACORE_SHARE_PERCENT}% is retained by NexaCore. Funds become withdrawable only after full funding and release.`}
        image="/images/hero/banner1.png"
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Available", summary.available],
          ["Pending approval", summary.pendingApproval],
          ["Secured in escrow", summary.securedInEscrow],
          ["Recorded lifetime", summary.lifetime],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-[24px] border border-neutral-200 bg-white p-5"
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
              {label}
            </p>
            <p className="mt-4 text-3xl font-black">
              {formatTalentMoney(value, profile.currency)}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
            Project earnings
          </p>
          <div className="mt-5 space-y-4">
            {talentProjects.length === 0 ? (
              <p className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-500">
                No selected project earnings yet.
              </p>
            ) : (
              talentProjects.map((project) => {
                const amounts = calculateTalentProjectMoney(project);
                return (
                  <article
                    key={project.id}
                    className="rounded-2xl border border-neutral-200 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-black">{project.title}</p>
                        <p className="mt-1 text-xs text-neutral-400">
                          {project.id} · {project.payoutStatus.replaceAll("_", " ")}
                        </p>
                      </div>
                      <span className="text-xl font-black text-green-700">
                        {formatTalentMoney(amounts.totalTalentShare, project.currency)}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-green-50 p-3">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-green-700">
                          Talent 80%
                        </p>
                        <p className="mt-1 font-black text-green-800">
                          {formatTalentMoney(amounts.totalTalentShare, project.currency)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-red-50 p-3">
                        <p className="text-[10px] uppercase tracking-[0.12em] text-red-600">
                          NexaCore 20%
                        </p>
                        <p className="mt-1 font-black text-red-700">
                          {formatTalentMoney(amounts.nexacoreShare, project.currency)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        <form
          onSubmit={saveAccount}
          className="h-fit rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8"
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Payout account
          </p>
          <div className="mt-5 space-y-4">
            {[
              ["bankName", "Bank or provider"],
              ["accountName", "Account name"],
              ["accountNumber", "Account number"],
              ["routingCode", "Routing or bank code"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="mb-2 block text-xs font-black text-white/60">
                  {label}
                </label>
                <input
                  value={form[name] || ""}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [name]: event.target.value }))
                  }
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none focus:border-red-600"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-5 h-12 w-full rounded-2xl bg-white text-xs font-black text-neutral-950 hover:bg-red-600 hover:text-white"
          >
            Save payout account
          </button>
          <button
            type="button"
            onClick={requestPayout}
            className="mt-3 h-12 w-full rounded-2xl bg-red-600 text-xs font-black text-white hover:bg-white hover:text-red-600"
          >
            Withdraw available balance
          </button>
          {message && (
            <p className="mt-4 rounded-2xl bg-white/[0.07] p-4 text-sm leading-7 text-white/65">
              {message}
            </p>
          )}
          <p className="mt-5 text-xs leading-6 text-white/35">
            Production payouts require verified identity, bank details, backend ledger checks and provider confirmation.
          </p>
        </form>
      </section>
    </>
  );
}

function RatingsPage({ ratings }) {
  const average = ratings.length
    ? (
        ratings.reduce((sum, rating) => sum + Number(rating.rating || 0), 0) /
        ratings.length
      ).toFixed(1)
    : "New";

  return (
    <>
      <Hero
        eyebrow="Ratings and reputation"
        title="Build a trusted record from completed client work."
        description="Ratings cover quality, communication and timeliness and are published with the talent profile."
        image="/images/hero/banner2.png"
      />

      <section className="mt-6 grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-[28px] bg-neutral-950 p-7 text-center text-white">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Overall rating
          </p>
          <p className="mt-5 text-7xl font-black">{average}</p>
          <p className="mt-3 text-amber-400">★★★★★</p>
          <p className="mt-3 text-sm text-white/45">
            Based on {ratings.length} reviews
          </p>
        </aside>

        <div className="space-y-4">
          {ratings.map((rating) => (
            <article
              key={rating.id}
              className="rounded-[28px] border border-neutral-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-black">{rating.clientName}</h2>
                  <p className="mt-1 text-xs text-neutral-400">
                    Project {rating.projectId}
                  </p>
                </div>
                <p className="text-amber-500">{"★".repeat(rating.rating)}</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-neutral-600">
                {rating.comment}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function SubscriptionPage({ subscription, setSubscription }) {
  const [message, setMessage] = useState("");

  const choosePlan = (plan) => {
    setSubscription({
      planId: plan.id,
      status: "active",
      startedAt: new Date().toISOString(),
      renewsAt:
        plan.monthlyPriceUsd > 0
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : "",
      paymentReference: plan.monthlyPriceUsd > 0 ? `SUB-${Date.now()}` : "",
    });
    setMessage(`${plan.name} selected. Paid checkout is simulated in this frontend.`);
  };

  return (
    <>
      <Hero
        eyebrow="Talent subscription"
        title="Use the marketplace without paying for proposal credits."
        description="Every talent can browse jobs, submit proposals and receive calls. Optional plans add AI tools, analytics, collaboration and priority support."
        image="/images/hero/banner3.png"
      />

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => {
          const selected = subscription.planId === plan.id;
          return (
            <article
              key={plan.id}
              className={`rounded-[28px] border p-6 ${
                selected
                  ? "border-red-600 bg-red-50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black">{plan.name}</h2>
                {selected && <Pill tone="red">Current</Pill>}
              </div>
              <p className="mt-4 text-4xl font-black">
                {plan.monthlyPriceUsd === 0 ? "Free" : `$${plan.monthlyPriceUsd}`}
              </p>
              <p className="mt-5 text-sm leading-7 text-neutral-500">
                {plan.description}
              </p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <p key={feature} className="text-sm text-neutral-600">
                    ✓ {feature}
                  </p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => choosePlan(plan)}
                className={`mt-7 h-12 w-full rounded-2xl text-xs font-black ${
                  selected
                    ? "bg-neutral-950 text-white"
                    : "bg-red-600 text-white hover:bg-neutral-950"
                }`}
              >
                {selected ? "Current plan" : `Choose ${plan.name}`}
              </button>
            </article>
          );
        })}
      </section>

      {message && (
        <p className="mt-5 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-700">
          {message}
        </p>
      )}
    </>
  );
}

function AvailabilityPage({
  availability,
  setAvailability,
  profile,
  portfolio,
  ratings,
}) {
  const [form, setForm] = useState(availability);
  const [message, setMessage] = useState("");

  const toggleDay = (day) => {
    setForm((current) => ({
      ...current,
      workingDays: current.workingDays.includes(day)
        ? current.workingDays.filter((entry) => entry !== day)
        : [...current.workingDays, day],
    }));
  };

  const save = (event) => {
    event.preventDefault();
    setAvailability(form);
    publishTalentProfile(profile, portfolio, form, ratings);
    setMessage("Availability saved and published to clients.");
  };

  return (
    <>
      <Hero
        eyebrow="Availability"
        title="Control when clients can invite, call and hire you."
        description="Set current status, weekly capacity, response time, working schedule, preferred budgets and vacation periods."
        image="/images/hero/banner4.png"
      />

      <form
        onSubmit={save}
        className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-black">Current status</label>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({ ...current, status: event.target.value }))
              }
              className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600"
            >
              <option value="available">Available</option>
              <option value="limited">Limited availability</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-black">Weekly capacity</label>
            <input
              type="number"
              min="0"
              max="80"
              value={form.weeklyCapacityHours}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  weeklyCapacityHours: Number(event.target.value),
                }))
              }
              className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-black">Response target</label>
            <select
              value={form.responseWindowHours}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  responseWindowHours: Number(event.target.value),
                }))
              }
              className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600"
            >
              {[1, 2, 4, 12, 24].map((hours) => (
                <option key={hours} value={hours}>
                  {hours} hour{hours === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-black">Working days</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`rounded-full px-4 py-2 text-xs font-black ${
                  form.workingDays.includes(day)
                    ? "bg-red-600 text-white"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-2xl bg-neutral-50 p-4">
            <input
              type="checkbox"
              checked={form.acceptingNewProjects}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  acceptingNewProjects: event.target.checked,
                }))
              }
              className="mt-1 h-4 w-4 accent-red-600"
            />
            <span>
              <span className="block text-sm font-black">Accepting new projects</span>
              <span className="mt-1 block text-xs text-neutral-500">
                Clients can invite and shortlist you.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl bg-neutral-50 p-4">
            <input
              type="checkbox"
              checked={form.vacationMode}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  vacationMode: event.target.checked,
                }))
              }
              className="mt-1 h-4 w-4 accent-red-600"
            />
            <span>
              <span className="block text-sm font-black">Vacation mode</span>
              <span className="mt-1 block text-xs text-neutral-500">
                Hide availability without removing your profile.
              </span>
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
        >
          Save and publish availability
        </button>

        {message && (
          <p className="mt-4 rounded-2xl bg-green-50 p-4 text-center text-sm font-bold text-green-700">
            {message}
          </p>
        )}
      </form>
    </>
  );
}

function SettingsPage({ profile, setProfile, portfolio, availability, ratings }) {
  const [form, setForm] = useState({
    ...profile,
    skillsText: (profile.skills || []).join(", "),
  });
  const [message, setMessage] = useState("");

  const save = (event) => {
    event.preventDefault();
    const updated = {
      ...form,
      hourlyRate: Number(form.hourlyRate || 0),
      yearsExperience: Number(form.yearsExperience || 0),
      skills: form.skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };
    delete updated.skillsText;
    setProfile(updated);
    if (updated.profilePublished) {
      publishTalentProfile(updated, portfolio, availability, ratings);
    }
    setMessage("Talent profile saved.");
  };

  return (
    <>
      <Hero
        eyebrow="Talent settings"
        title="Manage your professional profile and marketplace identity."
        description="These details appear in job matching, proposals, client profile views, calls and project records."
        image="/images/hero/banner1.png"
      />

      <form
        onSubmit={save}
        className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["displayName", "Public display name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["title", "Professional title"],
            ["professionalCategory", "Category"],
            ["primaryService", "Primary service"],
            ["location", "Location"],
            ["timezone", "Timezone"],
            ["hourlyRate", "Hourly rate"],
            ["yearsExperience", "Years of experience"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="mb-2 block text-sm font-black">{label}</label>
              <input
                value={form[name] ?? ""}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [name]: event.target.value }))
                }
                className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-black">Skills</label>
            <input
              value={form.skillsText}
              onChange={(event) =>
                setForm((current) => ({ ...current, skillsText: event.target.value }))
              }
              className="h-14 w-full rounded-2xl border border-neutral-300 px-4 text-sm outline-none focus:border-red-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-black">Professional bio</label>
            <textarea
              value={form.bio}
              onChange={(event) =>
                setForm((current) => ({ ...current, bio: event.target.value }))
              }
              rows={7}
              className="w-full resize-none rounded-2xl border border-neutral-300 p-4 text-sm leading-7 outline-none focus:border-red-600"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 h-14 w-full rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
        >
          Save talent profile
        </button>

        {message && (
          <p className="mt-4 rounded-2xl bg-green-50 p-4 text-center text-sm font-bold text-green-700">
            {message}
          </p>
        )}
      </form>
    </>
  );
}

export default function TalentPortal() {
  const path = window.location.pathname;

  const [profile, setProfile] = useStoredState(
    TALENT_STORAGE_KEYS.profile,
    defaultTalentProfile,
  );
  const [jobs] = useStoredState(
    TALENT_STORAGE_KEYS.jobs,
    defaultMatchingJobs,
  );
  const [bids, setBids] = useStoredState(
    TALENT_STORAGE_KEYS.bids,
    defaultTalentBids,
  );
  const [savedJobs, setSavedJobs] = useStoredState(
    TALENT_STORAGE_KEYS.savedJobs,
    [],
  );
  const [portfolio, setPortfolio] = useStoredState(
    TALENT_STORAGE_KEYS.portfolio,
    defaultPortfolio,
  );
  const [availability, setAvailability] = useStoredState(
    TALENT_STORAGE_KEYS.availability,
    defaultAvailability,
  );
  const [subscription, setSubscription] = useStoredState(
    TALENT_STORAGE_KEYS.subscription,
    defaultSubscription,
  );
  const [payout, setPayout] = useStoredState(
    TALENT_STORAGE_KEYS.payout,
    defaultPayout,
  );
  const [messages, setMessages] = useStoredState(
    TALENT_STORAGE_KEYS.messages,
    defaultTalentMessages,
  );
  const [projects] = useStoredState(
    TALENT_STORAGE_KEYS.clientProjects,
    fallbackClientProjects,
  );
  const [files, setFiles] = useStoredState(
    TALENT_STORAGE_KEYS.clientFiles,
    fallbackClientFiles,
  );
  const [clientReviews] = useStoredState(
    TALENT_STORAGE_KEYS.clientReviews,
    [],
  );
  const [notifications] = useStoredState(
    TALENT_STORAGE_KEYS.notifications,
    defaultNotifications,
  );

  const ratings = useMemo(() => {
    const linkedReviews = clientReviews
      .filter((review) => review.talentId === profile.id)
      .map((review) => ({
        id: review.id,
        projectId: review.projectId,
        clientName: "Verified client",
        rating: review.rating,
        communication: review.rating,
        quality: review.rating,
        timeliness: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      }));

    return [...linkedReviews, ...defaultTalentRatings];
  }, [clientReviews, profile.id]);

  useEffect(() => {
    if (profile.profilePublished) {
      publishTalentProfile(profile, portfolio, availability, ratings);
    }
  }, [availability, portfolio, profile, ratings]);

  if (path === "/talent") {
    window.location.replace(getTalentLandingPath());
    return null;
  }

  let title = "Talent workspace";
  let page = null;

  const jobMatch = path.match(/^\/talent\/jobs\/([^/]+)$/);
  const workMatch = path.match(/^\/talent\/work\/([^/]+)$/);
  const roomMatch = path.match(/^\/talent\/room\/([^/]+)$/);

  if (path === "/talent/dashboard") {
    title = "Dashboard Overview";
    page = (
      <DashboardPage
        profile={profile}
        jobs={jobs}
        bids={bids}
        projects={projects}
        portfolio={portfolio}
        availability={availability}
        ratings={ratings}
      />
    );
  } else if (path === "/talent/jobs") {
    title = "Matching Jobs";
    page = (
      <JobsPage
        jobs={jobs}
        savedJobs={savedJobs}
        setSavedJobs={setSavedJobs}
        bids={bids}
        profile={profile}
      />
    );
  } else if (jobMatch) {
    const job = getMatchingJob(jobs, jobMatch[1]);
    title = job?.title || "Job Details";
    page = job ? (
      <JobDetailPage
        job={job}
        bids={bids}
        setBids={setBids}
        profile={profile}
      />
    ) : null;
  } else if (path === "/talent/bids") {
    title = "Bid Management";
    page = <BidsPage bids={bids} jobs={jobs} profile={profile} />;
  } else if (path === "/talent/work") {
    title = "Active Work";
    page = <WorkPage projects={projects} profile={profile} files={files} />;
  } else if (workMatch) {
    const project = projects.find((item) => item.id === workMatch[1]);
    title = project?.title || "Project Workspace";
    page = project ? (
      <WorkDetailPage
        project={project}
        profile={profile}
        files={files}
        setFiles={setFiles}
        messages={messages}
        setMessages={setMessages}
      />
    ) : null;
  } else if (path === "/talent/deliverables") {
    title = "Deliverables";
    page = <DeliverablesPage projects={projects} files={files} profile={profile} />;
  } else if (path === "/talent/messages") {
    title = "Messages";
    page = (
      <MessagesPage
        profile={profile}
        messages={messages}
        setMessages={setMessages}
        projects={projects}
      />
    );
  } else if (roomMatch) {
    const project = projects.find((item) => item.id === roomMatch[1]);
    title = "Call Room";
    page = (
      <CallRoomPage
        project={project}
        profile={profile}
        messages={messages}
        setMessages={setMessages}
      />
    );
  } else if (path === "/talent/portfolio") {
    title = "Portfolio";
    page = (
      <PortfolioPage
        profile={profile}
        setProfile={setProfile}
        portfolio={portfolio}
        setPortfolio={setPortfolio}
        availability={availability}
        ratings={ratings}
      />
    );
  } else if (path === "/talent/earnings") {
    title = "Earnings";
    page = (
      <EarningsPage
        projects={projects}
        profile={profile}
        payout={payout}
        setPayout={setPayout}
      />
    );
  } else if (path === "/talent/ratings") {
    title = "Ratings";
    page = <RatingsPage ratings={ratings} />;
  } else if (path === "/talent/subscription") {
    title = "Subscription";
    page = (
      <SubscriptionPage
        subscription={subscription}
        setSubscription={setSubscription}
      />
    );
  } else if (path === "/talent/availability") {
    title = "Availability";
    page = (
      <AvailabilityPage
        availability={availability}
        setAvailability={setAvailability}
        profile={profile}
        portfolio={portfolio}
        ratings={ratings}
      />
    );
  } else if (path === "/talent/settings") {
    title = "Settings";
    page = (
      <SettingsPage
        profile={profile}
        setProfile={setProfile}
        portfolio={portfolio}
        availability={availability}
        ratings={ratings}
      />
    );
  }

  if (!page) {
    page = (
      <section className="rounded-[28px] border border-neutral-200 bg-white p-10 text-center">
        <h2 className="text-2xl font-black">Talent page not found</h2>
        <a
          href="/talent/dashboard"
          className="mt-5 inline-flex rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white"
        >
          Return to dashboard
        </a>
      </section>
    );
  }

  return (
    <Shell profile={profile} notifications={notifications} title={title}>
      {page}
    </Shell>
  );
}

export { beginTalentAccount, getTalentLandingPath };
