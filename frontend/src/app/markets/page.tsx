"use client";

import { generateMockMarketSignal } from "@/lib/mockData";
import MarketPulseScore from "@/components/MarketPulseScore";
import Heatmap from "@/components/Heatmap";
import Link from "next/link";
import { useMemo } from "react";
import { Newspaper } from "lucide-react";

const ALL_MARKETS = [
  "Gold", "Oil", "Bitcoin", "NASDAQ", "AI Stocks", 
  "Apple", "Microsoft", "Sri Lankan Stocks", "Forex", "Crypto"
];

export default function MarketsPage() {
  const signals = useMemo(() => {
    return ALL_MARKETS.map(name => generateMockMarketSignal(name));
  }, []);

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 max-w-7xl mx-auto w-full pb-32">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            All Markets
          </h1>
          <Link href="/digest" className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted/50 transition-colors w-full sm:w-auto whitespace-nowrap">
            <Newspaper className="w-4 h-4" />
            Today's Summary
          </Link>
        </div>
        <p className="text-muted-foreground">
          Browse and monitor live signals across all available markets.
        </p>
      </section>
      <section>
        <Heatmap />
      </section>

      <div className="h-px bg-border/50 w-full" />

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight">Market Directory</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {signals.map((signal) => (
          <Link key={signal.symbol} href={`/markets/${signal.symbol}`} className="block h-full group">
            <div className="h-full transition-transform duration-200 group-hover:-translate-y-1">
              <MarketPulseScore signal={signal} size="compact" />
            </div>
          </Link>
        ))}
        </div>
      </section>
    </div>
  );
}
