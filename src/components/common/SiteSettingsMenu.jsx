import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useTheme,
} from "../../theme/ThemeProvider";

const LANGUAGE_KEY =
  "nexacore_language_v1";

const languages = [
  {
    code: "en",
    label: "English",
  },
  {
    code: "fr",
    label: "Français",
  },
  {
    code: "es",
    label: "Español",
  },
  {
    code: "pt",
    label: "Português",
  },
];

export default function SiteSettingsMenu() {
  const [open, setOpen] = useState(false);

  const [language, setLanguage] = useState(
    () =>
      window.localStorage.getItem(
        LANGUAGE_KEY,
      ) || "en",
  );

  const menuRef = useRef(null);

  const {
    theme,
    setTheme,
  } = useTheme();

  useEffect(() => {
    document.documentElement.lang = language;

    window.localStorage.setItem(
      LANGUAGE_KEY,
      language,
    );

    window.dispatchEvent(
      new CustomEvent(
        "nexacore-language-change",
        {
          detail: {
            language,
          },
        },
      ),
    );
  }, [language]);

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
        className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-2xl font-black text-neutral-950 hover:border-red-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        aria-label="Open settings"
        aria-expanded={open}
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-[150] w-[300px] rounded-3xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
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
                className={`rounded-xl border px-4 py-3 text-xs font-black ${
                  theme === "light"
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-neutral-200 dark:border-neutral-700"
                }`}
              >
                Light
              </button>

              <button
                type="button"
                onClick={() =>
                  setTheme("dark")
                }
                className={`rounded-xl border px-4 py-3 text-xs font-black ${
                  theme === "dark"
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-neutral-200 dark:border-neutral-700"
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
              className="mt-3 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-red-600 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
            >
              {languages.map((item) => (
                <option
                  key={item.code}
                  value={item.code}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <a
              href="/member/dashboard"
              className="block rounded-xl px-4 py-3 text-sm font-black hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
            >
              My dashboard
            </a>

            <a
              href="/login"
              className="mt-1 block rounded-xl px-4 py-3 text-sm font-black hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
            >
              Account access
            </a>
          </div>
        </div>
      )}
    </div>
  );
}