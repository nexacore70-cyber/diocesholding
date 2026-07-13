(function () {
  try {
    var key = "nexacore_theme_v1";
    var stored = localStorage.getItem(key);
    var theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia &&
            window.matchMedia(
              "(prefers-color-scheme: dark)",
            ).matches
          ? "dark"
          : "light";

    document.documentElement.classList.toggle(
      "dark",
      theme === "dark",
    );

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.dataset.theme =
      "light";
  }
})();
