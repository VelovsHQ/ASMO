"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { generateMockMarketSignal } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

const SEARCHABLE_MARKETS = [
  { symbol: "xauusd", name: "Gold", category: "Commodities" },
  { symbol: "wti", name: "Crude Oil", category: "Commodities" },
  { symbol: "btc", name: "Bitcoin", category: "Crypto" },
  { symbol: "eth", name: "Ethereum", category: "Crypto" },
  { symbol: "sol", name: "Solana", category: "Crypto" },
  { symbol: "total-crypto", name: "Total Crypto Market Cap", category: "Crypto" },
  { symbol: "ndx", name: "NASDAQ 100", category: "Stocks" },
  { symbol: "spx", name: "S&P 500", category: "Stocks" },
  { symbol: "aapl", name: "Apple Inc.", category: "Stocks" },
  { symbol: "msft", name: "Microsoft", category: "Stocks" },
  { symbol: "nvda", name: "NVIDIA", category: "Stocks" },
  { symbol: "tsla", name: "Tesla", category: "Stocks" },
  { symbol: "ai-index", name: "AI Tech Index", category: "Stocks" },
  { symbol: "cse", name: "Colombo Stock Exchange", category: "Stocks" },
  { symbol: "eurusd", name: "EUR/USD", category: "Forex" },
  { symbol: "gbpusd", name: "GBP/USD", category: "Forex" },
  { symbol: "usdjpy", name: "USD/JPY", category: "Forex" }
];

const SUGGESTIONS = ["xauusd", "btc", "ndx", "nvda"];

// Very basic fuzzy match
function fuzzyMatch(str: string, query: string) {
  const s = str.toLowerCase();
  const q = query.toLowerCase();
  let i = 0, j = 0;
  while (i < s.length && j < q.length) {
    if (s[i] === q[j]) j++;
    i++;
  }
  return j === q.length;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    
    const handleOpenSearch = () => setIsOpen(true);
    
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-search", handleOpenSearch);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-search", handleOpenSearch);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return SEARCHABLE_MARKETS.filter(m => SUGGESTIONS.includes(m.symbol));
    }
    
    // Exact or substring match gets priority, then fuzzy
    const lowerQuery = query.toLowerCase();
    const matches = SEARCHABLE_MARKETS.filter(m => 
      m.name.toLowerCase().includes(lowerQuery) || 
      m.symbol.toLowerCase().includes(lowerQuery) ||
      fuzzyMatch(m.name, query) ||
      fuzzyMatch(m.symbol, query)
    );
    return matches;
  }, [query]);

  // Group by category if we have results and a query
  const groupedResults = useMemo(() => {
    const groups: Record<string, typeof results> = {};
    results.forEach(res => {
      if (!groups[res.category]) groups[res.category] = [];
      groups[res.category].push(res);
    });
    return groups;
  }, [results]);

  const flatResults = useMemo(() => {
    const flat: typeof results = [];
    Object.values(groupedResults).forEach(group => flat.push(...group));
    return flat;
  }, [groupedResults]);

  // Keyboard navigation within the palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (flatResults.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatResults.length) % (flatResults.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          handleSelect(flatResults[selectedIndex].symbol);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, flatResults, selectedIndex]);

  const handleSelect = (symbol: string) => {
    setIsOpen(false);
    router.push(`/markets/${symbol}`);
  };

  return (
    <>
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }}
        className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 text-muted-foreground bg-muted/50 hover:bg-muted hover:text-foreground transition-colors rounded-full sm:rounded-md border border-border focus:outline-none"
      >
        <Search size={18} />
        <span className="hidden sm:inline text-sm font-medium">Search markets...</span>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative w-full max-w-xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col mx-4"
            >
              <div className="flex items-center px-4 border-b border-border">
                <Search size={20} className="text-muted-foreground shrink-0" />
                <input 
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search assets, markets, symbols..."
                  className="w-full bg-transparent border-none px-4 py-4 focus:outline-none text-foreground placeholder:text-muted-foreground"
                />
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {!query.trim() && (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Suggested
                  </div>
                )}
                
                {flatResults.length === 0 ? (
                  <div className="px-4 py-12 text-center text-muted-foreground">
                    No results found for "{query}"
                  </div>
                ) : (
                  Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      {query.trim() && (
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {category}
                        </div>
                      )}
                      <div className="flex flex-col">
                        {items.map(item => {
                          const isSelected = flatResults[selectedIndex]?.symbol === item.symbol;
                          const signal = generateMockMarketSignal(item.symbol.toUpperCase());
                          
                          let trendIcon = <Minus size={16} className="text-muted-foreground" />;
                          let trendColor = "text-muted-foreground";
                          if (signal.trend === "Bullish") {
                            trendIcon = <TrendingUp size={16} className="text-green-500" />;
                            trendColor = "text-green-500";
                          } else if (signal.trend === "Bearish") {
                            trendIcon = <TrendingDown size={16} className="text-red-500" />;
                            trendColor = "text-red-500";
                          }

                          return (
                            <div 
                              key={item.symbol}
                              className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-accent/10" : "hover:bg-muted/50"}`}
                              onClick={() => handleSelect(item.symbol)}
                              onMouseEnter={() => setSelectedIndex(flatResults.findIndex(r => r.symbol === item.symbol))}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-xs uppercase text-foreground">
                                  {item.symbol.slice(0,2)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-foreground">{item.name}</span>
                                  <span className="text-xs text-muted-foreground uppercase">{item.symbol}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
                                  {trendIcon}
                                  {signal.score}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex items-center gap-4 px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-sans font-medium text-[10px]">↑↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-sans font-medium text-[10px]">↵</kbd> to select</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-sans font-medium text-[10px]">esc</kbd> to close</span>
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
