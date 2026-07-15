import { useState, useEffect } from "react";

export interface UserSession {
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // MOCK AUTH: In a real app, this would verify a token with the backend
    const saved = localStorage.getItem("asmo_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  const login = (userData: UserSession) => {
    // MOCK AUTH: In a real app, this would be an API call returning a session
    setUser(userData);
    localStorage.setItem("asmo_user", JSON.stringify(userData));
  };

  const logout = () => {
    // MOCK AUTH: Clear local session
    setUser(null);
    localStorage.removeItem("asmo_user");
  };

  return { user, login, logout, isLoaded };
}
