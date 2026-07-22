import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const LANGUAGE_STORAGE_KEY =
  "nexacore_language_v2";

export const siteLanguages = [
  { code: "en", translatorCode: "en", label: "English", nativeLabel: "English" },
  { code: "fr", translatorCode: "fr", label: "French", nativeLabel: "Français" },
  { code: "es", translatorCode: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "pt", translatorCode: "pt", label: "Portuguese", nativeLabel: "Português" },
  { code: "de", translatorCode: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "it", translatorCode: "it", label: "Italian", nativeLabel: "Italiano" },
  { code: "nl", translatorCode: "nl", label: "Dutch", nativeLabel: "Nederlands" },
  { code: "ar", translatorCode: "ar", label: "Arabic", nativeLabel: "العربية", direction: "rtl" },
  { code: "bg", translatorCode: "bg", label: "Bulgarian", nativeLabel: "Български" },
  { code: "bn", translatorCode: "bn", label: "Bengali", nativeLabel: "বাংলা" },
  { code: "cs", translatorCode: "cs", label: "Czech", nativeLabel: "Čeština" },
  { code: "da", translatorCode: "da", label: "Danish", nativeLabel: "Dansk" },
  { code: "el", translatorCode: "el", label: "Greek", nativeLabel: "Ελληνικά" },
  { code: "fi", translatorCode: "fi", label: "Finnish", nativeLabel: "Suomi" },
  { code: "hi", translatorCode: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "hr", translatorCode: "hr", label: "Croatian", nativeLabel: "Hrvatski" },
  { code: "hu", translatorCode: "hu", label: "Hungarian", nativeLabel: "Magyar" },
  { code: "id", translatorCode: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia" },
  { code: "he", translatorCode: "iw", label: "Hebrew", nativeLabel: "עברית", direction: "rtl" },
  { code: "ja", translatorCode: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "kn", translatorCode: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { code: "ko", translatorCode: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "lt", translatorCode: "lt", label: "Lithuanian", nativeLabel: "Lietuvių" },
  { code: "mr", translatorCode: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { code: "no", translatorCode: "no", label: "Norwegian", nativeLabel: "Norsk" },
  { code: "pl", translatorCode: "pl", label: "Polish", nativeLabel: "Polski" },
  { code: "ro", translatorCode: "ro", label: "Romanian", nativeLabel: "Română" },
  { code: "ru", translatorCode: "ru", label: "Russian", nativeLabel: "Русский" },
  { code: "sk", translatorCode: "sk", label: "Slovak", nativeLabel: "Slovenčina" },
  { code: "sl", translatorCode: "sl", label: "Slovenian", nativeLabel: "Slovenščina" },
  { code: "sv", translatorCode: "sv", label: "Swedish", nativeLabel: "Svenska" },
  { code: "ta", translatorCode: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "te", translatorCode: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "th", translatorCode: "th", label: "Thai", nativeLabel: "ไทย" },
  { code: "tr", translatorCode: "tr", label: "Turkish", nativeLabel: "Türkçe" },
  { code: "uk", translatorCode: "uk", label: "Ukrainian", nativeLabel: "Українська" },
  { code: "vi", translatorCode: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
  { code: "zh", translatorCode: "zh", label: "Chinese (Simplified)", nativeLabel: "简体中文" },
  { code: "zh-Hant", translatorCode: "zh-Hant", label: "Chinese (Traditional)", nativeLabel: "繁體中文" },

  // These languages use the optional translation backend when the browser
  // does not provide a native language pack.
  { code: "ha", translatorCode: "ha", label: "Hausa", nativeLabel: "Hausa", backendOnly: true },
  { code: "yo", translatorCode: "yo", label: "Yoruba", nativeLabel: "Yorùbá", backendOnly: true },
  { code: "ig", translatorCode: "ig", label: "Igbo", nativeLabel: "Igbo", backendOnly: true },
  { code: "sw", translatorCode: "sw", label: "Swahili", nativeLabel: "Kiswahili", backendOnly: true },
  { code: "am", translatorCode: "am", label: "Amharic", nativeLabel: "አማርኛ", backendOnly: true },
  { code: "so", translatorCode: "so", label: "Somali", nativeLabel: "Soomaali", backendOnly: true },
  { code: "zu", translatorCode: "zu", label: "Zulu", nativeLabel: "isiZulu", backendOnly: true },
  { code: "af", translatorCode: "af", label: "Afrikaans", nativeLabel: "Afrikaans", backendOnly: true },
  { code: "fa", translatorCode: "fa", label: "Persian", nativeLabel: "فارسی", direction: "rtl", backendOnly: true },
  { code: "ur", translatorCode: "ur", label: "Urdu", nativeLabel: "اردو", direction: "rtl", backendOnly: true },
  { code: "pa", translatorCode: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", backendOnly: true },
  { code: "ms", translatorCode: "ms", label: "Malay", nativeLabel: "Bahasa Melayu", backendOnly: true },
  { code: "fil", translatorCode: "fil", label: "Filipino", nativeLabel: "Filipino", backendOnly: true },
];

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const saved = window.localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    );

    return siteLanguages.some(
      (item) => item.code === saved,
    )
      ? saved
      : "en";
  } catch {
    return "en";
  }
}

export default function LanguageProvider({
  children,
}) {
  const [language, setLanguage] = useState(
    getInitialLanguage,
  );
  const [translationStatus, setTranslationStatus] =
    useState("idle");
  const [translationProgress, setTranslationProgress] =
    useState(0);
  const [translationError, setTranslationError] =
    useState("");

  const currentLanguage =
    siteLanguages.find(
      (item) => item.code === language,
    ) || siteLanguages[0];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir =
      currentLanguage.direction || "ltr";

    try {
      window.localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        language,
      );
    } catch {
      // Language still works for the current browser tab.
    }
  }, [language, currentLanguage.direction]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      currentLanguage,
      languages: siteLanguages,
      translationStatus,
      setTranslationStatus,
      translationProgress,
      setTranslationProgress,
      translationError,
      setTranslationError,
    }),
    [
      language,
      currentLanguage,
      translationStatus,
      translationProgress,
      translationError,
    ],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider.",
    );
  }

  return context;
}
