"use client";

import { useState, useRef, useEffect } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { Bell, Check, Trash2 } from "lucide-react";
import Link from "next/link";

const severityIcons = {
  urgent: "🚨",
  hot: "🔥",
  watch: "⚠️",
  info: "ℹ️"
};

export default function NotificationDropdown() {
  const { notifications, unreadCount, isLoaded, markAsRead, markAllAsRead, clearAllNotifications } = useAlerts();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <div className="flex gap-2">
              <button onClick={markAllAsRead} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors" title="Mark all read">
                <Check size={14} /> Read All
              </button>
              <button onClick={clearAllNotifications} className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 transition-colors" title="Clear all">
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                You're all caught up!
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map(notif => {
                  const content = (
                    <div className={`p-4 border-b border-border/50 hover:bg-muted/30 transition-colors flex gap-3 ${!notif.read ? "bg-accent/5" : ""}`} onClick={() => markAsRead(notif.id)}>
                      <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">{severityIcons[notif.severity]}</span>
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-sm font-medium ${!notif.read ? "text-foreground" : "text-foreground/80"}`}>{notif.title}</span>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{notif.message}</p>
                        <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );

                  return notif.symbol ? (
                    <Link key={notif.id} href={`/markets/${notif.symbol}`} onClick={() => setIsOpen(false)} className="block">
                      {content}
                    </Link>
                  ) : (
                    <div key={notif.id} className="cursor-pointer" onClick={() => setIsOpen(false)}>
                      {content}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-2 border-t border-border bg-muted/20 text-center">
            <Link href="/alerts" onClick={() => setIsOpen(false)} className="text-xs text-accent hover:underline font-medium inline-block py-1">
              Manage Alert Rules
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
