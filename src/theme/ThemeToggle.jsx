import { useTheme } from "./ThemeProvider";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M20 15.3A8.5 8.5 0 0 1 8.7 4a8.5 8.5 0 1 0 11.3 11.3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ThemeToggle({
  placement = "fixed",
}) {
  const {
    theme,
    isDark,
    toggleTheme,
  } = useTheme();

  const placementClass =
    placement === "inline"
      ? ""
      : "fixed bottom-5 right-5 z-[120] sm:bottom-7 sm:right-7";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${
        isDark ? "light" : "dark"
      } theme`}
      aria-pressed={isDark}
      title={`Current theme: ${theme}`}
      className={`nexacore-theme-toggle ${placementClass} inline-flex h-12 items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 text-sm font-black text-neutral-950 shadow-[0_14px_50px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-600/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>

      <span className="hidden pr-1 sm:inline">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
