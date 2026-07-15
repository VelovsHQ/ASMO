"use client";

import { useState } from "react";
import { getNewsDrivers, NewsDriver } from "@/lib/mockData";
import { ChevronDown, ChevronRight, TrendingDown, TrendingUp, Minus, Clock, Newspaper, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function formatMs(ms: number) {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
}

function DriverCard({ driver, isExpanded, onToggle }: { driver: NewsDriver; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="border border-border bg-background rounded-xl overflow-hidden transition-all duration-200">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors focus:outline-none"
      >
        <div className="flex flex-col items-start gap-2">
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground text-left leading-tight">
            {driver.theme}
          </h2>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {formatMs(driver.lastUpdatedMsAgo)}</span>
            <span className="flex items-center gap-1.5"><Newspaper size={14} /> {driver.sourceCount} sources</span>
          </div>
        </div>
        <div className="text-muted-foreground ml-4 shrink-0 bg-muted/50 p-2 rounded-full">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-border/50 bg-muted/5">
              <div className="flex gap-3 mb-6 mt-4">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground shrink-0 mt-0.5 shadow-sm">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">AI Summary</h3>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {driver.aiSummary}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Affected Markets</h3>
                <div className="flex flex-wrap gap-2">
                  {driver.affectedMarkets.map(market => {
                    let Icon = Minus;
                    let colorClass = "text-muted-foreground bg-muted border-border";
                    if (market.trend === "Bullish") {
                      Icon = TrendingUp;
                      colorClass = "text-green-500 bg-green-500/10 border-green-500/20";
                    } else if (market.trend === "Bearish") {
                      Icon = TrendingDown;
                      colorClass = "text-red-500 bg-red-500/10 border-red-500/20";
                    }

                    return (
                      <Link 
                        key={market.symbol}
                        href={`/markets/${market.symbol}`}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold hover:opacity-80 transition-opacity ${colorClass}`}
                      >
                        <Icon size={14} />
                        <span className="uppercase">{market.symbol}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NewsPage() {
  const drivers = getNewsDrivers();
  const [expandedId, setExpandedId] = useState<string | null>(drivers[0]?.id || null);

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 max-w-4xl mx-auto w-full pb-32">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Market Drivers
        </h1>
        <p className="text-muted-foreground">
          Understand the structural themes driving the markets today. No noise, just signal.
        </p>
      </section>

      {drivers.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-xl bg-muted/10">
          <Newspaper size={32} className="mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground font-medium text-lg">No active drivers today.</p>
          <p className="text-sm text-muted-foreground mt-2">The markets are unusually quiet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {drivers.map(driver => (
            <DriverCard 
              key={driver.id} 
              driver={driver} 
              isExpanded={expandedId === driver.id}
              onToggle={() => setExpandedId(prev => prev === driver.id ? null : driver.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
