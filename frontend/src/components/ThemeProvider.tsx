"use client";

import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";

export default function ThemeProvider() {
  const { settings, isLoaded } = useSettings();

  useEffect(() => {
    if (isLoaded) {
      if (settings.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [settings.theme, isLoaded]);

  return null;
}
