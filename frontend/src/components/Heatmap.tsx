"use client";

import { useState, useMemo } from "react";
import { SEARCHABLE_MARKETS, generateMockMarketSignal } from "@/lib/mockData";
import Link from "next/link";
import { Target, ShieldAlert, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Equities", "Crypto", "Commodities", "Forex"];

// Calculate color based on percentage change (-5 to +5)
function getHeatmapColor(changePercent: number) {
  if (changePercent === 0) return "bg-zinc-800 text-zinc-300";
  
  // Normalize intensity between 0 and 1 (max 5%)
  const intensity = Math.min(Math.abs(changePercent) / 5, 1);
  
  if (changePercent > 0) {
    // Green scale: lightness from 25% (dark) to 50% (bright)
    const lightness = 25 + (intensity * 25);
    return `bg-[hsl(142,71%,${lightness}%)] text-white`;
  } else {
    // Red scale: lightness from 25% (dark) to 50% (bright)
    const lightness = 25 + (intensity * 25);
    return `bg-[hsl(348,83%,${lightness}%)] text-white`;
  }
}

export default function Heatmap() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  // Generate signals once per mount for all markets
  const marketData = useMemo(() => {
    return SEARCHABLE_MARKETS.map(market => {
      const signal = generateMockMarketSignal(market.name);
      return {
        ...market,
        ...signal
      };
    });
  }, []);

  const filteredAndSorted = useMemo(() => {
    let filtered = marketData;
    if (activeCategory !== "All") {
      filtered = marketData.filter(m => m.category === activeCategory);
    }
    
    // Sort by absolute magnitude of change
    return filtered.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  }, [marketData, activeCategory]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">World Markets Heatmap</h2>
        
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? "bg-accent text-accent-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span>-5%</span>
        <div className="flex w-32 h-2 rounded-full overflow-hidden">
          <div className="flex-1 bg-[hsl(348,83%,50%)]" />
          <div className="flex-1 bg-[hsl(348,83%,25%)]" />
          <div className="flex-1 bg-zinc-800" />
          <div className="flex-1 bg-[hsl(142,71%,25%)]" />
          <div className="flex-1 bg-[hsl(142,71%,50%)]" />
        </div>
        <span>+5%</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {filteredAndSorted.map(market => {
          const isHovered = hoveredSymbol === market.symbol;
          const isPositive = market.changePercent > 0;
          const displayChange = `${isPositive ? "+" : ""}${market.changePercent.toFixed(2)}%`;
          
          return (
            <div 
              key={market.symbol}
              className="relative"
              onMouseEnter={() => setHoveredSymbol(market.symbol)}
              onMouseLeave={() => setHoveredSymbol(null)}
              onClick={() => {
                // Mobile tap behavior
                if (hoveredSymbol !== market.symbol) {
                  setHoveredSymbol(market.symbol);
                }
              }}
            >
              {/* Tile */}
              <div 
                className={`w-full aspect-square flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 ${getHeatmapColor(market.changePercent)}`}
              >
                <span className="font-bold text-sm sm:text-base uppercase tracking-tight truncate w-full text-center drop-shadow-sm">
                  {market.symbol}
                </span>
                <span className="text-xs sm:text-sm font-semibold opacity-90 drop-shadow-sm">
                  {displayChange}
                </span>
              </div>

              {/* Popover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-background border border-border shadow-2xl rounded-xl overflow-hidden pointer-events-auto"
                  >
                    <div className="p-3 border-b border-border/50 bg-muted/20">
                      <div className="font-bold text-foreground text-sm">{market.name}</div>
                      <div className="text-xs text-muted-foreground uppercase">{market.symbol}</div>
                    </div>
                    <div className="p-3 flex flex-col gap-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1"><Activity size={12}/> Trend</span>
                        <span className={`font-semibold ${market.trend === "Bullish" ? "text-green-500" : market.trend === "Bearish" ? "text-red-500" : "text-yellow-500"}`}>{market.trend}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1"><Target size={12}/> Confidence</span>
                        <span className="font-semibold text-foreground">{market.confidence}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1"><ShieldAlert size={12}/> Risk</span>
                        <span className="font-semibold text-foreground">{market.risk}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/markets/${market.symbol}`}
                      className="block w-full text-center p-2 bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground text-xs font-semibold transition-colors border-t border-border"
                    >
                      View Details &rarr;
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
