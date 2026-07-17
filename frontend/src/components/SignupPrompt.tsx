"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

export default function SignupPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if previously dismissed
    const dismissed = localStorage.getItem("asmo_signup_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Simulate usage timer (e.g., 10 seconds)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("asmo_signup_dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm"
        >
          <div className="mx-4 p-4 rounded-xl shadow-2xl bg-muted/95 backdrop-blur-md border border-border flex flex-col gap-3">
            <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="pr-6">
              <h3 className="font-semibold text-foreground">Save your preferences?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create an account to securely save your settings.
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <Link 
                href="/profile"
                onClick={() => setIsVisible(false)}
                className="flex-1 inline-flex h-9 items-center justify-center rounded-md bg-accent text-sm font-medium text-accent-foreground shadow transition-colors hover:bg-accent/90"
              >
                Create an account
              </Link>
              <button 
                onClick={handleDismiss}
                className="flex-1 inline-flex h-9 items-center justify-center rounded-md border border-border bg-transparent text-sm font-medium transition-colors hover:bg-muted/50 cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
