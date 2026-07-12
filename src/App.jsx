import { useEffect, useState } from "react";
import { heroSlides } from "./data/heroSlides";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import PlatformPages, {
  platformPagePaths,
} from "./pages/PlatformPages";
import CourseCatalog from "./pages/CourseCatalog";

import StudentPortal, {
  isStudentPortalPath,
} from "./pages/student/StudentPortal";
import TutorPortal, {
  isTutorPortalPath,
} from "./pages/tutor/TutorPortal";
import ClientPortal, {
  isClientPortalPath,
} from "./pages/client/ClientPortal";
import TalentPortal, {
  isTalentPortalPath,
} from "./pages/talent/TalentPortal";

const navigationLinks = [
  { label: "Academy", href: "#academy" },
  { label: "Categories", href: "#categories" },
  { label: "Who it's for", href: "#participants" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const trustItems = [
  {
    title: "Practical learning",
    text: "Project-based technology courses",
  },
  {
    title: "Verified professionals",
    text: "Discover matching technology talent",
  },
  {
    title: "Protected payments",
    text: "Tracked milestones and secure delivery",
  },
  {
    title: "One ecosystem",
    text: "Learn, hire, teach and deliver",
  },
];

const categories = [
  {
    code: "SD",
    title: "Software Development",
    description:
      "Frontend, backend, full stack, mobile applications, APIs and software testing.",
    image: "/images/hero/sd.png",
    href: "/courses/software-development",
  },
  {
    code: "DA",
    title: "Data and Analytics",
    description:
      "Data analysis, Power BI, Excel, SQL, Python, business intelligence and reporting.",
    image: "/images/hero/da.png",
    href: "/courses/data-analytics",
  },
  {
    code: "AI",
    title: "Artificial Intelligence",
    description:
      "Machine learning, AI automation, prompt engineering, NLP and intelligent systems.",
    image: "/images/hero/ai.png",
    href: "/courses/artificial-intelligence",
  },
  {
    code: "CY",
    title: "Cybersecurity",
    description:
      "Ethical hacking, GRC, security operations, network security and data privacy.",
    image: "/images/hero/cy.png",
    href: "/courses/cybersecurity",
  },
  {
    code: "UX",
    title: "Design and Product",
    description:
      "UI/UX design, product design, research, Figma, design systems and product strategy.",
    image: "/images/hero/ux.png",
    href: "/courses/design-product",
  },
  {
    code: "CD",
    title: "Cloud and DevOps",
    description:
      "AWS, Azure, Docker, Kubernetes, Linux, deployment and CI/CD pipelines.",
    image: "/images/hero/cd.png",
    href: "/courses/cloud-devops",
  },
  {
    code: "DM",
    title: "Digital Business",
    description:
      "Digital marketing, social media, SEO, virtual assistance and technology sales.",
    image: "/images/hero/dm.png",
    href: "/courses/digital-business",
  },
  {
    code: "PM",
    title: "Project Management",
    description:
      "Agile, Scrum, technology project coordination, documentation and delivery tracking.",
    image: "/images/hero/pm.png",
    href: "/courses/project-management",
  },
];

const roles = [
  {
    title: "Students",
    label: "Learn and grow",
    description:
      "Learn practical skills, submit projects, receive professional feedback and earn verifiable certificates.",
    image: "/images/hero/student.png",
    href: "/signup?role=student",
  },
  {
    title: "Tutors",
    label: "Teach and mentor",
    description:
      "Teach live courses, mentor learners, grade assignments and grow your professional audience.",
    image: "/images/hero/tutor.png",
    href: "/signup?role=tutor",
  },
  {
    title: "Clients",
    label: "Hire professionals",
    description:
      "Post technology projects, compare proposals, hire matching talent and approve project delivery.",
    image: "/images/hero/client.png",
    href: "/signup?role=client",
  },
  {
    title: "Talent",
    label: "Find opportunities",
    description:
      "Discover matching jobs, submit proposals, complete milestones and build a trusted reputation.",
    image: "/images/hero/talent.png",
    href: "/signup?role=talent",
  },
];

const learningSteps = [
  {
    number: "01",
    title: "Choose a course",
    description:
      "Browse by category, skill level, tutor, price and expected duration.",
  },
  {
    number: "02",
    title: "Select your tutor",
    description:
      "Compare tutors using experience, ratings, availability and teaching approach.",
  },
  {
    number: "03",
    title: "Attend live classes",
    description:
      "Join scheduled sessions, access learning materials and communicate with your tutor.",
  },
  {
    number: "04",
    title: "Complete projects",
    description:
      "Submit assignments and practical projects for grading and professional feedback.",
  },
  {
    number: "05",
    title: "Earn your certificate",
    description:
      "Receive a verifiable certificate and publish approved projects to your portfolio.",
  },
];

const hiringSteps = [
  {
    number: "01",
    title: "Post your request",
    description:
      "Describe the project, category, required skills, budget, deadline and deliverables.",
  },
  {
    number: "02",
    title: "Receive matching bids",
    description:
      "Qualified professionals in the selected skill category submit their proposals.",
  },
  {
    number: "03",
    title: "Choose your provider",
    description:
      "Compare ratings, proposals, portfolios, prices and delivery timelines.",
  },
  {
    number: "04",
    title: "Collaborate securely",
    description:
      "Use the project workroom for messages, files, milestones, reviews and revisions.",
  },
  {
    number: "05",
    title: "Approve and complete",
    description:
      "Approve the final work, release payment and rate the professional.",
  },
];

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

function CheckIcon({ className = "h-5 w-5" }) {
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
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      className="h-7 w-7"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-7 w-7"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m15 18-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-white/10 bg-neutral-950/95 shadow-xl backdrop-blur-xl"
          : "border-b border-white/10 bg-black/65 backdrop-blur-md"
        }`}
    >

      <div className="mx-auto flex h-[86px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* CLICKABLE LOGO */}
        <a
          href="/"
          onClick={closeMenu}
          className="relative z-10 flex shrink-0 items-center"
          aria-label="Go to NexaCore homepage"
        >
          {!logoFailed ? (
            <img
              src="/images/logo/nexacore-logo-light.png"
              alt="NexaCore"
              onError={() => setLogoFailed(true)}
              className="h-12 w-auto max-w-[230px] object-contain object-left transition-transform duration-300 hover:scale-[1.04] sm:h-14 sm:max-w-[270px]"
            />
          ) : (
            <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Nexa<span className="text-red-600">Core</span>
            </span>
          )}
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigationLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative py-3 text-sm font-bold text-white transition-colors duration-300 after:absolute after:bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:text-red-400 hover:after:w-full"
            >
              {item.label}
            </a>
           ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/login"
            className="rounded-full border border-white/70 bg-black/30 px-6 py-3 text-sm font-black text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
          >
            Log in
          </a>

          <a
            href="/signup"
            className="rounded-full border border-red-600 bg-red-600 px-6 py-3 text-sm font-black text-white shadow-[0_10px_30px_rgba(220,38,38,0.25)] transition-all duration-300 hover:border-white hover:bg-white hover:text-red-600"
          >
            Create account
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="relative z-10 rounded-xl border border-white/25 bg-black/20 p-2 text-white backdrop-blur-md lg:hidden"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        className={`overflow-hidden bg-neutral-950 transition-all duration-300 lg:hidden ${
          menuOpen
            ? "max-h-[600px] border-t border-white/10 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-[1440px] flex-col px-5 py-5 sm:px-8">
          {navigationLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="border-b border-white/10 py-4 text-base font-semibold text-white/80 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}

          <div className="grid grid-cols-2 gap-3 pt-5">
            <a
              href="/login"
              onClick={closeMenu}
              className="rounded-full border border-white/30 px-5 py-3 text-center text-sm font-bold text-white"
            >
              Log in
            </a>

            <a
              href="/signup"
              onClick={closeMenu}
              className="rounded-full bg-red-600 px-5 py-3 text-center text-sm font-bold text-white"
            >
              Sign up
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;

    const interval = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % heroSlides.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [paused]);

  const previousSlide = () => {
    setCurrentSlide((current) =>
      current === 0 ? heroSlides.length - 1 : current - 1,
    );
  };

  const nextSlide = () => {
    setCurrentSlide((current) => (current + 1) % heroSlides.length);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section
      id="home"
      className="relative isolate min-h-[760px] overflow-hidden bg-neutral-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* BACKGROUND IMAGE OR VIDEO */}
      <div key={slide.id} className="absolute inset-0 hero-media-enter">
        {slide.type === "video" ? (
          <video
            src={slide.src}
            poster={slide.poster}
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <img
            src={slide.src}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        )}
      </div>

      {/* PROFESSIONAL DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.22)_55%,rgba(0,0,0,0.7)_100%)]" />

      {/* RED BACKGROUND GLOW */}
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[150px]" />

      {/* CENTERED HERO CONTENT */}
      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1440px] items-center justify-center px-5 pb-36 pt-32 sm:px-8 sm:pb-40 lg:px-12">
        <div className="mx-auto w-full max-w-6xl text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-red-500" />

            <span className="text-xs font-black uppercase tracking-[0.25em] text-red-400 sm:text-sm">
              {slide.eyebrow}
            </span>

            <span className="h-px w-10 bg-red-500" />
          </div>

          <h1 className="mx-auto max-w-6xl text-[clamp(3rem,6vw,5.5rem)] font-black leading-[0.98] tracking-[-0.045em] text-white">
            <span className="block">{slide.title}</span>

            <span className="mt-2 block text-red-500">
              {slide.highlight}
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            {slide.description}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
  <a
    href={slide.primaryAction.href}
    className="group inline-flex min-w-[210px] items-center justify-center gap-3 rounded-full border border-red-600 bg-red-600 px-8 py-4 text-sm font-black text-white shadow-[0_18px_60px_rgba(220,38,38,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-red-600 sm:text-base"
  >
    {slide.primaryAction.label}

    <ArrowIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
  </a>

  <a
    href={slide.secondaryAction.href}
    className="inline-flex min-w-[210px] items-center justify-center rounded-full border border-white/70 bg-black/40 px-8 py-4 text-sm font-black text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-black sm:text-base"
  >
    {slide.secondaryAction.label}
  </a>
</div>
        </div>
      </div>

      {/* ONLY ARROWS — NO NUMBERS AND NO SLIDE DOTS */}
      <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 sm:bottom-24 sm:left-auto sm:right-8 sm:translate-x-0 lg:right-12">
        <button
          type="button"
          onClick={previousSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/30 text-white backdrop-blur-md transition hover:border-white hover:bg-white hover:text-black"
          aria-label="Previous hero slide"
        >
          <ChevronLeftIcon />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/30 text-white backdrop-blur-md transition hover:border-white hover:bg-white hover:text-black"
          aria-label="Next hero slide"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="relative z-30 -mt-14 w-full">
      <div className="grid w-full gap-px border-y border-white/10 bg-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:grid-cols-2 xl:grid-cols-4">
        {trustItems.map((item) => (
          <article
            key={item.title}
            className="flex min-h-[150px] items-center gap-5 bg-neutral-950 px-7 py-7 sm:px-9 xl:px-10"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_10px_30px_rgba(220,38,38,0.25)]">
              <CheckIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-black text-white">
                {item.title}
              </h3>

              <p className="mt-2 max-w-[230px] text-sm leading-6 text-white/55">
                {item.text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  light = false,
}) {
  return (
    <div
      className={`w-full ${
        centered
          ? "mx-auto max-w-5xl text-center"
          : "max-w-5xl"
      }`}
    >
      <div
        className={`mb-5 flex items-center gap-3 ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-9 bg-red-600" />

        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-600 sm:text-sm">
          {eyebrow}
        </p>

        {centered && <span className="h-px w-9 bg-red-600" />}
      </div>

      <h2
        className={`text-[clamp(2.5rem,5vw,4.75rem)] font-black leading-[1.04] tracking-[-0.045em] ${
          light ? "text-white" : "text-neutral-950"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mx-auto mt-6 max-w-3xl text-base leading-8 sm:text-lg ${
            light ? "text-white/60" : "text-neutral-600"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function PlatformSection() {
  return (
    <section
      id="platform"
      className="scroll-mt-24 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* CENTRED FULL-WIDTH HEADING */}
        <SectionHeading
          eyebrow="One connected platform"
          title="Education and professional delivery, working together."
          description="NexaCore combines structured technology learning with a category-matched service marketplace. Learners build practical proof, while clients discover professionals capable of delivering real work. Whether you are learning, teaching, hiring or searching for opportunities, NexaCore gives you a clear path forward."
          centered
        />

        {/* TWO MAIN PLATFORM CARDS */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <article
            id="academy"
            className="group relative min-h-[560px] scroll-mt-24 overflow-hidden rounded-[32px] bg-neutral-950"
          >
            <img
              src="/images/hero/banner1.png"
              alt="NexaCore Academy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-10">
              <span className="inline-flex rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-400 backdrop-blur-md">
                NexaCore Academy
              </span>

              <h3 className="mt-5 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                Learn practical technology skills from experienced tutors.
              </h3>

              <p className="mt-4 max-w-xl leading-7 text-white/65">
                Attend live classes, access materials, submit assignments,
                complete practical projects and earn verifiable certificates.
              </p>

              <a
                href="#categories"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-black text-white transition hover:bg-white hover:text-red-600"
              >
                Discover the academy
                <ArrowIcon />
              </a>
            </div>
          </article>

          <article
            id="marketplace"
            className="group relative min-h-[560px] scroll-mt-24 overflow-hidden rounded-[32px] bg-neutral-950"
          >
            <img
              src="/images/hero/banner3.png"
              alt="NexaCore Service Marketplace"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-10">
              <span className="inline-flex rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-400 backdrop-blur-md">
                Service Marketplace
              </span>

              <h3 className="mt-5 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                Hire trusted technology talent and manage delivery securely.
              </h3>

              <p className="mt-4 max-w-xl leading-7 text-white/65">
                Post projects, receive category-matched proposals, collaborate
                through milestones and approve completed work.
              </p>

              <a
                href="#how-it-works"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-black text-neutral-950 transition hover:bg-red-600 hover:text-white"
              >
                See how hiring works
                <ArrowIcon />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section
      id="categories"
      className="scroll-mt-24 bg-[#f5f5f5] py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* CENTRED HEADING */}
        <SectionHeading
          eyebrow="Technology categories"
          title="Build skills and find services across in-demand fields."
          description="Explore professional technology categories for academy learning, practical projects and client service delivery."
          centered
        />

        <div className="mt-8 flex justify-center">
          <a
            href="#categories"
            className="group inline-flex items-center gap-3 rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-sm font-black text-neutral-950 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
          >
            View every category

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-white transition group-hover:bg-red-600">
              <ArrowIcon className="h-4 w-4" />
            </span>
          </a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.code}
              className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:border-red-200 hover:shadow-[0_25px_70px_rgba(0,0,0,0.13)]"
            >
              <div className="relative h-[235px] overflow-hidden bg-neutral-900">
                <img
                  src={category.image}
                  alt={category.title}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "/images/hero/banner1.png";
                  }}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-black/65 text-xs font-black tracking-wider text-white backdrop-blur-md transition group-hover:bg-red-600">
                  {category.code}
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="text-2xl font-black leading-tight tracking-tight text-white">
                    {category.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm leading-7 text-neutral-600">
                  {category.description}
                </p>

                <a
                  href={category.href}
                  className="group/link mt-auto inline-flex items-center gap-3 pt-7 text-sm font-black text-red-600 transition hover:text-neutral-950"
                >
                  Explore category

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 transition group-hover/link:bg-red-600 group-hover/link:text-white">
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RolesSection() {
  return (
    <section
      id="participants"
      className="scroll-mt-24 bg-white py-24 sm:py-32"
      >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Built for every participant"
          title="A clear experience for every NexaCore user."
          description="Students, tutors, clients and professionals each receive tools designed around their goals."
          centered
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <article
              key={role.title}
              className="group relative min-h-[470px] overflow-hidden rounded-[30px] bg-neutral-950 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.2)]"
            >
              <img
                src={role.image}
                alt={role.title}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/images/hero/banner1.png";
                }}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/25" />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/5" />

              <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-8">
                <span className="inline-flex rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-400 backdrop-blur-md">
                  {role.label}
                </span>

                <h3 className="mt-5 text-3xl font-black tracking-tight text-white">
                  {role.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/65">
                  {role.description}
                </p>

                <a
                  href={role.href}
                  aria-label={`Continue as ${role.title}`}
                  className="mt-7 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition duration-300 hover:border-red-600 hover:bg-red-600"
                >
                  <ArrowIcon className="h-5 w-5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const [activeFlow, setActiveFlow] = useState("learning");

  const steps = activeFlow === "learning" ? learningSteps : hiringSteps;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 overflow-hidden bg-neutral-950 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* CENTRED FULL-WIDTH HEADING */}
        <SectionHeading
          eyebrow="How NexaCore works"
          title="Simple journeys supported by professional tools."
          description="Choose the experience that applies to you and see how NexaCore guides every stage from the first action to the final outcome."
          centered
          light
        />

        {/* CENTRED FLOW SWITCH */}
        <div className="mt-9 flex justify-center">
          <div className="flex w-full max-w-[430px] rounded-full border border-white/15 bg-white/5 p-1.5">
            <button
              type="button"
              onClick={() => setActiveFlow("learning")}
              className={`flex-1 rounded-full px-5 py-3.5 text-sm font-black transition ${
                activeFlow === "learning"
                  ? "bg-red-600 text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              I want to learn
            </button>

            <button
              type="button"
              onClick={() => setActiveFlow("hiring")}
              className={`flex-1 rounded-full px-5 py-3.5 text-sm font-black transition ${
                activeFlow === "hiring"
                  ? "bg-red-600 text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              I want to hire
            </button>
          </div>
        </div>

        {/* STEPS */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <article
              key={`${activeFlow}-${step.number}`}
              className="relative min-h-[270px] rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-red-600/50 hover:bg-white/[0.07]"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">
                {step.number}
              </div>

              <h3 className="mt-7 text-xl font-black text-white">
                {step.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/55">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-950 text-white/30 lg:flex">
                  <ArrowIcon className="h-3.5 w-3.5" />
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TalentSection() {
  return (
    <section
      id="talent"
      className="scroll-mt-24 bg-white py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-12">
        <div className="relative min-h-[580px] overflow-hidden rounded-[34px] bg-neutral-950">
          <img
            src="/images/hero/banner4.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/15 bg-black/50 p-6 backdrop-blur-xl sm:bottom-8 sm:left-8 sm:right-8 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-400">
              Professional opportunities
            </p>

            <p className="mt-3 text-xl font-bold leading-8 text-white sm:text-2xl">
              Let your skills, successful projects and client ratings build
              your professional reputation.
            </p>
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="For talent and graduates"
            title="Build a profile that demonstrates real capability."
            description="NexaCore connects approved skills, academy projects, certificates, client work and professional ratings in one public profile."
          />

          <div className="mt-9 space-y-5">
            {[
              "Receive projects that match your approved skill categories.",
              "Submit proposals with your price, timeline and portfolio evidence.",
              "Manage milestones, deliverables, revisions and approvals.",
              "Display completed projects, certificates and client reviews.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-4">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                  <CheckIcon className="h-4 w-4" />
                </div>

                <p className="leading-7 text-neutral-600">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-neutral-950 px-7 py-4 text-sm font-bold text-white transition hover:bg-red-600"
            >
              Create talent profile
              <ArrowIcon />
            </a>

            <a
              href="/talent"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-7 py-4 text-sm font-bold text-neutral-950 transition hover:border-neutral-950"
            >
              Browse professionals
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-[#f5f5f5] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid overflow-hidden rounded-[36px] bg-red-600 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/65 sm:text-sm">
              NexaCore ecosystem
            </p>

            <h2 className="mt-5 max-w-2xl text-4xl font-black leading-[1.04] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              More than an academy. More than a marketplace.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
              NexaCore is designed to connect learning, mentorship,
              professional proof, trusted hiring and project delivery through
              one structured technology platform.
            </p>

            <a
              href="/about"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
            >
              Learn about NexaCore
              <ArrowIcon />
            </a>
          </div>

          <div className="grid grid-cols-2 border-t border-white/15 lg:border-l lg:border-t-0">
            {[
              ["01", "Learn practical technology skills"],
              ["02", "Build projects and portfolio proof"],
              ["03", "Connect with clients and professionals"],
              ["04", "Deliver work through tracked milestones"],
            ].map(([number, text], index) => (
              <div
                key={number}
                className={`min-h-[210px] p-7 sm:p-9 ${
                  index % 2 === 0 ? "border-r border-white/15" : ""
                } ${index < 2 ? "border-b border-white/15" : ""}`}
              >
                <span className="text-sm font-black tracking-[0.18em] text-white/45">
                  {number}
                </span>

                <p className="mt-12 text-lg font-bold leading-7 text-white">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCallToAction() {
  return (
    <section
      id="get-started"
      className="scroll-mt-24 overflow-hidden bg-neutral-950 py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-[1440px] px-5 text-center sm:px-8 lg:px-12">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500 sm:text-sm">
            Start your NexaCore journey
          </p>

          <h2 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Learn something valuable.
            <span className="block text-red-500">
              Build something meaningful.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
            Join as a student, tutor, client or technology professional and
            access the tools designed for your next step.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-red-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-red-500 sm:text-base"
            >
              Create your account
              <ArrowIcon />
            </a>

            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-black sm:text-base"
            >
              Log in to NexaCore
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
 const footerGroups = [
  {
    title: "Platform",
    links: [
      { label: "About NexaCore", href: "/about" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Academy",
    links: [
      { label: "Browse courses", href: "/courses" },
      { label: "Find tutors", href: "/tutors" },
      { label: "Certificates", href: "/certificates" },
      { label: "Student projects", href: "/student-projects" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { label: "Post a project", href: "/projects/create" },
      { label: "Find talent", href: "/talent" },
      { label: "Browse services", href: "/services" },
      {
        label: "Become a provider",
        href: "/become-a-provider",
      },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "/help" },
      { label: "Safety and trust", href: "/trust" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

  return (
    <footer className="relative overflow-hidden bg-neutral-950 text-white">
      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 pb-8 pt-20 sm:px-8 sm:pt-24 lg:px-12">
        {/* CENTERED FOOTER WRITE UP */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500 sm:text-sm">
            NexaCore Technology Ecosystem
          </p>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
            Learn, hire, teach and deliver through one professional platform.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
            NexaCore connects practical technology education, experienced
            tutors, verified professionals and clients who need reliable
            project delivery.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-red-600"
            >
              Create an account
              <ArrowIcon className="h-5 w-5" />
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-7 py-4 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-black"
            >
              Contact NexaCore
            </a>
          </div>
        </div>

        {/* FOOTER LINKS */}
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/10 pt-12 sm:grid-cols-4 lg:mx-auto lg:max-w-5xl">
          {footerGroups.map((group) => (
            <div key={group.title} className="text-center">
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-white">
                {group.title}
              </h3>

              <div className="mt-5 flex flex-col items-center gap-3">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="relative w-fit text-sm font-medium text-white/50 transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-red-500 after:transition-all after:duration-300 hover:text-white hover:after:w-full"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* LOGO AT THE BOTTOM */}
        <div className="mt-16 border-t border-white/10 pt-10 text-center">
          <a
            href="/"
            aria-label="Go to NexaCore homepage"
            className="inline-flex items-center justify-center transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/images/logo/nexacore-logo-light.png"
              alt="NexaCore"
              className="h-16 w-auto max-w-[260px] object-contain sm:h-20 sm:max-w-[320px]"
            />
          </a>

          <p className="mx-auto mt-6 max-w-xl text-sm font-semibold leading-7 text-white/60">
            Academy. Services. Talent. Project Delivery.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-white/35">
            A professional technology platform for practical learning,
            mentorship, trusted hiring and secure project collaboration.
          </p>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-7 text-center text-xs text-white/35 sm:flex-row sm:gap-5">
          <p>
            © {new Date().getFullYear()} NexaCore. All rights reserved.
          </p>

          <span className="hidden h-1 w-1 rounded-full bg-red-600 sm:block" />

          <p>Built for modern technology learning and professional delivery.</p>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-neutral-950">
      <Navbar />

      <main>
        <HeroSlider />
        <TrustBar />
        <PlatformSection />
        <CategoriesSection />
        <RolesSection />
        <HowItWorksSection />
        <TalentSection />
        <ImpactSection />
        <FinalCallToAction />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  const currentPath = window.location.pathname;

  if (currentPath === "/signup") {
    return <CreateAccount />;
  }

  if (currentPath === "/login") {
    return <Login />;
  }

  if (isStudentPortalPath(currentPath)) {
  return <StudentPortal />;
}

if (isTutorPortalPath(currentPath)) {
  return <TutorPortal />;
}

if (isClientPortalPath(currentPath)) {
  return <ClientPortal />;
}

if (isTalentPortalPath(currentPath)) {
  return <TalentPortal />;
}

  if (currentPath === "/courses") {
    return <CourseCatalog />;
  }

  if (currentPath === "/about") {
    return <About />;
  }

  if (currentPath === "/how-it-works") {
    return <HowItWorks />;
  }

  if (currentPath === "/pricing") {
    return <Pricing />;
  }

  if (currentPath === "/contact") {
    return <Contact />;
  }

  if (platformPagePaths.includes(currentPath)) {
    return <PlatformPages />;
  }

  return <LandingPage />;
}