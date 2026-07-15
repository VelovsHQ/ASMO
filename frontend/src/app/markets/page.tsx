"use client";

import { generateMockMarketSignal } from "@/lib/mockData";
import MarketPulseScore from "@/components/MarketPulseScore";
import Link from "next/link";
import { useMemo } from "react";

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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          All Markets
        </h1>
        <p className="text-muted-foreground">
          Browse and monitor live signals across all available markets.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {signals.map((signal) => (
          <Link key={signal.symbol} href={`/markets/${signal.symbol}`} className="block h-full group">
            <div className="h-full transition-transform duration-200 group-hover:-translate-y-1">
              <MarketPulseScore signal={signal} size="compact" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
