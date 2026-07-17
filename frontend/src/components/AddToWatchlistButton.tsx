"use client";

import { useState, useRef, useEffect } from "react";
import { useWatchlists } from "@/hooks/useWatchlists";
import { Plus, Check, List as ListIcon } from "lucide-react";

export default function AddToWatchlistButton({ symbol }: { symbol: string }) {
  const { watchlists, isLoaded, addSymbolToList, removeSymbolFromList } = useWatchlists();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded) return null;

  const lists = Object.keys(watchlists);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 rounded-md font-medium text-sm transition-colors"
      >
        <Plus size={16} /> Add to Watchlist
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-xl overflow-hidden z-50">
          <div className="p-2 border-b border-border/50 bg-muted/30">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Select List</span>
          </div>
          <div className="max-h-60 overflow-y-auto p-1 flex flex-col gap-1">
            {lists.length === 0 ? (
              <div className="p-2 text-xs text-muted-foreground text-center">No watchlists found.</div>
            ) : (
              lists.map(listName => {
                const isAdded = watchlists[listName].includes(symbol);
                return (
                  <button
                    key={listName}
                    onClick={() => {
                      if (isAdded) removeSymbolFromList(listName, symbol);
                      else addSymbolToList(listName, symbol);
                    }}
                    className="flex items-center justify-between w-full p-2 text-sm rounded-md hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <ListIcon size={14} className="text-muted-foreground shrink-0" />
                      <span className="truncate text-foreground font-medium">{listName}</span>
                    </div>
                    {isAdded && <Check size={16} className="text-accent shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
