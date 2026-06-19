'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme, Theme } from '@/context/ThemeContext';
import { 
  User as UserIcon, Settings as SettingsIcon, Bell, 
  Sun, Moon, Monitor, Loader2, Check, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsTab = 'profile' | 'theme' | 'notifications';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [currentTitle, setCurrentTitle] = useState(user?.currentTitle || '');
  const [targetTitle, setTargetTitle] = useState(user?.targetTitle || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillsString, setSkillsString] = useState(user?.skills?.join(', ') || '');

  // Theme Settings states (Local selection, updates global on save)
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme);

  // Notification states (Loads from localStorage or default)
  const [reminders, setReminders] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState(true);
  const [skillAlerts, setSkillAlerts] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);

  // Status/Saving states
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Load local notification settings if they exist
    const savedReminders = localStorage.getItem('notif-reminders');
    const savedStatus = localStorage.getItem('notif-status');
    const savedSkills = localStorage.getItem('notif-skills');
    const savedEmails = localStorage.getItem('notif-emails');

    if (savedReminders !== null) setReminders(savedReminders === 'true');
    if (savedStatus !== null) setStatusUpdates(savedStatus === 'true');
    if (savedSkills !== null) setSkillAlerts(savedSkills === 'true');
    if (savedEmails !== null) setEmailNotifs(savedEmails === 'true');
    
    // Sync current theme state
    setSelectedTheme(theme);
  }, [theme]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const skills = skillsString.split(',').map((s: string) => s.trim()).filter(Boolean);

    try {
      await updateProfile({
        name,
        currentTitle,
        targetTitle,
        bio,
        skills
      });
      triggerToast('Profile records updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleThemeSave = () => {
    setSaving(true);
    setTimeout(() => {
      setTheme(selectedTheme);
      setSaving(false);
      triggerToast(`Theme preference set to ${selectedTheme} successfully!`);
    }, 600);
  };

  const handleNotificationSave = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('notif-reminders', String(reminders));
      localStorage.setItem('notif-status', String(statusUpdates));
      localStorage.setItem('notif-skills', String(skillAlerts));
      localStorage.setItem('notif-emails', String(emailNotifs));
      setSaving(false);
      triggerToast('Notification preferences saved successfully!');
    }, 600);
  };

  const tabs = [
    { id: 'profile', label: 'Edit Profile', icon: UserIcon, description: 'Manage display credentials and public career summaries' },
    { id: 'theme', label: 'Appearance Theme', icon: SettingsIcon, description: 'Modify workspace backgrounds and colors' },
    { id: 'notifications', label: 'Notification Rules', icon: Bell, description: 'Configure active email toggles and alerts feed' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 relative">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-8 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-2xl bg-indigo-950 border border-indigo-500/20 text-indigo-300 shadow-2xl backdrop-blur-md text-xs font-bold"
          >
            <Check className="h-4.5 w-4.5 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          System Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Manage your personal profile records, visual interface themes, and notification preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all text-left group border cursor-pointer ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-primary/20 shadow-inner' 
                    : 'bg-card/40 hover:bg-card/70 text-muted-foreground hover:text-foreground border-transparent'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <span className="block">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Panel Form */}
        <div className="md:col-span-2 min-h-[360px]">
          <AnimatePresence mode="wait">
            
            {/* PROFILE PANEL */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="glass-panel p-6 rounded-3xl border border-border/60"
              >
                <h3 className="font-extrabold text-sm mb-5 pb-2.5 border-b border-border/50 text-white flex items-center gap-2">
                  <UserIcon className="h-4.5 w-4.5 text-indigo-400" />
                  Personal Details
                </h3>

                <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Display Name</label>
                      <input 
                        type="text" 
                        required 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full px-3.5 py-3 bg-zinc-900/40 border border-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs rounded-xl text-foreground focus:outline-none transition-all font-semibold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Skills (comma-separated)</label>
                      <input 
                        type="text" 
                        value={skillsString} 
                        onChange={(e) => setSkillsString(e.target.value)} 
                        className="w-full px-3.5 py-3 bg-zinc-900/40 border border-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs rounded-xl text-foreground focus:outline-none transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Current Title</label>
                      <input 
                        type="text" 
                        value={currentTitle} 
                        onChange={(e) => setCurrentTitle(e.target.value)} 
                        className="w-full px-3.5 py-3 bg-zinc-900/40 border border-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs rounded-xl text-foreground focus:outline-none transition-all font-semibold" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Target Title</label>
                      <input 
                        type="text" 
                        value={targetTitle} 
                        onChange={(e) => setTargetTitle(e.target.value)} 
                        className="w-full px-3.5 py-3 bg-zinc-900/40 border border-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs rounded-xl text-foreground focus:outline-none transition-all font-semibold" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Professional Summary / Bio</label>
                    <textarea 
                      rows={4} 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)} 
                      className="w-full px-3.5 py-3 bg-zinc-900/40 border border-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs rounded-xl text-foreground focus:outline-none transition-all font-semibold resize-none leading-relaxed" 
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit" 
                      disabled={saving} 
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/15 cursor-pointer disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                      Save Profile
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* THEME PANEL */}
            {activeTab === 'theme' && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="glass-panel p-6 rounded-3xl border border-border/60 space-y-6"
              >
                <div>
                  <h3 className="font-extrabold text-sm mb-1 text-white flex items-center gap-2">
                    <SettingsIcon className="h-4.5 w-4.5 text-indigo-400" />
                    Appearance Theme
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Customize the visual palette style of your dashboard workspace</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Light Option */}
                  <button
                    onClick={() => setSelectedTheme('light')}
                    className={`flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'light' 
                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400' 
                        : 'border-border/60 bg-zinc-950/20 hover:bg-zinc-900/60 text-muted-foreground'
                    }`}
                  >
                    <Sun className="h-5 w-5" />
                    <span>Light Mode</span>
                  </button>

                  {/* Dark Option */}
                  <button
                    onClick={() => setSelectedTheme('dark')}
                    className={`flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'dark' 
                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400' 
                        : 'border-border/60 bg-zinc-950/20 hover:bg-zinc-900/60 text-muted-foreground'
                    }`}
                  >
                    <Moon className="h-5 w-5" />
                    <span>Dark Mode</span>
                  </button>

                  {/* System Option */}
                  <button
                    onClick={() => setSelectedTheme('system')}
                    className={`flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedTheme === 'system' 
                        ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400' 
                        : 'border-border/60 bg-zinc-950/20 hover:bg-zinc-900/60 text-muted-foreground'
                    }`}
                  >
                    <Monitor className="h-5 w-5" />
                    <span>System Theme</span>
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={handleThemeSave}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/15 cursor-pointer disabled:opacity-50"
                  >
                    {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS PANEL */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="glass-panel p-6 rounded-3xl border border-border/60 space-y-6"
              >
                <div>
                  <h3 className="font-extrabold text-sm mb-1 text-white flex items-center gap-2">
                    <Bell className="h-4.5 w-4.5 text-indigo-400" />
                    Notification Rules
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Configure email summaries, timelines sync, and workspace alert events</p>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <label className="flex items-center gap-3.5 cursor-pointer text-zinc-300 hover:text-white transition-colors">
                    <input 
                      type="checkbox" 
                      checked={statusUpdates} 
                      onChange={(e) => setStatusUpdates(e.target.checked)}
                      className="h-4.5 w-4.5 rounded bg-zinc-900 border-zinc-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                    />
                    <div>
                      <span className="block font-bold">Job Status Updates</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block font-medium">Send real-time alerts upon application status updates (WS channel)</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3.5 cursor-pointer text-zinc-300 hover:text-white transition-colors">
                    <input 
                      type="checkbox" 
                      checked={reminders} 
                      onChange={(e) => setReminders(e.target.checked)}
                      className="h-4.5 w-4.5 rounded bg-zinc-900 border-zinc-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                    />
                    <div>
                      <span className="block font-bold">Interview Reminders</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block font-medium">Remind me of scheduled interviews 24 hours prior to the slot time</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3.5 cursor-pointer text-zinc-300 hover:text-white transition-colors">
                    <input 
                      type="checkbox" 
                      checked={skillAlerts} 
                      onChange={(e) => setSkillAlerts(e.target.checked)}
                      className="h-4.5 w-4.5 rounded bg-zinc-900 border-zinc-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                    />
                    <div>
                      <span className="block font-bold">Skill Progress Alerts</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block font-medium">Notify me when targets are met or new roadmap modules are generated</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3.5 cursor-pointer text-zinc-300 hover:text-white transition-colors">
                    <input 
                      type="checkbox" 
                      checked={emailNotifs} 
                      onChange={(e) => setEmailNotifs(e.target.checked)}
                      className="h-4.5 w-4.5 rounded bg-zinc-900 border-zinc-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                    />
                    <div>
                      <span className="block font-bold">Email Notifications</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block font-medium">Receive weekly aggregated PDF digests summarizing resume and prep metrics</span>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={handleNotificationSave}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/15 cursor-pointer disabled:opacity-50"
                  >
                    {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
