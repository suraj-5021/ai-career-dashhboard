'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  User as UserIcon, Settings as SettingsIcon, Bell, 
  ShieldCheck, Sun, Moon, Loader2, Check 
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [currentTitle, setCurrentTitle] = useState(user?.currentTitle || '');
  const [targetTitle, setTargetTitle] = useState(user?.targetTitle || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillsString, setSkillsString] = useState(user?.skills?.join(', ') || '');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const skills = skillsString.split(',').map((s: string) => s.trim()).filter(Boolean);

    try {
      await updateProfile({
        name,
        currentTitle,
        targetTitle,
        bio,
        skills
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">System Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Manage your personal profile records, visual interface themes, and notification preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/10 text-xs font-bold transition-all text-left">
            <UserIcon className="h-4 w-4" />
            Edit Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary/40 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all text-left">
            <SettingsIcon className="h-4 w-4" />
            Appearance Theme
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-secondary/40 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all text-left">
            <Bell className="h-4 w-4" />
            Notification Rules
          </button>
        </div>

        {/* Content Panel Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <div className="glass-panel p-6 rounded-3xl border border-border/60">
            <h3 className="font-extrabold text-sm mb-5 pb-2 border-b border-border/50">Personal Details</h3>
            
            {success && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold mb-6 flex items-center gap-1.5 justify-center">
                <Check className="h-4 w-4" />
                Profile changes saved successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Display Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Professional Skills (comma-separated)</label>
                  <input type="text" value={skillsString} onChange={(e) => setSkillsString(e.target.value)} className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Current Title</label>
                  <input type="text" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Target Title</label>
                  <input type="text" value={targetTitle} onChange={(e) => setTargetTitle(e.target.value)} className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Professional Summary / Bio</label>
                <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-foreground focus:outline-none resize-none leading-relaxed" />
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/15">
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Theme card */}
          <div className="glass-panel p-6 rounded-3xl border border-border/60">
            <h3 className="font-extrabold text-sm mb-4">Interface Theme</h3>
            <p className="text-xs text-muted-foreground mb-4">Customize the visual palette style of your dashboard workspace</p>
            
            <div className="flex gap-4">
              <button
                onClick={toggleTheme}
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  theme === 'light' 
                    ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400' 
                    : 'border-border bg-secondary/60 hover:bg-secondary text-muted-foreground'
                }`}
              >
                <Sun className="h-4.5 w-4.5 text-amber-500" />
                Light Mode
              </button>
              <button
                onClick={toggleTheme}
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400' 
                    : 'border-border bg-secondary/60 hover:bg-secondary text-muted-foreground'
                }`}
              >
                <Moon className="h-4.5 w-4.5 text-indigo-400" />
                Dark Mode (Recommended)
              </button>
            </div>
          </div>

          {/* Notifications Rules checklist */}
          <div className="glass-panel p-6 rounded-3xl border border-border/60">
            <h3 className="font-extrabold text-sm mb-4">Notification Configurations</h3>
            <div className="space-y-4 text-xs font-semibold">
              <label className="flex items-center gap-3 cursor-pointer text-zinc-300">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded bg-zinc-900 border-zinc-800 text-indigo-600 focus:ring-indigo-500" />
                Send real-time alerts upon application status updates (WS channel)
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-zinc-300">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded bg-zinc-900 border-zinc-800 text-indigo-600 focus:ring-indigo-500" />
                Remind me of scheduled interviews 24 hours prior
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-zinc-300">
                <input type="checkbox" className="h-4 w-4 rounded bg-zinc-900 border-zinc-800 text-indigo-600 focus:ring-indigo-500" />
                Send weekly reports summarizing ATS analysis and application metrics
              </label>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
