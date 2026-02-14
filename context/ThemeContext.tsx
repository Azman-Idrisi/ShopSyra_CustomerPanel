import { createContext, ReactNode, useContext, useMemo } from "react";

type ThemeColors = {
  mode: "dark";
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  pinkish: string;
  primarySoft: string;
  gradientA: string;
  gradientB: string;
  shadow: string;
};

type ThemeContextType = {
  theme: ThemeColors;
  isDark: true;
  toggleTheme: () => void;
};

const darkTheme: ThemeColors = {
  mode: "dark",
  background: "#0D0F17",
  surface: "#161A26",
  surfaceAlt: "#1E2433",
  text: "#F4F5FA",
  textMuted: "#A4A8B7",
  border: "#2A3040",
  pinkish: "#ca3bd1",
  primarySoft: "#202538",
  gradientA: "rgba(40,48,74,0.5)",
  gradientB: "rgba(29,34,53,0.5)",
  shadow: "rgba(0, 0, 0, 0.35)",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ThemeContextType>(
    () => ({
      theme: darkTheme,
      isDark: true,
      toggleTheme: () => {},
    }),
    [],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
