"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useInterests } from "@/hooks/useInterests";
import { useWatchlists } from "@/hooks/useWatchlists";
import { useAlerts } from "@/hooks/useAlerts";
import Link from "next/link";
import { Edit2, Bell, List, Settings, LogOut, Lock, Check, X, Target, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { profile, updateProfile, isLoaded: profileLoaded } = useProfile();
  const { interests, isLoaded: interestsLoaded } = useInterests();
  const { watchlists, isLoaded: watchlistsLoaded } = useWatchlists();
  const { rules, isLoaded: alertsLoaded } = useAlerts();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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
      <section className="relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 border border-border bg-muted/10 rounded-3xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
          {/* Avatar */}
          <div className="relative group cursor-pointer shrink-0">
            {/* Glow / Gradient Ring */}
            <div className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-accent/40 via-accent/10 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-background flex items-center justify-center text-3xl font-bold uppercase text-foreground border border-border shadow-lg z-10 overflow-hidden">
              <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors" />
              {profile.avatar}
            </div>
            {/* Camera Overlay */}
            <div className="absolute bottom-0 right-0 z-20 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground shadow-sm group-hover:text-accent group-hover:border-accent transition-colors">
              <Camera size={14} />
            </div>
          </div>

          <div className="w-full relative min-h-[90px] flex items-center">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div 
                  key="edit"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4 w-full max-w-md bg-background border border-border p-5 rounded-2xl shadow-sm"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                  <div className="flex gap-2 mt-2 pt-4 border-t border-border/50">
                    <button onClick={handleEditSave} className="bg-accent text-accent-foreground px-5 py-2 rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors flex items-center justify-center gap-1.5 flex-1">
                      <Check size={16} /> Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="bg-transparent border border-border text-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-1.5 flex-1">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="view"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-1"
                >
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">{profile.name}</h1>
                  <p className="text-muted-foreground font-medium">{profile.email}</p>
                  <p className="text-xs text-muted-foreground/70 font-bold uppercase tracking-wider mt-2">Member since {profile.memberSince}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <AnimatePresence>
          {!isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full md:w-auto shrink-0"
            >
              <button onClick={handleEditOpen} className="flex items-center gap-2 bg-background border border-border hover:bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm w-full md:w-auto justify-center">
                <Edit2 size={16} /> Edit Profile
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
            <div className="flex flex-col">
              <button 
                onClick={() => setIsChangingPassword(!isChangingPassword)} 
                className={`flex items-center gap-3 p-3 text-sm font-semibold hover:bg-muted rounded-xl transition-colors text-left w-full ${isChangingPassword ? "bg-muted text-foreground" : "text-foreground"}`}
              >
                <Lock size={18} className={isChangingPassword ? "text-accent" : "text-muted-foreground"} /> Change Password
              </button>
              <AnimatePresence>
                {isChangingPassword && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-3 p-4 mt-2 bg-background border border-border rounded-xl shadow-sm mx-1 mb-1">
                      {passwordSuccess ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center gap-3 py-6">
                          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                            <Check size={24} />
                          </div>
                          <span className="text-sm font-bold text-foreground">Password Updated</span>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Password</label>
                            <input type="password" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} className="bg-muted/30 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">New Password</label>
                            <input type="password" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} className="bg-muted/30 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Confirm New Password</label>
                            <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} className="bg-muted/30 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all" />
                          </div>
                          <div className="flex gap-2 mt-2 pt-3 border-t border-border/50">
                            <button 
                              onClick={() => {
                                if (passwordForm.new && passwordForm.new === passwordForm.confirm) {
                                  setPasswordSuccess(true);
                                  setTimeout(() => {
                                    setIsChangingPassword(false);
                                    setPasswordSuccess(false);
                                    setPasswordForm({ current: "", new: "", confirm: "" });
                                  }, 2000);
                                }
                              }} 
                              disabled={!passwordForm.new || passwordForm.new !== passwordForm.confirm}
                              className="bg-accent text-accent-foreground px-3 py-2 rounded-md text-xs font-bold hover:bg-accent/90 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Update Password
                            </button>
                            <button onClick={() => setIsChangingPassword(false)} className="bg-transparent border border-border text-foreground px-3 py-2 rounded-md text-xs font-semibold hover:bg-muted transition-colors flex-1">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
