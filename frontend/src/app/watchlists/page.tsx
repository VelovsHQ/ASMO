"use client";

import { useState, useMemo } from "react";
import { useWatchlists } from "@/hooks/useWatchlists";
import { generateMockMarketSignal } from "@/lib/mockData";
import MarketPulseScore from "@/components/MarketPulseScore";
import Link from "next/link";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

export default function WatchlistsPage() {
  const { watchlists, isLoaded, addList, deleteList, renameList, removeSymbolFromList } = useWatchlists();
  
  const [newListMode, setNewListMode] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [editingList, setEditingList] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const allSignals = useMemo(() => {
    const symbols = new Set<string>();
    Object.values(watchlists).forEach(list => list.forEach(s => symbols.add(s)));
    
    const signals: Record<string, any> = {};
    symbols.forEach(sym => {
      signals[sym] = generateMockMarketSignal(sym.toUpperCase());
    });
    return signals;
  }, [watchlists]);

  if (!isLoaded) return null;

  const handleCreateList = () => {
    if (newListName.trim()) {
      addList(newListName.trim());
    }
    setNewListMode(false);
    setNewListName("");
  };

  const handleRename = (oldName: string) => {
    if (editName.trim()) {
      renameList(oldName, editName.trim());
    }
    setEditingList(null);
  };

  return (
    <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <section className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Watchlists
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor your custom groups of assets.
          </p>
        </section>
        
        {!newListMode ? (
          <button 
            onClick={() => setNewListMode(true)}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-md font-medium hover:bg-accent/90 transition-colors shadow-sm"
          >
            <Plus size={18} /> New Watchlist
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-lg border border-border">
            <input 
              autoFocus
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
              placeholder="Watchlist name..."
              className="bg-transparent border-none focus:outline-none px-3 py-1 text-sm text-foreground w-40 sm:w-60"
            />
            <button onClick={handleCreateList} className="p-1.5 bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors">
              <Check size={16} />
            </button>
            <button onClick={() => setNewListMode(false)} className="p-1.5 text-muted-foreground hover:bg-muted rounded transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-12">
        {Object.entries(watchlists).map(([name, symbols]) => (
          <section key={name} className="flex flex-col gap-4">
            {/* List Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              {editingList === name ? (
                <div className="flex items-center gap-2">
                  <input 
                    autoFocus
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRename(name)}
                    className="bg-muted/30 border border-border rounded px-2 py-1 text-lg font-semibold focus:outline-none focus:border-accent text-foreground"
                  />
                  <button onClick={() => handleRename(name)} className="text-accent hover:text-accent/80 p-1">
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingList(null)} className="text-muted-foreground hover:text-foreground p-1">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-3">
                  {name}
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {symbols.length}
                  </span>
                </h2>
              )}
              
              {!editingList && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setEditingList(name); setEditName(name); }}
                    className="text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-muted/50 transition-colors"
                    title="Rename list"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => { if(confirm(`Delete watchlist "${name}"?`)) deleteList(name); }}
                    className="text-muted-foreground hover:text-red-500 p-1.5 rounded hover:bg-red-500/10 transition-colors"
                    title="Delete list"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* List Grid */}
            {symbols.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/10">
                <p className="text-muted-foreground">This watchlist is empty.</p>
                <Link href="/markets" className="text-sm text-accent hover:underline mt-2 inline-block">Browse markets to add symbols.</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {symbols.map(sym => (
                  <div key={sym} className="relative group h-full">
                    <Link href={`/markets/${sym}`} className="block h-full">
                      <div className="h-full transition-transform duration-200 group-hover:-translate-y-1">
                        <MarketPulseScore signal={allSignals[sym]} size="compact" />
                      </div>
                    </Link>
                    <button 
                      onClick={(e) => { e.preventDefault(); removeSymbolFromList(name, sym); }}
                      className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm border border-border text-muted-foreground rounded hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 shadow-sm"
                      title="Remove from list"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
