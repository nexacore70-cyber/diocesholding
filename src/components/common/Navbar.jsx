import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Academy", path: "/academy" },
  { label: "Services", path: "/services" },
  { label: "Find Talent", path: "/talent" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Contact", path: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive
        ? "text-[#D90404]"
        : "text-white/80 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-[100] border-b border-white/10 bg-[#080808]/95 text-white backdrop-blur-xl">
      <nav className="mx-auto flex h-[82px] max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link
          to="/"
          className="flex items-center"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="/images/logo/nexacore-logo-light.png"
            alt="NexaCore"
            className="h-12 w-auto max-w-[190px] object-contain"
          />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition hover:border-white hover:bg-white hover:text-[#080808]"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="rounded-full bg-[#D90404] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/15 p-2 lg:hidden"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#080808] px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="grid gap-3 border-t border-white/10 pt-5">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-white/30 px-5 py-3 text-center text-sm font-bold"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-[#D90404] px-5 py-3 text-center text-sm font-bold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;