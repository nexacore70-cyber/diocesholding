import { useEffect } from "react";

const STORAGE_KEY =
  "nexacore_scroll_positions_v1";

function getPageKey() {
  return `${window.location.pathname}${window.location.search}`;
}

function readPositions() {
  try {
    const stored = sessionStorage.getItem(
      STORAGE_KEY,
    );

    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function savePosition() {
  try {
    const positions = readPositions();

    positions[getPageKey()] = {
      x: window.scrollX,
      y: window.scrollY,
    };

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(positions),
    );
  } catch {
    // Ignore browser-storage errors.
  }
}

export default function ScrollRestoration() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const restorePosition = () => {
      if (window.location.hash) {
        const id = decodeURIComponent(
          window.location.hash.substring(1),
        );

        const section =
          document.getElementById(id);

        if (section) {
          section.scrollIntoView({
            behavior: "auto",
            block: "start",
          });
        }

        return;
      }

      const positions = readPositions();
      const saved = positions[getPageKey()];

      window.scrollTo({
        top: saved?.y || 0,
        left: saved?.x || 0,
        behavior: "auto",
      });
    };

    const saveBeforeNavigation = () => {
      savePosition();
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(restorePosition);
    });

    const timerOne = setTimeout(
      restorePosition,
      200,
    );

    const timerTwo = setTimeout(
      restorePosition,
      700,
    );

    window.addEventListener(
      "pagehide",
      saveBeforeNavigation,
    );

    window.addEventListener(
      "beforeunload",
      saveBeforeNavigation,
    );

    document.addEventListener(
      "click",
      saveBeforeNavigation,
      true,
    );

    return () => {
      clearTimeout(timerOne);
      clearTimeout(timerTwo);

      window.removeEventListener(
        "pagehide",
        saveBeforeNavigation,
      );

      window.removeEventListener(
        "beforeunload",
        saveBeforeNavigation,
      );

      document.removeEventListener(
        "click",
        saveBeforeNavigation,
        true,
      );
    };
  }, []);

  return null;
}