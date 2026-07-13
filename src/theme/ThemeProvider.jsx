import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const THEME_STORAGE_KEY = "nexacore_theme_v1";

const ThemeContext = createContext(null);

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(
    THEME_STORAGE_KEY,
  );

  if (
    savedTheme === "light" ||
    savedTheme === "dark"
  ) {
    return savedTheme;
  }

  return "light";
}

function applyTheme(theme) {
  const root = document.documentElement;
  const dark = theme === "dark";

  root.classList.toggle("dark", dark);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export default function ThemeProvider({
  children,
}) {
  const [theme, setTheme] = useState(
    getInitialTheme,
  );

  useEffect(() => {
    applyTheme(theme);

    try {
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        theme,
      );
    } catch {
      // The theme still works for the current page.
    }
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (
        event.key === THEME_STORAGE_KEY &&
        (event.newValue === "light" ||
          event.newValue === "dark")
      ) {
        setTheme(event.newValue);
      }
    };

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme: () =>
        setTheme((current) =>
          current === "dark" ? "light" : "dark",
        ),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider.",
    );
  }

  return context;
}

export {
  THEME_STORAGE_KEY,
};
