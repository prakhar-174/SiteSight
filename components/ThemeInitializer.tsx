"use client";

import { useThemeStore } from "@/store/themeStore";
import { useEffect } from "react";

export function ThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Remove existing theme classes to avoid duplicates
    document.documentElement.classList.remove("light", "dark");
    // Add current theme class
    document.documentElement.classList.add(theme);
  }, [theme]);

  return null;
}
