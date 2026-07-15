"use client";

import { useState, useEffect } from "react";

export function useInterests() {
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("asmo_interests");
      if (stored) {
        setInterests(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse interests from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  const toggleInterest = (interest: string) => {
    setInterests((prev) => {
      const newInterests = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest];
      
      try {
        localStorage.setItem("asmo_interests", JSON.stringify(newInterests));
      } catch (e) {
        console.error("Failed to save interests", e);
      }
      return newInterests;
    });
  };

  return { interests, toggleInterest, isLoaded };
}
