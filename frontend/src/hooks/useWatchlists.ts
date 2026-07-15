import { useState, useEffect } from "react";

export type WatchlistMap = Record<string, string[]>;

const DEFAULT_WATCHLISTS: WatchlistMap = {
  "Tech": ["aapl", "msft", "ndx", "ai-index"],
  "Crypto": ["btc", "total-crypto"],
  "Commodities": ["xauusd", "wti"],
  "Sri Lanka": ["cse"],
  "My Portfolio": []
};

export function useWatchlists() {
  const [watchlists, setWatchlists] = useState<WatchlistMap>(DEFAULT_WATCHLISTS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("asmo_watchlists");
    if (saved) {
      try {
        setWatchlists(JSON.parse(saved));
      } catch (e) {
        setWatchlists(DEFAULT_WATCHLISTS);
      }
    }
    setIsLoaded(true);
  }, []);

  const save = (newLists: WatchlistMap) => {
    setWatchlists(newLists);
    localStorage.setItem("asmo_watchlists", JSON.stringify(newLists));
  };

  const addList = (name: string) => {
    if (!name.trim() || watchlists[name]) return;
    save({ ...watchlists, [name.trim()]: [] });
  };

  const deleteList = (name: string) => {
    const { [name]: removed, ...rest } = watchlists;
    save(rest);
  };

  const renameList = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed || watchlists[trimmed]) return;
    const items = watchlists[oldName];
    const { [oldName]: removed, ...rest } = watchlists;
    save({ ...rest, [trimmed]: items });
  };

  const addSymbolToList = (listName: string, symbol: string) => {
    if (!watchlists[listName]) return;
    if (watchlists[listName].includes(symbol)) return;
    save({
      ...watchlists,
      [listName]: [...watchlists[listName], symbol]
    });
  };

  const removeSymbolFromList = (listName: string, symbol: string) => {
    if (!watchlists[listName]) return;
    save({
      ...watchlists,
      [listName]: watchlists[listName].filter(s => s !== symbol)
    });
  };

  return {
    watchlists,
    isLoaded,
    addList,
    deleteList,
    renameList,
    addSymbolToList,
    removeSymbolFromList
  };
}
