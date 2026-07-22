import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useTheme,
} from "../../theme/ThemeProvider";

import {
  useLanguage,
} from "../../i18n/LanguageProvider";

function statusMessage(
  status,
  progress,
  error,
) {
  if (status === "translating") {
    return `Translating page… ${progress}%`;
  }

  if (status === "error") {
    return error || "Translation is unavailable.";
  }

  if (status === "ready") {
    return "Language applied to this page.";
  }

  return "English is the default language.";
}

export default function SiteSettingsMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const {
    theme,
    setTheme,
  } = useTheme();

  const {
    language,
    setLanguage,
    languages,
    translationStatus,
    translationProgress,
    translationError,
  } = useLanguage();

  useEffect(() => {
    const closeMenu = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      closeMenu,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeMenu,
      );
    };
  }, []);

  const message = statusMessage(
    translationStatus,
    translationProgress,
    translationError,
  );

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-2xl font-black text-neutral-950 transition hover:border-red-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        aria-label="Open display and language settings"
        aria-expanded={open}
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-[150] max-h-[min(76vh,680px)] w-[320px] overflow-y-auto rounded-3xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">
            Display settings
          </p>

          <div className="mt-5">
            <p className="text-sm font-black text-neutral-900 dark:text-white">
              Theme
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setTheme("light")
                }
                className={`rounded-xl border px-4 py-3 text-xs font-black transition ${
                  theme === "light"
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-neutral-200 text-neutral-800 hover:border-red-600 dark:border-neutral-700 dark:text-white"
                }`}
              >
                Light
              </button>

              <button
                type="button"
                onClick={() =>
                  setTheme("dark")
                }
                className={`rounded-xl border px-4 py-3 text-xs font-black transition ${
                  theme === "dark"
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-neutral-200 text-neutral-800 hover:border-red-600 dark:border-neutral-700 dark:text-white"
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="mt-5 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <label
              htmlFor="site-language"
              className="text-sm font-black text-neutral-900 dark:text-white"
            >
              Language
            </label>

            <select
              id="site-language"
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value,
                )
              }
              data-no-translate
              className="mt-3 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-red-600 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            >
              {languages.map((item) => (
                <option
                  key={item.code}
                  value={item.code}
                >
                  {item.nativeLabel} — {item.label}
                </option>
              ))}
            </select>

            <div
              className={`mt-3 rounded-xl px-3 py-2.5 text-xs leading-5 ${
                translationStatus === "error"
                  ? "bg-red-50 font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
              aria-live="polite"
            >
              {message}
            </div>

            {translationStatus ===
              "translating" && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-full rounded-full bg-red-600 transition-all"
                  style={{
                    width: `${Math.max(
                      4,
                      translationProgress,
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <a
              href="/member/dashboard"
              className="block rounded-xl px-4 py-3 text-sm font-black text-neutral-800 transition hover:bg-red-50 hover:text-red-600 dark:text-white dark:hover:bg-red-950/30"
            >
              My dashboard
            </a>

            <a
              href="/login"
              className="mt-1 block rounded-xl px-4 py-3 text-sm font-black text-neutral-800 transition hover:bg-red-50 hover:text-red-600 dark:text-white dark:hover:bg-red-950/30"
            >
              Account access
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
