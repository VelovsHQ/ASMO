import { useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "JD",
  memberSince: "July 2023"
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("asmo_profile");
    if (saved) {
      try {
        setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(saved) });
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    localStorage.setItem("asmo_profile", JSON.stringify(newProfile));
  };

  return { profile, updateProfile, isLoaded };
}
