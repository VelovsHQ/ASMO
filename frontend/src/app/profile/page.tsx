"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useInterests } from "@/hooks/useInterests";
import { useWatchlists } from "@/hooks/useWatchlists";
import { useAlerts } from "@/hooks/useAlerts";
import Link from "next/link";
import { Edit2, Bell, List, Settings, LogOut, Lock, Check, X, Target } from "lucide-react";

export default function ProfilePage() {
  const { profile, updateProfile, isLoaded: profileLoaded } = useProfile();
  const { interests, isLoaded: interestsLoaded } = useInterests();
  const { watchlists, isLoaded: watchlistsLoaded } = useWatchlists();
  const { rules, isLoaded: alertsLoaded } = useAlerts();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  if (!profileLoaded || !interestsLoaded || !watchlistsLoaded || !alertsLoaded) return null;

  const activeRulesCount = rules.filter(r => r.enabled).length;
  const watchlistsCount = Object.keys(watchlists).length;

  const handleEditOpen = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    updateProfile({
      name: editName.trim() || profile.name,
      email: editEmail.trim() || profile.email,
      avatar: (editName.trim() || profile.name).substring(0, 2).toUpperCase()
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 md:p-10 flex flex-col gap-10 max-w-5xl mx-auto w-full pb-32">
      
      {/* 1. Header */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 border border-border bg-muted/10 rounded-3xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent flex items-center justify-center text-3xl font-bold uppercase text-accent-foreground border-4 border-background shadow-lg shrink-0">
            {profile.avatar}
          </div>
          {isEditing ? (
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <input 
                type="text" 
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-1.5 text-lg font-bold focus:outline-none focus:border-accent w-full md:w-64"
                placeholder="Full Name"
              />
              <input 
                type="email" 
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-accent w-full md:w-64"
                placeholder="Email Address"
              />
              <div className="flex gap-2 mt-1">
                <button onClick={handleEditSave} className="bg-accent text-accent-foreground px-4 py-1.5 rounded-md text-sm font-bold hover:bg-accent/90 transition-colors flex items-center gap-1.5">
                  <Check size={16} /> Save
                </button>
                <button onClick={() => setIsEditing(false)} className="bg-background border border-border text-foreground px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-muted transition-colors flex items-center gap-1.5">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.email}</p>
              <p className="text-xs text-muted-foreground/70 font-bold uppercase tracking-wider mt-2">Member since {profile.memberSince}</p>
            </div>
          )}
        </div>
        {!isEditing && (
          <button onClick={handleEditOpen} className="flex items-center gap-2 bg-background border border-border hover:bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm w-full md:w-auto justify-center">
            <Edit2 size={16} /> Edit Profile
          </button>
        )}
      </section>

      {/* 2. At a Glance Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-6 border border-border bg-background rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <List size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-foreground">{watchlistsCount}</span>
            <span className="text-sm font-medium text-muted-foreground">Watchlists</span>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 border border-border bg-background rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <Target size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-foreground">{interests.length}</span>
            <span className="text-sm font-medium text-muted-foreground">Tracked Interests</span>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 border border-border bg-background rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
            <Bell size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-foreground">{activeRulesCount}</span>
            <span className="text-sm font-medium text-muted-foreground">Active Alerts</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* 3. My Interests */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Target className="text-accent" /> Tracked Interests
              </h2>
              <Link href="/settings" className="text-sm font-medium text-accent hover:underline">
                Manage
              </Link>
            </div>
            <div className="p-6 border border-border bg-background rounded-2xl">
              {interests.length === 0 ? (
                <p className="text-muted-foreground text-sm">You aren't tracking any markets yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {interests.map(interest => (
                    <span key={interest} className="px-4 py-2 rounded-full text-sm font-semibold border bg-accent/10 text-accent border-accent/20 cursor-default">
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 4. My Watchlists */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <List className="text-accent" /> Watchlists
              </h2>
              <Link href="/watchlists" className="text-sm font-medium text-accent hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(watchlists).map(([name, symbols]) => (
                <Link key={name} href="/watchlists" className="block group h-full">
                  <div className="p-5 border border-border bg-background rounded-2xl hover:bg-muted/30 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md flex flex-col gap-4 h-full">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-foreground text-lg truncate pr-2">{name}</h3>
                      <span className="text-xs font-semibold px-2 py-1 bg-muted rounded text-muted-foreground shrink-0">{symbols.length} Assets</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {symbols.slice(0, 3).map(sym => (
                        <span key={sym} className="text-xs font-semibold text-muted-foreground bg-muted/50 border border-border/50 px-2 py-0.5 rounded uppercase">
                          {sym}
                        </span>
                      ))}
                      {symbols.length > 3 && (
                        <span className="text-xs font-semibold text-muted-foreground bg-muted/50 border border-border/50 px-2 py-0.5 rounded">
                          +{symbols.length - 3}
                        </span>
                      )}
                      {symbols.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">Empty list</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              {Object.keys(watchlists).length === 0 && (
                <div className="sm:col-span-2 p-6 border border-dashed border-border rounded-2xl flex items-center justify-center">
                   <p className="text-muted-foreground text-sm">No watchlists created yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold tracking-tight">Account Actions</h2>
          <div className="flex flex-col gap-2 p-4 border border-border bg-muted/5 rounded-2xl">
            <button onClick={handleEditOpen} className="flex items-center gap-3 p-3 text-sm font-semibold text-foreground hover:bg-muted rounded-xl transition-colors text-left w-full">
              <Edit2 size={18} className="text-muted-foreground" /> Edit Profile
            </button>
            <button className="flex items-center gap-3 p-3 text-sm font-semibold text-foreground hover:bg-muted rounded-xl transition-colors text-left w-full">
              <Lock size={18} className="text-muted-foreground" /> Change Password
            </button>
            <Link href="/settings" className="flex items-center gap-3 p-3 text-sm font-semibold text-foreground hover:bg-muted rounded-xl transition-colors w-full">
              <Settings size={18} className="text-muted-foreground" /> Preferences
            </Link>
            <div className="h-px bg-border/50 my-2 mx-2" />
            <button className="flex items-center gap-3 p-3 text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-left w-full">
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
