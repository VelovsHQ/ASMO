"use client";

import { useInterests } from "@/hooks/useInterests";
import MarketPulseScore from "@/components/MarketPulseScore";
import GlobalMarketPulse from "@/components/GlobalMarketPulse";
import { generateMockMarketSignal } from "@/lib/mockData";
import Link from "next/link";
import { useMemo } from "react";
import { Flame, PieChart, Activity } from "lucide-react";

export default function DashboardPage() {
  const { interests, isLoaded } = useInterests();

  // Generate stable mock data based on interests
  const signals = useMemo(() => {
    return interests.map((interest) => generateMockMarketSignal(interest));
  }, [interests]);

  if (!isLoaded) return null;

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 max-w-7xl mx-auto w-full pb-32">
      {/* Top Section */}
      <section className="flex flex-col gap-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Hello, User
        </h1>
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-border bg-muted/20 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PieChart size={18} />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Today's Market Mood</h2>
            </div>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-3xl font-bold text-bullish tracking-tight">68%</span>
              <span className="text-muted-foreground font-medium mb-1">Bullish</span>
              <div className="h-4 w-px bg-border mx-2 mb-1" />
              <span className="text-lg font-semibold text-foreground mb-0.5">82%</span>
              <span className="text-muted-foreground text-sm mb-1">Confidence</span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-border bg-muted/20 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Flame size={18} className="text-orange-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Top Event</h2>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-xl font-bold text-foreground">Fed Interest Rate Decision</span>
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <Activity size={14} /> High Volatility Expected at 14:00 EST
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Global Market Pulse Section */}
      <GlobalMarketPulse />

      {/* Your Markets Section */}
      <section className="flex flex-col gap-4 mt-2">
        <h2 className="text-xl font-semibold tracking-tight">Your Markets</h2>
        {interests.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-xl bg-muted/10">
            <p className="text-muted-foreground mb-4">You haven't selected any interests yet.</p>
            <Link href="/onboarding" className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground shadow hover:bg-accent/90 transition-colors">
              Select Interests
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {signals.map((signal) => (
              <Link key={signal.symbol} href={`/markets/${signal.symbol}`} className="block h-full group">
                <div className="h-full transition-transform duration-200 group-hover:-translate-y-1">
                  <MarketPulseScore signal={signal} size="compact" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
