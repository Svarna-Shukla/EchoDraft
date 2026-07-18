import { useCallback, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "pitchr:theme";

// Reads the previously saved theme from localStorage, defaulting to dark
function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

// Tracks the active app theme (dark/light), persisted across visits
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  // Flips between dark and light and persists the choice
  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage unavailable — theme still switches for this session
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
