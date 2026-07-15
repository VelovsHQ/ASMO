"use client";

import { Search } from "lucide-react";

export default function SidebarSearchButton() {
  return (
    <button 
      onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full text-left focus:outline-none"
    >
      <Search size={20} />
      <span className="font-medium">Search</span>
    </button>
  );
}
