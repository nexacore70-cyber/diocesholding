import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import ScrollRestoration from "./ScrollRestoration.jsx";
import ThemeLayer from "./theme/ThemeLayer.jsx";
import LanguageProvider from "./i18n/LanguageProvider.jsx";
import AutoPageTranslator from "./i18n/AutoPageTranslator.jsx";

import "./index.css";
import "./theme/theme.css";

createRoot(
  document.getElementById("root"),
).render(
  <StrictMode>
    <ThemeLayer>
      <LanguageProvider>
        <ScrollRestoration />
        <App />
        <AutoPageTranslator />
      </LanguageProvider>
    </ThemeLayer>
  </StrictMode>,
);
