"use client";

import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useProfile } from "@/hooks/useProfile";
import { useInterests, MARKETS } from "@/hooks/useInterests";
import { User, Bell, Palette, Shield, Info, Trash2, Target } from "lucide-react";
import Link from "next/link";

function Toggle({ checked, onChange, label, description }: { checked: boolean, onChange: (v: boolean) => void, label: string, description?: string }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-col gap-1.5 pr-4">
        <span className="font-semibold text-foreground text-sm">{label}</span>
        {description && <span className="text-xs text-muted-foreground leading-relaxed">{description}</span>}
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors ${checked ? "bg-accent" : "bg-muted"}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform ${checked ? "translate-x-3" : "-translate-x-2"}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, isLoaded: settingsLoaded } = useSettings();
  const { interests, toggleInterest, isLoaded: interestsLoaded } = useInterests();
  const { profile, isLoaded: profileLoaded } = useProfile();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!settingsLoaded || !interestsLoaded || !profileLoaded) return null;

  const handleClearData = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-6 md:p-10 flex flex-col gap-10 max-w-4xl mx-auto w-full pb-32">
      <section className="flex flex-col gap-2 border-b border-border/50 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account, preferences, and personalized experience.
        </p>
      </section>

      <div className="flex flex-col gap-12">
        
        {/* Profile */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <User className="text-accent" size={24} /> Profile
          </h2>
          <div className="flex items-center gap-6 p-6 border border-border bg-muted/10 rounded-2xl">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold uppercase text-muted-foreground border-4 border-background shadow-sm">
              {profile.avatar}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-lg text-foreground">{profile.name}</h3>
              <p className="text-muted-foreground text-sm">{profile.email}</p>
              <Link href="/profile" className="text-accent text-sm font-medium hover:underline mt-1 w-fit">Edit Profile</Link>
            </div>
          </div>
        </section>

        {/* Interests */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Target className="text-accent" size={24} /> Market Interests
          </h2>
          <div className="p-6 border border-border bg-background rounded-2xl flex flex-col gap-6">
            <p className="text-sm text-muted-foreground">
              Update the markets you follow. These power your personal dashboard and default watchlists.
            </p>
            <div className="flex flex-wrap gap-2">
              {MARKETS.map(market => {
                const isSelected = interests.includes(market);
                return (
                  <button
                    key={market}
                    onClick={() => toggleInterest(market)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                      isSelected 
                        ? "bg-accent text-accent-foreground border-accent shadow-sm" 
                        : "bg-background text-foreground border-border hover:border-accent hover:text-accent"
                    }`}
                  >
                    {market}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Bell className="text-accent" size={24} /> Notifications
            </h2>
            <Link href="/alerts" className="text-sm font-medium text-accent hover:underline">
              Manage Alert Rules
            </Link>
          </div>
          <div className="p-6 border border-border bg-background rounded-2xl flex flex-col divide-y divide-border/50">
            <Toggle 
              label="Push Notifications" 
              description="Receive browser notifications for your alerts."
              checked={settings.pushEnabled} 
              onChange={(v) => updateSettings({ pushEnabled: v })} 
            />
            <Toggle 
              label="Email Notifications" 
              description="Receive daily summaries and urgent alerts via email."
              checked={settings.emailEnabled} 
              onChange={(v) => updateSettings({ emailEnabled: v })} 
            />
            
            <div className="pt-6 pb-2 mt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Severity Filters</span>
            </div>
            
            <Toggle 
              label="🚨 Urgent Alerts" 
              description="Critical market breaking news."
              checked={settings.alertUrgent} 
              onChange={(v) => updateSettings({ alertUrgent: v })} 
            />
            <Toggle 
              label="🔥 Hot Alerts" 
              description="Major moves and high-confidence signals."
              checked={settings.alertHot} 
              onChange={(v) => updateSettings({ alertHot: v })} 
            />
            <Toggle 
              label="⚠️ Watch Alerts" 
              description="Minor changes or early trend formations."
              checked={settings.alertWatch} 
              onChange={(v) => updateSettings({ alertWatch: v })} 
            />
          </div>
        </section>

        {/* Appearance */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Palette className="text-accent" size={24} /> Appearance
          </h2>
          <div className="p-6 border border-border bg-background rounded-2xl flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-foreground text-sm">Theme</span>
              <p className="text-xs text-muted-foreground mb-1">Light mode is currently a work in progress. Dark mode is recommended.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => updateSettings({ theme: "dark" })}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${settings.theme === "dark" ? "bg-accent text-accent-foreground border-accent shadow-sm" : "bg-muted text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/80"}`}
                >
                  Dark Mode
                </button>
                <button 
                  onClick={() => updateSettings({ theme: "light" })}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${settings.theme === "light" ? "bg-accent text-accent-foreground border-accent shadow-sm" : "bg-muted text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/80"}`}
                >
                  Light Mode
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
              <span className="font-semibold text-foreground text-sm">Layout Density</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => updateSettings({ density: "comfortable" })}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${settings.density === "comfortable" ? "bg-accent text-accent-foreground border-accent shadow-sm" : "bg-muted text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/80"}`}
                >
                  Comfortable
                </button>
                <button 
                  onClick={() => updateSettings({ density: "compact" })}
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${settings.density === "compact" ? "bg-accent text-accent-foreground border-accent shadow-sm" : "bg-muted text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/80"}`}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="text-accent" size={24} /> Data & Privacy
          </h2>
          <div className="p-6 border border-border bg-background rounded-2xl flex flex-col gap-6">
            <p className="text-sm text-muted-foreground">
              When a full backend is connected, you'll be able to export your account data or permanently delete your account here.
            </p>
            <div className="flex flex-col items-start gap-4 pt-6 border-t border-border/50">
              {showClearConfirm ? (
                <div className="flex flex-col gap-3 p-5 bg-red-500/10 border border-red-500/20 rounded-xl w-full">
                  <span className="font-bold text-red-500">Are you sure?</span>
                  <p className="text-xs text-red-500/80 font-medium">This will permanently wipe all preferences, watchlists, alerts, and notifications from your browser.</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleClearData} className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-bold hover:bg-red-600 transition-colors">
                      Yes, Clear Everything
                    </button>
                    <button onClick={() => setShowClearConfirm(false)} className="px-4 py-2 bg-background/50 text-foreground border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors"
                >
                  <Trash2 size={16} /> Clear Local Data
                </button>
              )}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Info className="text-accent" size={24} /> About ASMO
          </h2>
          <div className="p-6 border border-border bg-background rounded-2xl flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center font-bold text-xl text-accent-foreground shadow-lg">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground">ASMO Intelligence</span>
                <span className="text-xs font-medium text-muted-foreground">Version 1.0.0-beta (Build 492)</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-6 mt-2 border-t border-border/50 text-sm">
              <button className="text-muted-foreground hover:text-foreground font-medium transition-colors underline decoration-border underline-offset-4">Terms of Service</button>
              <button className="text-muted-foreground hover:text-foreground font-medium transition-colors underline decoration-border underline-offset-4">Privacy Policy</button>
              <button className="text-muted-foreground hover:text-foreground font-medium transition-colors underline decoration-border underline-offset-4">Documentation</button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
