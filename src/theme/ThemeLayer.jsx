import ThemeProvider from "./ThemeProvider";

export default function ThemeLayer({
  children,
}) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}