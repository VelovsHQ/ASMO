"use client";

import { useInterests } from "@/hooks/useInterests";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const OPTIONS = [
  "Gold", "Oil", "Bitcoin", "NASDAQ", "AI Stocks", 
  "Apple", "Microsoft", "Sri Lankan Stocks", "Forex", "Crypto"
];

export default function OnboardingPage() {
  const { interests, toggleInterest, isLoaded } = useInterests();
  const router = useRouter();

  if (!isLoaded) return null; // Avoid hydration mismatch

  const canContinue = interests.length > 0;

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 bg-background h-[calc(100vh-4rem)]">
      <div className="w-full max-w-2xl text-center space-y-8 mt-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          What do you care about?
        </h1>
        <p className="text-muted-foreground text-lg">
          Select the markets and assets you want to monitor.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 py-8">
          {OPTIONS.map((option) => {
            const isSelected = interests.includes(option);
            return (
              <button
                key={option}
                onClick={() => toggleInterest(option)}
                className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? "bg-accent text-accent-foreground border-accent shadow-md scale-105"
                    : "bg-muted text-muted-foreground border-transparent hover:border-border hover:bg-muted/80"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="pt-4 h-16">
          {canContinue && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => router.push("/dashboard")}
              className="inline-flex h-12 items-center justify-center rounded-md bg-foreground px-10 text-sm font-medium text-background shadow transition-colors hover:bg-foreground/90 cursor-pointer"
            >
              Continue
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
