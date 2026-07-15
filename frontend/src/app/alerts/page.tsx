"use client";

import { useState } from "react";
import { useAlerts, Severity } from "@/hooks/useAlerts";
import { Trash2, Plus, BellRing } from "lucide-react";
import Link from "next/link";

const ASSETS = ["Gold", "BTC", "Oil", "NASDAQ", "Apple", "USD", "Fed News"];
const CONDITIONS = ["turns", "Confidence >", "changes >", "is Released"];

const severityIcons: Record<Severity, string> = {
  urgent: "🚨",
  hot: "🔥",
  watch: "⚠️",
  info: "ℹ️"
};

export default function AlertsPage() {
  const { notifications, rules, isLoaded, addRule, toggleRule, deleteRule, markAllAsRead, clearAllNotifications } = useAlerts();

  const [newAsset, setNewAsset] = useState(ASSETS[0]);
  const [newCondition, setNewCondition] = useState(CONDITIONS[0]);
  const [newValue, setNewValue] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);

  if (!isLoaded) return null;

  const handleCreateRule = () => {
    addRule({
      asset: newAsset,
      condition: newCondition,
      value: newValue.trim() || undefined
    });
    setNewValue("");
    setShowBuilder(false);
  };

  return (
    <div className="p-6 md:p-10 flex flex-col gap-10 max-w-7xl mx-auto w-full pb-32">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Alerts & Notifications
        </h1>
        <p className="text-muted-foreground">
          Manage your custom alert rules and view notification history.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
        {/* Left Column: Alert Rules */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Alert Rules</h2>
            {!showBuilder && (
              <button 
                onClick={() => setShowBuilder(true)}
                className="flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm"
              >
                <Plus size={16} /> New Rule
              </button>
            )}
          </div>

          {showBuilder && (
            <div className="bg-muted/10 border border-border p-5 rounded-xl flex flex-col gap-4 animate-in slide-in-from-top-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Create Rule</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <select 
                  value={newAsset} 
                  onChange={e => setNewAsset(e.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                >
                  {ASSETS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select 
                  value={newCondition} 
                  onChange={e => setNewCondition(e.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                >
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  type="text" 
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  placeholder="Value (e.g. Bullish, 90%)"
                  className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent flex-1 min-w-[120px]"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateRule()}
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setShowBuilder(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors">
                  Cancel
                </button>
                <button onClick={handleCreateRule} className="px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors">
                  Save Rule
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {rules.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-xl bg-muted/10">
                <p className="text-muted-foreground">No alert rules configured.</p>
                <p className="text-sm text-muted-foreground mt-1">Create one to get notified when markets move.</p>
              </div>
            ) : (
              rules.map(rule => (
                <div key={rule.id} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${rule.enabled ? "bg-muted/10 border-border" : "bg-transparent border-border/50 opacity-60"}`}>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleRule(rule.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors ${rule.enabled ? "bg-accent" : "bg-muted"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform ${rule.enabled ? "translate-x-2" : "-translate-x-2"}`} />
                    </button>
                    <div className="flex flex-wrap items-center gap-1.5 text-sm md:text-base font-medium text-foreground">
                      <span>Notify me when</span>
                      <span className="px-2 py-0.5 bg-muted rounded font-semibold text-accent">{rule.asset}</span>
                      <span className="text-muted-foreground">{rule.condition}</span>
                      {rule.value && <span className="px-2 py-0.5 bg-muted rounded font-semibold text-accent">{rule.value}</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 rounded-md hover:bg-red-500/10 transition-colors ml-4 shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Column: Notification History */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
            <div className="flex gap-2">
              <button onClick={markAllAsRead} className="text-sm text-muted-foreground hover:text-foreground transition-colors" title="Mark all read">
                Read All
              </button>
              <span className="text-border">|</span>
              <button onClick={clearAllNotifications} className="text-sm text-muted-foreground hover:text-red-500 transition-colors" title="Clear all">
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-col border border-border rounded-xl overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center bg-muted/10">
                <BellRing size={24} className="mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">Your history is clear.</p>
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <div key={notif.id} className={`p-4 flex gap-3 ${!notif.read ? "bg-accent/5" : "bg-background"} ${idx !== notifications.length - 1 ? "border-b border-border/50" : ""}`}>
                  <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{severityIcons[notif.severity]}</span>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`font-semibold ${!notif.read ? "text-foreground" : "text-foreground/80"}`}>{notif.title}</span>
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider shrink-0">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
                    {notif.symbol && (
                      <Link href={`/markets/${notif.symbol}`} className="text-xs text-accent hover:underline mt-1 self-start font-medium">
                        View {notif.symbol.toUpperCase()} &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
