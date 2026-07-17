"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type MarketState = "bullish" | "bearish" | "neutral";

interface Market {
  id: string;
  name: string;
  price: number;
  changePercent: number;
  state: MarketState;
  updatedAt: number;
}

const initialMarkets: Market[] = [
  { id: "gold", name: "Gold", price: 2345.6, changePercent: 0.45, state: "bullish", updatedAt: Date.now() },
  { id: "btc", name: "BTC", price: 64230.0, changePercent: -1.2, state: "bearish", updatedAt: Date.now() },
  { id: "ndx", name: "NASDAQ", price: 16750.2, changePercent: 1.1, state: "bullish", updatedAt: Date.now() },
  { id: "spx", name: "S&P 500", price: 5240.1, changePercent: 0.8, state: "bullish", updatedAt: Date.now() },
  { id: "oil", name: "Oil", price: 78.5, changePercent: -0.2, state: "bearish", updatedAt: Date.now() },
];

export default function LiveMarkets() {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) =>
        prev.map((market) => {
          // 30% chance to update this specific market in this tick
          if (Math.random() > 0.3) return market;

          const jitter = (Math.random() - 0.5) * (market.price * 0.001); // 0.1% jitter
          const newPrice = market.price + jitter;

          // Calculate new change percent slightly adjusted
          const changeJitter = (Math.random() - 0.5) * 0.1;
          const newChange = market.changePercent + changeJitter;

          let newState: MarketState = "neutral";
          if (newChange > 0.05) newState = "bullish";
          else if (newChange < -0.05) newState = "bearish";

          return {
            ...market,
            price: newPrice,
            changePercent: newChange,
            state: newState,
            updatedAt: Date.now(),
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto mt-12 mb-24 px-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Live Markets Preview</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bullish opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bullish"></span>
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {markets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </section>
  );
}

function MarketCard({ market }: { market: Market }) {
  const isBullish = market.state === "bullish";
  const isBearish = market.state === "bearish";

  const colorClass = isBullish
    ? "text-bullish"
    : isBearish
      ? "text-bearish"
      : "text-neutral";

  return (
    <motion.div
      key={market.updatedAt}
      initial={{ backgroundColor: "var(--color-muted)", scale: 1 }}
      animate={{
        backgroundColor: ["var(--color-muted)", isBullish ? "rgba(34, 197, 94, 0.1)" : isBearish ? "rgba(239, 68, 68, 0.1)" : "rgba(234, 179, 8, 0.1)", "var(--color-muted)"],
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col p-4 rounded-lg border border-border bg-muted/50 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-semibold text-foreground">{market.name}</span>
      </div>

      <div className="flex flex-col gap-1 mt-auto">
        <span className="text-2xl font-mono tracking-tight font-bold text-foreground">
          {market.price < 100 ? market.price.toFixed(2) : market.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={`text-sm font-medium ${colorClass}`}>
          {market.changePercent > 0 ? "+" : ""}{market.changePercent.toFixed(2)}%
        </span>
      </div>
    </motion.div>
  );
}
