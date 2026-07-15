import { useState, useEffect } from "react";

export interface Settings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  alertUrgent: boolean;
  alertHot: boolean;
  alertWatch: boolean;
  theme: "dark" | "light";
  density: "comfortable" | "compact";
}

const DEFAULT_SETTINGS: Settings = {
  pushEnabled: true,
  emailEnabled: false,
  alertUrgent: true,
  alertHot: true,
  alertWatch: false,
  theme: "dark",
  density: "comfortable"
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("asmo_settings");
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem("asmo_settings", JSON.stringify(newSettings));
  };

  return { settings, updateSettings, isLoaded };
}
