"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  children,
}: {
  attribute?: string;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      return (localStorage.getItem("theme") as Theme | null) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    theme === "system" && enableSystem ? getSystemTheme() : (theme as ResolvedTheme)
  );

  useEffect(() => {
    function updateSystem() {
      if (theme === "system" && enableSystem) {
        setResolvedTheme(getSystemTheme());
      } else {
        setResolvedTheme(theme as ResolvedTheme);
      }
    }
    updateSystem();
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", updateSystem);
    return () => mql.removeEventListener("change", updateSystem);
  }, [theme, enableSystem]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem("theme", newTheme);
      } catch {}
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const html = document.documentElement;
    if (attribute === "class") {
      html.classList.remove("light", "dark");
      html.classList.add(resolvedTheme);
    } else {
      html.setAttribute(attribute, resolvedTheme);
    }
    if (!disableTransitionOnChange) {
      html.classList.add("transition-colors");
    }
  }, [resolvedTheme, attribute, disableTransitionOnChange]);

  useEffect(() => {
    const html = document.documentElement;
    html.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
