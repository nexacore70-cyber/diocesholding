export function ArrowIcon({
  className = "",
}) {
  return (
    <svg
      width="20"
      height="20"
      className={`shrink-0 ${className}`}
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

export function CheckIcon({ className = "h-4 w-4" }) {
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

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
  light = false,
}) {
  return (
    <div
      className={`w-full ${
        centered
          ? "mx-auto max-w-5xl text-center"
          : "max-w-4xl text-left"
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
        className={`text-[clamp(2.5rem,5vw,4.7rem)] font-black leading-[1.04] tracking-[-0.045em] ${
          light ? "text-white" : "text-neutral-950"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-6 text-base leading-8 sm:text-lg ${
            centered ? "mx-auto max-w-3xl" : "max-w-3xl"
          } ${light ? "text-white/60" : "text-neutral-600"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

const pageLinks = [
  { label: "About", href: "/about" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function PublicPageLayout({
  bannerImage,
  eyebrow,
  title,
  highlight,
  description,
  children,
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-neutral-950">
      {/* PAGE BANNER */}
      <section className="relative min-h-[540px] overflow-hidden bg-neutral-950">
        <img
          src={bannerImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/55" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/15 blur-[150px]" />

        {/* PAGE NAVIGATION */}
        <header className="relative z-20 border-b border-white/10 bg-black/25 backdrop-blur-xl">
          <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
            <a
              href="/"
              aria-label="Go to NexaCore homepage"
              className="inline-flex items-center transition duration-300 hover:scale-105"
            >
              <img
                src="/images/logo/nexacore-logo-light.png"
                alt="NexaCore"
                className="h-14 w-auto max-w-[245px] object-contain"
              />
            </a>

            <nav className="hidden items-center gap-7 lg:flex">
              {pageLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative py-3 text-sm font-bold text-white transition hover:text-red-400 after:absolute after:bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 after:transition-all hover:after:w-full"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="hidden rounded-full border border-white/40 bg-black/25 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black sm:inline-flex"
              >
                Log in
              </a>

              <a
                href="/signup"
                className="rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-red-600"
              >
                Create account
              </a>
            </div>
          </div>
        </header>

        {/* BANNER CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[452px] max-w-[1440px] items-center justify-center px-5 pb-24 pt-16 text-center sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-red-500" />

              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-400 sm:text-sm">
                {eyebrow}
              </p>

              <span className="h-px w-10 bg-red-500" />
            </div>

            <h1 className="mt-6 text-[clamp(3rem,6vw,5.6rem)] font-black leading-[1] tracking-[-0.05em] text-white">
              {title}

              {highlight && (
                <span className="mt-2 block text-red-500">
                  {highlight}
                </span>
              )}
            </h1>

            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              {description}
            </p>
          </div>
        </div>
      </section>

      <main>{children}</main>

      {/* FOOTER */}
      <footer className="bg-neutral-950 px-5 py-16 text-center text-white sm:px-8">
        <a
          href="/"
          aria-label="Go to NexaCore homepage"
          className="inline-flex transition hover:scale-105"
        >
          <img
            src="/images/logo/nexacore-logo-light.png"
            alt="NexaCore"
            className="h-16 w-auto max-w-[280px] object-contain"
          />
        </a>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/50">
          A professional technology academy and service marketplace for
          learning, teaching, hiring and project delivery.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {pageLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-bold text-white/55 transition hover:text-red-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-5xl border-t border-white/10 pt-7">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} NexaCore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}