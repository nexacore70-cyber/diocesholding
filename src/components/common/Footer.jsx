import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

const platformLinks = [
  { label: "About NexaCore", path: "/about" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Pricing", path: "/pricing" },
  { label: "Find Talent", path: "/talent" },
];

const academyLinks = [
  { label: "Browse Courses", path: "/academy" },
  { label: "Find Tutors", path: "/tutors" },
  { label: "Certificates", path: "/certificates" },
  { label: "Internships", path: "/internships" },
];

const serviceLinks = [
  { label: "Browse Services", path: "/services" },
  { label: "Post a Project", path: "/register" },
  { label: "Join as Talent", path: "/register" },
  { label: "Project Protection", path: "/how-it-works" },
];

const supportLinks = [
  { label: "Help Center", path: "/help" },
  { label: "Contact Support", path: "/contact" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
];

function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">
        {title}
      </h3>

      <div className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.path + link.label}
            to={link.path}
            className="w-fit text-sm text-white/55 transition hover:translate-x-1 hover:text-[#D90404]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#080808] text-white">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#D90404]/15 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#D90404]/10 blur-[120px]" />

      <div className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#D90404]">
              Build with NexaCore
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
              Learn new skills, hire trusted talent and deliver stronger
              technology projects.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-full bg-[#D90404] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-red-700"
            >
              Create Account
            </Link>

            <Link
              to="/contact"
              className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#080808]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <Link to="/" className="inline-flex items-center">
            <img
              src="/images/logo/nexacore-logo-light.png"
              alt="NexaCore"
              className="h-16 w-auto max-w-[230px] object-contain"
            />
          </Link>

          <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
            NexaCore brings technology education, professional services,
            verified talent, secure collaboration and project delivery into
            one connected platform.
          </p>

          <div className="mt-7 space-y-4 text-sm text-white/60">
            <a
              href="mailto:hello@nexacore.com"
              className="flex w-fit items-center gap-3 transition hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#D90404]">
                <Mail size={17} />
              </span>

              hello@nexacore.com
            </a>

            <a
              href="tel:+2340000000000"
              className="flex w-fit items-center gap-3 transition hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#D90404]">
                <Phone size={17} />
              </span>

              +234 000 000 0000
            </a>

            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#D90404]">
                <MapPin size={17} />
              </span>

              Nigeria
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <a
              href="#"
              aria-label="NexaCore on Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#D90404] hover:bg-[#D90404] hover:text-white"
            >
              <Facebook size={17} />
            </a>

            <a
              href="#"
              aria-label="NexaCore on Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#D90404] hover:bg-[#D90404] hover:text-white"
            >
              <Instagram size={17} />
            </a>

            <a
              href="#"
              aria-label="NexaCore on LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#D90404] hover:bg-[#D90404] hover:text-white"
            >
              <Linkedin size={17} />
            </a>

            <a
              href="#"
              aria-label="NexaCore on Twitter"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:border-[#D90404] hover:bg-[#D90404] hover:text-white"
            >
              <Twitter size={17} />
            </a>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
          <FooterLinkGroup title="Platform" links={platformLinks} />
          <FooterLinkGroup title="Academy" links={academyLinks} />
          <FooterLinkGroup title="Services" links={serviceLinks} />
          <FooterLinkGroup title="Support" links={supportLinks} />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} NexaCore. All rights reserved.</p>

          <p>Academy. Services. Talent. Project Delivery.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;