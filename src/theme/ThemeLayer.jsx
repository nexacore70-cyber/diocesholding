import ThemeProvider from "./ThemeProvider";
import ThemeToggle from "./ThemeToggle";

export default function ThemeLayer({
  children,
}) {
  return (
    <ThemeProvider>
      {children}
      <ThemeToggle />
    </ThemeProvider>
  );
}