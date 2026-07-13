import { useMemo, useState } from "react";

import {
  bootcampBenefits,
  bootcampTracks,
  formatProgramMoney,
  internshipTimeline,
  internshipTracks,
  submitProgramApplication,
} from "./programData";
import ThemeToggle from "../../theme/ThemeToggle";

export function isProgramsPath(pathname) {
  return (
    pathname === "/internship" ||
    pathname === "/bootcamp" ||
    pathname === "/programs/internship/apply" ||
    pathname === "/programs/bootcamp/apply" ||
    pathname === "/programs/application-success"
  );
}

function Icon({
  name,
  className = "h-5 w-5",
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };

  const icons = {
    arrow: (
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    check: (
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
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
    users: (
      <>
        <circle
          cx="9"
          cy="8"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M2 21c1-5 3-7 7-7s6 2 7 7M16 4a4 4 0 0 1 0 8M17 14c3 .4 5 2.5 5 7"
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
          r="6"
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
    briefcase: (
      <>
        <rect
          x="3"
          y="7"
          width="18"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M9 7V4h6v3M3 12h18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
    code: (
      <path
        d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    play: (
      <path
        d="m8 5 11 7-11 7V5Z"
        fill="currentColor"
      />
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
    mail: (
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
          d="m4 7 8 6 8-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </>
    ),
    upload: (
      <>
        <path
          d="M12 16V4M7 9l5-5 5 5M4 20h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    location: (
      <>
        <path
          d="M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="9"
          r="2.5"
          stroke="currentColor"
          strokeWidth="2"
        />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex h-[84px] max-w-[1500px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <a href="/">
          <img
            src="/images/logo/nexacore-logo-light.png"
            alt="NexaCore"
            className="h-11 w-auto max-w-[180px] object-contain"
          />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          <a
            href="/"
            className="text-sm font-black text-neutral-600 hover:text-red-600 dark:text-neutral-300"
          >
            Home
          </a>
          <a
            href="/bootcamp"
            className="text-sm font-black text-neutral-600 hover:text-red-600 dark:text-neutral-300"
          >
            Bootcamps
          </a>
          <a
            href="/internship"
            className="text-sm font-black text-neutral-600 hover:text-red-600 dark:text-neutral-300"
          >
            Internships
          </a>
          <a
            href="/courses"
            className="text-sm font-black text-neutral-600 hover:text-red-600 dark:text-neutral-300"
          >
            Courses
          </a>
          <a
            href="/services"
            className="text-sm font-black text-neutral-600 hover:text-red-600 dark:text-neutral-300"
          >
            Services
          </a>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <a
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 px-5 text-xs font-black text-neutral-800 hover:border-red-600 hover:text-red-600 dark:border-neutral-700 dark:text-white"
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-xs font-black text-white hover:bg-neutral-950"
          >
            Get started
          </a>
        </div>

        <button
          type="button"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-300 lg:hidden dark:border-neutral-700"
          aria-label="Open navigation"
        >
          <Icon
            name={menuOpen ? "close" : "menu"}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-neutral-200 bg-white px-5 py-5 dark:border-neutral-800 dark:bg-neutral-950 lg:hidden">
          <div className="mx-auto max-w-[1500px] space-y-2">
            {[
              ["Home", "/"],
              ["Bootcamps", "/bootcamp"],
              ["Internships", "/internship"],
              ["Courses", "/courses"],
              ["Services", "/services"],
              ["Sign in", "/login"],
              ["Get started", "/signup"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="block rounded-xl px-4 py-3 text-sm font-black text-neutral-700 hover:bg-red-50 hover:text-red-600 dark:text-neutral-200 dark:hover:bg-red-950/30"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="mt-20 bg-neutral-950 px-5 py-12 text-white sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <img
            src="/images/logo/nexacore-logo-light.png"
            alt="NexaCore"
            className="h-12 w-auto max-w-[190px] object-contain"
          />
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
            NexaCore combines deep technology education, supervised internships and a professional service marketplace.
          </p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Programmes
          </p>
          <div className="mt-4 space-y-3">
            <a
              href="/bootcamp"
              className="block text-sm text-white/55 hover:text-white"
            >
              Bootcamps
            </a>
            <a
              href="/internship"
              className="block text-sm text-white/55 hover:text-white"
            >
              Internships
            </a>
            <a
              href="/courses"
              className="block text-sm text-white/55 hover:text-white"
            >
              Courses
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
            Access
          </p>
          <div className="mt-4 space-y-3">
            <a
              href="/login"
              className="block text-sm text-white/55 hover:text-white"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="block text-sm text-white/55 hover:text-white"
            >
              Create account
            </a>
            <a
              href="/client/services"
              className="block text-sm text-white/55 hover:text-white"
            >
              Hire talent
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Hero({
  eyebrow,
  title,
  description,
  image,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}) {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-neutral-950">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/25" />

      <div className="relative z-10 mx-auto flex min-h-[680px] max-w-[1500px] items-center px-5 py-20 sm:px-8 lg:px-10">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-black leading-[1.03] text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={primaryHref}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-red-600 px-7 text-sm font-black text-white hover:bg-white hover:text-red-600"
            >
              {primaryLabel}
              <Icon name="arrow" />
            </a>

            <a
              href={secondaryHref}
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.06] px-7 text-sm font-black text-white hover:bg-white hover:text-neutral-950"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatGrid({ items }) {
  return (
    <section className="mx-auto -mt-12 grid max-w-[1400px] gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
      {items.map(([label, value, icon]) => (
        <article
          key={label}
          className="relative z-10 rounded-[24px] border border-neutral-200 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40">
            <Icon name={icon} />
          </div>
          <p className="mt-5 text-2xl font-black">
            {value}
          </p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
        </article>
      ))}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-sm leading-8 text-neutral-500 dark:text-neutral-400 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function InternshipPage() {
  return (
    <>
      <PublicHeader />

      <Hero
        eyebrow="NexaCore supervised internship"
        title="Move from learning into real professional delivery."
        description="Join a structured internship with mentors, team projects, reviews, portfolio development and a readiness pathway into employment or the NexaCore talent marketplace."
        image="/images/hero/banner3.png"
        primaryLabel="Apply for internship"
        primaryHref="/programs/internship/apply"
        secondaryLabel="View internship tracks"
        secondaryHref="#internship-tracks"
      />

      <StatGrid
        items={[
          ["Programme length", "12 weeks", "calendar"],
          ["Delivery model", "Remote + live", "play"],
          ["Portfolio outcome", "Verified project", "briefcase"],
          ["Completion", "Certificate + report", "certificate"],
        ]}
      />

      <main>
        <section
          id="internship-tracks"
          className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-10"
        >
          <SectionHeading
            eyebrow="Internship tracks"
            title="Choose a professional path and work through supervised delivery."
            description="Every track combines technical or creative practice with communication, teamwork, documentation, deadlines and portfolio presentation."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {internshipTracks.map((track) => (
              <article
                key={track.id}
                className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="relative h-[230px]">
                  <img
                    src={track.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-red-300">
                      {track.duration}
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      {track.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm leading-7 text-neutral-500 dark:text-neutral-400">
                    {track.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {track.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    {track.outcomes.map((outcome) => (
                      <div
                        key={outcome}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                          <Icon
                            name="check"
                            className="h-3 w-3"
                          />
                        </div>
                        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                          {outcome}
                        </p>
                      </div>
                    ))}
                  </div>

                  <a
                    href={`/programs/internship/apply?track=${track.id}`}
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
                  >
                    Apply for this track
                    <Icon name="arrow" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-neutral-950 px-5 py-24 text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <SectionHeading
              eyebrow="Programme structure"
              title="Twelve weeks from onboarding to professional evidence."
              description="The internship is structured as a progression rather than a collection of random tasks."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-5">
              {internshipTimeline.map((item, index) => (
                <article
                  key={item.week}
                  className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-black">
                    {index + 1}
                  </div>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.13em] text-red-400">
                    {item.week}
                  </p>
                  <h3 className="mt-2 text-lg font-black">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/45">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-10">
          <div className="grid gap-8 rounded-[32px] border border-neutral-200 bg-white p-7 dark:border-neutral-800 dark:bg-neutral-900 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                Who should apply
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight">
                Built for learners ready to prove they can work.
              </h2>
              <p className="mt-5 text-sm leading-8 text-neutral-500 dark:text-neutral-400">
                Applicants should have basic knowledge in the selected track, consistent internet access, a working laptop and enough weekly time to complete tasks and meetings.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Students completing a NexaCore course",
                "Self-taught learners with basic practical skills",
                "Career changers building work experience",
                "Graduates needing portfolio evidence",
                "Professionals moving into technology",
                "Creative learners developing a showreel",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800"
                >
                  <Icon
                    name="check"
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
                  />
                  <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center rounded-[32px] bg-red-600 px-7 py-14 text-center text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
              Ready for practical experience
            </p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black sm:text-5xl">
              Apply for a supervised NexaCore internship.
            </h2>
            <a
              href="/programs/internship/apply"
              className="mt-7 inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-8 text-sm font-black text-red-600 hover:bg-neutral-950 hover:text-white"
            >
              Start application
              <Icon name="arrow" />
            </a>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}

function BootcampPage() {
  const [currency, setCurrency] = useState("NGN");

  return (
    <>
      <PublicHeader />

      <Hero
        eyebrow="NexaCore career bootcamps"
        title="Deep, practical education designed for real capability."
        description="Learn through live teaching, structured modules, assignments, projects, mentor support, soft skills, portfolio development and a clear pathway into internships and professional work."
        image="/images/hero/banner1.png"
        primaryLabel="Apply for a bootcamp"
        primaryHref="/programs/bootcamp/apply"
        secondaryLabel="Explore programmes"
        secondaryHref="#bootcamp-tracks"
      />

      <StatGrid
        items={[
          ["Curriculum", "10 deep modules", "code"],
          ["Learning model", "Live + recorded", "play"],
          ["Assessment", "Projects + assignments", "briefcase"],
          ["Progression", "Internship pathway", "users"],
        ]}
      />

      <main>
        <section
          id="bootcamp-tracks"
          className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                Bootcamp programmes
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Career programmes with depth, practice and measurable outcomes.
              </h2>
              <p className="mt-5 text-sm leading-8 text-neutral-500 dark:text-neutral-400 sm:text-base">
                Select your billing currency to view Nigerian or international programme pricing.
              </p>
            </div>

            <div className="inline-flex rounded-full border border-neutral-300 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900">
              {[
                ["NGN", "Nigeria"],
                ["USD", "International"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCurrency(value)}
                  className={`rounded-full px-5 py-3 text-xs font-black ${
                    currency === value
                      ? "bg-red-600 text-white"
                      : "text-neutral-500 dark:text-neutral-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {bootcampTracks.map((track) => (
              <article
                key={track.id}
                className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="relative h-[230px]">
                  <img
                    src={track.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.13em] text-red-300">
                      {track.category}
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      {track.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                      <p className="text-xs text-neutral-400">
                        Duration
                      </p>
                      <p className="mt-2 font-black">
                        {track.duration}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                      <p className="text-xs text-neutral-400">
                        Level
                      </p>
                      <p className="mt-2 text-sm font-black">
                        {track.intensity}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-red-50 p-5 dark:bg-red-950/30">
                    <p className="text-xs font-black uppercase tracking-[0.13em] text-red-600">
                      Programme fee
                    </p>
                    <p className="mt-2 text-3xl font-black text-red-700 dark:text-red-300">
                      {formatProgramMoney(
                        currency === "NGN"
                          ? track.priceNgn
                          : track.priceUsd,
                        currency,
                      )}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-black">
                      Curriculum
                    </p>
                    <ol className="mt-4 space-y-3">
                      {track.modules.map((module, index) => (
                        <li
                          key={module}
                          className="flex items-start gap-3"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-black text-white dark:bg-red-600">
                            {index + 1}
                          </span>
                          <span className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                            {module}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <a
                    href={`/programs/bootcamp/apply?track=${track.id}&currency=${currency}`}
                    className="mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
                  >
                    Apply for programme
                    <Icon name="arrow" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-neutral-950 px-5 py-24 text-white sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <SectionHeading
              eyebrow="What is included"
              title="More than lessons: a complete learning and career system."
              description="Bootcamp students receive structured support from enrollment through portfolio, internship and work-readiness."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {bootcampBenefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600">
                    <Icon
                      name="check"
                      className="h-4 w-4"
                    />
                  </div>
                  <p className="mt-4 text-sm font-black leading-6">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                number: "01",
                title: "Learn deeply",
                description:
                  "Follow a sequenced curriculum with live explanation, practice and recorded support.",
              },
              {
                number: "02",
                title: "Build evidence",
                description:
                  "Complete assignments, graded projects and a substantial portfolio capstone.",
              },
              {
                number: "03",
                title: "Move into work",
                description:
                  "Progress into internship, talent marketplace readiness or job-search preparation.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-[28px] border border-neutral-200 bg-white p-7 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <p className="text-5xl font-black text-red-600">
                  {item.number}
                </p>
                <h3 className="mt-5 text-2xl font-black">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-neutral-500 dark:text-neutral-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center rounded-[32px] bg-red-600 px-7 py-14 text-center text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
              Your career pathway
            </p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black sm:text-5xl">
              Choose a bootcamp and start building professional capability.
            </h2>
            <a
              href="/programs/bootcamp/apply"
              className="mt-7 inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-8 text-sm font-black text-red-600 hover:bg-neutral-950 hover:text-white"
            >
              Start application
              <Icon name="arrow" />
            </a>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}

function ApplicationPage({ type }) {
  const tracks =
    type === "internship"
      ? internshipTracks
      : bootcampTracks;

  const params = new URLSearchParams(
    window.location.search,
  );

  const requestedTrack = params.get("track");
  const requestedCurrency =
    params.get("currency") === "USD"
      ? "USD"
      : "NGN";

  const initialTrack =
    tracks.find((track) => track.id === requestedTrack) ||
    tracks[0];

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Nigeria",
    trackId: initialTrack.id,
    educationLevel: "",
    experienceLevel: "",
    weeklyAvailability: "",
    motivation: "",
    portfolioUrl: "",
    currency: requestedCurrency,
    paymentPlan: "full",
    consent: false,
  });

  const [attachmentName, setAttachmentName] =
    useState("");
  const [error, setError] = useState("");

  const selectedTrack = tracks.find(
    (track) => track.id === form.trackId,
  );

  const submit = (event) => {
    event.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.motivation.trim() ||
      !form.consent
    ) {
      setError(
        "Complete the required fields and accept the declaration.",
      );
      return;
    }

    const application = submitProgramApplication(
      type,
      {
        ...form,
        attachmentName,
        trackTitle: selectedTrack.title,
      },
    );

    window.location.href =
      `/programs/application-success?type=${type}&id=${application.id}`;
  };

  const programmeFee =
    type === "bootcamp"
      ? form.currency === "NGN"
        ? selectedTrack.priceNgn
        : selectedTrack.priceUsd
      : null;

  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#f4f5f7] px-5 py-12 dark:bg-neutral-950 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-7 xl:grid-cols-[1fr_390px]">
          <form
            onSubmit={submit}
            className="rounded-[30px] border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-9"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
              {type === "internship"
                ? "Internship application"
                : "Bootcamp application"}
            </p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Apply to NexaCore
            </h1>
            <p className="mt-4 text-sm leading-7 text-neutral-500 dark:text-neutral-400">
              Complete the application carefully. Your answers help the admissions team place you in the correct learning or internship track.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                ["firstName", "First name", "text"],
                ["lastName", "Last name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone number", "tel"],
                ["country", "Country", "text"],
                [
                  "portfolioUrl",
                  "Portfolio or LinkedIn URL",
                  "url",
                ],
              ].map(([name, label, inputType]) => (
                <div key={name}>
                  <label className="mb-2 block text-sm font-black">
                    {label}
                  </label>
                  <input
                    type={inputType}
                    value={form[name]}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [name]: event.target.value,
                      }))
                    }
                    className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 dark:border-neutral-700 dark:bg-neutral-950"
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-black">
                  Programme track
                </label>
                <select
                  value={form.trackId}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      trackId: event.target.value,
                    }))
                  }
                  className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600 dark:border-neutral-700 dark:bg-neutral-950"
                >
                  {tracks.map((track) => (
                    <option
                      key={track.id}
                      value={track.id}
                    >
                      {track.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Education level
                </label>
                <select
                  value={form.educationLevel}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      educationLevel:
                        event.target.value,
                    }))
                  }
                  className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600 dark:border-neutral-700 dark:bg-neutral-950"
                >
                  <option value="">Select level</option>
                  <option>Secondary school</option>
                  <option>Diploma</option>
                  <option>Undergraduate</option>
                  <option>Graduate</option>
                  <option>Postgraduate</option>
                  <option>Self-taught professional</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Current experience
                </label>
                <select
                  value={form.experienceLevel}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      experienceLevel:
                        event.target.value,
                    }))
                  }
                  className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600 dark:border-neutral-700 dark:bg-neutral-950"
                >
                  <option value="">Select experience</option>
                  <option>No prior experience</option>
                  <option>Basic knowledge</option>
                  <option>Completed a course</option>
                  <option>Built personal projects</option>
                  <option>Professional experience</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black">
                  Weekly availability
                </label>
                <select
                  value={form.weeklyAvailability}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      weeklyAvailability:
                        event.target.value,
                    }))
                  }
                  className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600 dark:border-neutral-700 dark:bg-neutral-950"
                >
                  <option value="">Select hours</option>
                  <option>5–10 hours</option>
                  <option>10–20 hours</option>
                  <option>20–30 hours</option>
                  <option>30+ hours</option>
                </select>
              </div>

              {type === "bootcamp" && (
                <div>
                  <label className="mb-2 block text-sm font-black">
                    Payment option
                  </label>
                  <select
                    value={form.paymentPlan}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        paymentPlan: event.target.value,
                      }))
                    }
                    className="h-14 w-full rounded-2xl border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-red-600 dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <option value="full">
                      Full payment
                    </option>
                    <option value="installment">
                      Installment request
                    </option>
                    <option value="sponsorship">
                      Employer or sponsor
                    </option>
                  </select>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-black">
                  Why are you applying?
                </label>
                <textarea
                  value={form.motivation}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      motivation: event.target.value,
                    }))
                  }
                  rows={7}
                  placeholder="Explain your goals, current level and the outcome you expect."
                  className="w-full resize-none rounded-2xl border border-neutral-300 bg-white p-4 text-sm leading-7 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 dark:border-neutral-700 dark:bg-neutral-950"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block cursor-pointer rounded-[24px] border-2 border-dashed border-neutral-300 bg-neutral-50 p-7 text-center hover:border-red-600 dark:border-neutral-700 dark:bg-neutral-800">
                  <Icon
                    name="upload"
                    className="mx-auto h-8 w-8 text-red-600"
                  />
                  <p className="mt-3 font-black">
                    Upload CV or supporting document
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    The frontend preview stores the selected filename.
                  </p>
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

                {attachmentName && (
                  <p className="mt-3 rounded-2xl bg-green-50 p-3 text-sm font-bold text-green-700 dark:bg-green-950/30 dark:text-green-300">
                    {attachmentName}
                  </p>
                )}
              </div>

              <label className="sm:col-span-2 flex items-start gap-3 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      consent: event.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 accent-red-600"
                />
                <span className="text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                  I confirm that the information provided is accurate and I agree to be contacted about this application.
                </span>
              </label>
            </div>

            {error && (
              <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-6 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-neutral-950"
            >
              Submit application
              <Icon name="arrow" />
            </button>
          </form>

          <aside className="h-fit rounded-[30px] bg-neutral-950 p-7 text-white xl:sticky xl:top-[110px]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
              Selected programme
            </p>
            <h2 className="mt-3 text-2xl font-black">
              {selectedTrack.title}
            </h2>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-white/[0.06] p-4">
                <p className="text-xs text-white/40">
                  Duration
                </p>
                <p className="mt-2 font-black">
                  {selectedTrack.duration}
                </p>
              </div>

              {type === "bootcamp" && (
                <>
                  <div className="rounded-2xl bg-white/[0.06] p-4">
                    <p className="text-xs text-white/40">
                      Billing currency
                    </p>
                    <div className="mt-3 flex gap-2">
                      {["NGN", "USD"].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              currency: value,
                            }))
                          }
                          className={`rounded-full px-4 py-2 text-xs font-black ${
                            form.currency === value
                              ? "bg-red-600"
                              : "bg-white/10"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-red-600 p-5">
                    <p className="text-xs text-white/70">
                      Programme fee
                    </p>
                    <p className="mt-2 text-3xl font-black">
                      {formatProgramMoney(
                        programmeFee,
                        form.currency,
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {(
                type === "internship"
                  ? selectedTrack.outcomes
                  : bootcampBenefits.slice(0, 6)
              ).map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3"
                >
                  <Icon
                    name="check"
                    className="mt-1 h-4 w-4 shrink-0 text-red-400"
                  />
                  <p className="text-sm leading-6 text-white/55">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}

function ApplicationSuccessPage() {
  const params = new URLSearchParams(
    window.location.search,
  );

  const type =
    params.get("type") === "internship"
      ? "internship"
      : "bootcamp";

  const applicationId =
    params.get("id") || "Application submitted";

  return (
    <>
      <PublicHeader />

      <main className="flex min-h-[calc(100vh-84px)] items-center justify-center bg-[#f4f5f7] px-5 py-16 dark:bg-neutral-950">
        <section className="w-full max-w-3xl rounded-[32px] border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900 sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300">
            <Icon
              name="check"
              className="h-9 w-9"
            />
          </div>

          <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-red-600">
            Application received
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            Your {type} application has been submitted.
          </h1>

          <p className="mt-5 text-sm leading-8 text-neutral-500 dark:text-neutral-400">
            The admissions team will review your application and contact you with the next step. Keep your application reference for support enquiries.
          </p>

          <div className="mx-auto mt-7 max-w-md rounded-2xl bg-neutral-50 p-5 dark:bg-neutral-800">
            <p className="text-xs font-black uppercase tracking-[0.13em] text-neutral-400">
              Application reference
            </p>
            <p className="mt-2 text-xl font-black">
              {applicationId}
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={
                type === "internship"
                  ? "/internship"
                  : "/bootcamp"
              }
              className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-black text-white hover:bg-red-600"
            >
              Return to programme
            </a>

            <a
              href="/signup?role=student"
              className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 px-6 text-sm font-black hover:border-red-600 hover:text-red-600 dark:border-neutral-700"
            >
              Create student account
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

export default function ProgramsPortal() {
  const path = window.location.pathname;

  if (path === "/internship") {
    return <InternshipPage />;
  }

  if (path === "/bootcamp") {
    return <BootcampPage />;
  }

  if (path === "/programs/internship/apply") {
    return <ApplicationPage type="internship" />;
  }

  if (path === "/programs/bootcamp/apply") {
    return <ApplicationPage type="bootcamp" />;
  }

  if (path === "/programs/application-success") {
    return <ApplicationSuccessPage />;
  }

  return null;
}
