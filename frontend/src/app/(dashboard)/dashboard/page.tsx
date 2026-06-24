'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { 
  Briefcase, CheckCircle2, XCircle, Clock, 
  Sparkles, Calendar, ChevronRight, TrendingUp,
  Award, Flame, Send, X, Bot, User, MessageSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Animated Count Up component for stats cards
function AnimatedCounter({ value, duration = 1.0, suffix = '' }: { value: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 25);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}{suffix}</span>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [greeting, setGreeting] = useState('Welcome back');

  // Assistant states
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'bot', text: `Hi ${user?.name ? user.name.split(' ')[0] : 'Suraj'}! I am your AI Career Assistant. How can I accelerate your internship or job search prep today?` }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const jobsRes = await api.jobs.getJobs();
        if (jobsRes.success) setJobs(jobsRes.data);
        
        if (user?.skills?.length > 0) {
          const roadRes = await api.skills.getRoadmap(user.skills[0]);
          if (roadRes.success) setRoadmap(roadRes.data);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const stats = {
    applied: jobs.filter(j => j.status === 'applied').length,
    interviewing: jobs.filter(j => j.status === 'interviewing').length,
    offered: jobs.filter(j => j.status === 'offered').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
    total: jobs.length
  };

  const applicationHistory = [
    { name: 'Jan', applied: 3, interviews: 1 },
    { name: 'Feb', applied: 5, interviews: 2 },
    { name: 'Mar', applied: 8, interviews: 3 },
    { name: 'Apr', applied: 4, interviews: 2 },
    { name: 'May', applied: 12, interviews: 6 },
    { name: 'Jun', applied: stats.total, interviews: stats.interviewing + stats.offered }
  ];

  const upcomingInterviews = jobs
    .filter(j => j.status === 'interviewing' && j.interviews?.length > 0)
    .flatMap(j => j.interviews.map((i: any) => ({
      company: j.company,
      position: j.position,
      stage: i.stage,
      date: new Date(i.date),
      _id: i._id
    })))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  // Quick Action response handlers
  const handleAssistantPrompt = async (prompt: string, text: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setTyping(true);
    try {
      const response = await api.chat.sendMessage(text);
      if (response && response.success && response.reply) {
        setChatMessages(prev => [...prev, { sender: 'bot', text: response.reply }]);
      } else {
        throw new Error('Invalid chat response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, { sender: 'bot', text: "I'm having trouble connecting to my brain right now. Try checking your internet connection or backend server settings." }]);
    } finally {
      setTyping(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setTyping(true);

    try {
      const response = await api.chat.sendMessage(userText);
      if (response && response.success && response.reply) {
        setChatMessages(prev => [...prev, { sender: 'bot', text: response.reply }]);
      } else {
        throw new Error('Invalid chat response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, { sender: 'bot', text: "I'm having trouble connecting to my brain right now. Try checking your internet connection or backend server settings." }]);
    } finally {
      setTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-2/3 skeleton-shimmer rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 skeleton-shimmer rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 skeleton-shimmer rounded-2xl" />
          <div className="h-80 skeleton-shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  // Optimized AI Career metrics (Replacing generic jobs tracker stats)
  const metricCards = [
    { title: 'Resume Score', value: 84, suffix: '/100', label: 'Goal: 90+ ATS score', icon: Award, colorClass: 'text-emerald-400', borderClass: 'border-l-emerald-500', bgClass: 'bg-emerald-500/5 hover:bg-emerald-500/10' },
    { title: 'Interview Readiness', value: 72, suffix: '%', label: 'Goal: 85% mock readiness', icon: Sparkles, colorClass: 'text-indigo-400', borderClass: 'border-l-indigo-500', bgClass: 'bg-indigo-500/5 hover:bg-indigo-500/10' },
    { title: 'Job Match Rate', value: 88, suffix: '%', label: 'Based on current skills', icon: CheckCircle2, colorClass: 'text-purple-400', borderClass: 'border-l-purple-500', bgClass: 'bg-purple-500/5 hover:bg-purple-500/10' },
    { title: 'Career Progress', value: 65, suffix: '%', label: 'Completed roadmap steps', icon: TrendingUp, colorClass: 'text-amber-400', borderClass: 'border-l-amber-500', bgClass: 'bg-amber-500/5 hover:bg-amber-500/10' },
    { title: 'Skills Mastered', value: 12, suffix: '', label: '6 active goals in progress', icon: Briefcase, colorClass: 'text-pink-400', borderClass: 'border-l-pink-500', bgClass: 'bg-pink-500/5 hover:bg-pink-500/10' },
    { title: 'Weekly Learning Streak', value: 5, suffix: ' Days', label: 'Streak target: 7 days', icon: Flame, colorClass: 'text-orange-400', borderClass: 'border-l-orange-500', bgClass: 'bg-orange-500/5 hover:bg-orange-500/10' }
  ];

  return (
    <div className="space-y-8 pb-16 relative">
      
      {/* ========================================== */}
      {/* PERSONALIZED AI HERO SECTION (Glassmorphic) */}
      {/* ========================================== */}
      <div className="relative p-6 lg:p-8 rounded-3xl overflow-hidden glass-panel border border-border/40 bg-zinc-950/20 shadow-xl animate-fade-in">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {greeting}, <span className="text-gradient">{user?.name || 'Suraj'}</span> 👋
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm font-semibold max-w-xl leading-relaxed">
              Targeting <span className="text-indigo-400 font-bold">{user?.targetTitle || 'Full Stack Developer'}</span>. You have completed <span className="text-emerald-400 font-bold">78%</span> of your profile. Upload your latest resume to analyze modern skill gaps.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium bg-secondary/40 border border-border/60 px-3 py-1.5 rounded-xl">
                <span className="text-zinc-500">Resume Score:</span>
                <span className="font-extrabold text-emerald-400">84/100</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium bg-secondary/40 border border-border/60 px-3 py-1.5 rounded-xl">
                <span className="text-zinc-500">Placement Readiness:</span>
                <span className="font-extrabold text-indigo-400 font-sans">72%</span>
              </div>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 max-w-md w-full space-y-2.5">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Next Recommendation
            </span>
            <p className="text-xs text-zinc-200 font-semibold leading-relaxed">
              Learn Docker and deploy a MERN project.
            </p>
            <div className="relative pt-1">
              <div className="flex justify-between items-center text-[10px] text-zinc-400 mb-1 font-bold">
                <span>Placement Readiness</span>
                <span>72%</span>
              </div>
              <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-zinc-800">
                <div style={{ width: '72%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* STATISTICS GRID */}
      {/* ========================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`glass-card p-5 rounded-2xl flex flex-col justify-between border-l-4 ${card.borderClass} ${card.bgClass} cursor-pointer shadow-md`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{card.title}</span>
                <div className={`p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 ${card.colorClass}`}><Icon className="h-4.5 w-4.5" /></div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  <AnimatedCounter value={card.value} suffix={card.suffix} />
                </h3>
                <span className="text-[9px] text-zinc-500 font-bold mt-1.5 block uppercase tracking-wider">{card.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* RESPONSIVE LAYOUT MATRIX (Multi-col) */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Charts and Trends) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Widget */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50 bg-zinc-950/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-sm text-white">Application Trend</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">Summary of applications vs. interview callback volumes</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/15">
                <TrendingUp className="h-3.5 w-3.5" />
                +24% MoM
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={applicationHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="appliedColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#161426" vertical={false} />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(13, 12, 21, 0.85)', 
                      border: '1px solid rgba(255, 255, 255, 0.05)', 
                      borderRadius: '12px', 
                      color: '#fff', 
                      fontSize: '11px',
                      backdropFilter: 'blur(10px)'
                    }} 
                  />
                  <Area type="monotone" dataKey="applied" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#appliedColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50 bg-zinc-950/10">
            <h3 className="font-extrabold text-sm text-white mb-5">Recent Tracking Events</h3>
            <div className="relative pl-6 border-l border-zinc-800 space-y-6">
              {jobs.slice(0, 3).map((job, idx) => (
                <div key={job._id || idx} className="relative">
                  <div className="absolute -left-[32px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-[#030207] shadow shadow-indigo-500/20"></div>
                  <div className="p-3.5 rounded-xl bg-card/40 border border-border/30 hover:border-border/60 hover:bg-card/60 transition-all duration-200">
                    <span className="text-[9px] font-bold text-indigo-400 block">{new Date(job.dateApplied).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <h4 className="text-xs font-bold mt-1 text-zinc-200">{job.company} &bull; <span className="text-muted-foreground font-semibold">{job.position}</span></h4>
                    <p className="text-[10px] text-zinc-500 mt-1.5 leading-normal truncate">{job.notes || 'No description updates recorded.'}</p>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="text-center text-xs text-muted-foreground py-8 font-semibold">No events logged yet. Create your first job tracker card!</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Upcoming Schedule & AI Insights) */}
        <div className="space-y-6">
          
          {/* Profile Completion Score Dial */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50 bg-zinc-950/10 flex flex-col items-center justify-center text-center">
            <h3 className="font-extrabold text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Profile Completion</h3>
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="currentColor" className="text-zinc-900" strokeWidth="6" fill="transparent" />
                <circle cx="56" cy="56" r="46" stroke="currentColor" className="text-indigo-500" strokeWidth="6" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 46} 
                        strokeDashoffset={2 * Math.PI * 46 * (1 - 78 / 100)} 
                        strokeLinecap="round" />
              </svg>
              <span className="text-2xl font-extrabold text-white">78%</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-bold mt-4 leading-normal">
              Add your current resume to raise your score to <span className="text-emerald-400">90%+</span>
            </p>
          </div>

          {/* AI Career Insights */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50 bg-indigo-950/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-500/10 rounded-full blur-xl"></div>
            <div className="flex items-center gap-2 mb-3.5 text-indigo-400">
              <Sparkles className="h-4.5 w-4.5" />
              <h3 className="font-bold text-[10px] uppercase tracking-wider">AI Pilot Insights</h3>
            </div>
            <ul className="space-y-3.5 text-[11px] font-semibold leading-relaxed">
              <li className="text-zinc-405 text-zinc-400">
                <span className="font-extrabold text-zinc-200 font-sans">ATS Keyword Deficit:</span> Based on your target title <span className="text-indigo-400">{user?.targetTitle || 'Full Stack Developer'}</span>, you are missing 4 keywords. Consider uploading your resume.
              </li>
              <li className="text-zinc-400">
                <span className="font-extrabold text-zinc-200">Interview Readiness:</span> You have an upcoming loop. Try running mock questions on SSR/SSG.
              </li>
            </ul>
          </div>

          {/* Upcoming mock schedule */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50 bg-zinc-950/10">
            <h3 className="font-extrabold text-sm text-white mb-4">Upcoming Schedule</h3>
            <div className="space-y-3.5">
              {upcomingInterviews.map((item: any) => (
                <div key={item._id} className="p-3.5 rounded-xl bg-card/60 border border-border/40 flex items-start gap-3 hover:border-indigo-500/30 transition-colors">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0"><Calendar className="h-4.5 w-4.5" /></div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold truncate text-zinc-200">{item.company} &bull; <span className="text-muted-foreground font-semibold">{item.position}</span></h4>
                    <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{item.stage}</p>
                    <span className="text-[9px] text-indigo-400 font-bold mt-1.5 block">
                      {item.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {upcomingInterviews.length === 0 && (
                <div className="text-center text-xs text-zinc-500 py-6 font-semibold">No interviews scheduled. Update your application tracking cards to configure schedules!</div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* FLOATING AI CAREER ASSISTANT WIDGET */}
      {/* ========================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat window panel */}
        <AnimatePresence>
          {assistantOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-80 sm:w-96 h-[480px] rounded-3xl glass-panel border border-border bg-zinc-950/95 shadow-2xl flex flex-col overflow-hidden mb-4 mr-0"
            >
              {/* Chat Header */}
              <div className="p-4 bg-secondary/50 border-b border-border flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">CareerOS AI Assistant</h4>
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setAssistantOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-white transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                  aria-label="Minimize assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3.5">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${
                      msg.sender === 'user' ? 'bg-indigo-650 text-indigo-400 border border-indigo-500/20' : 'bg-secondary/40 text-muted-foreground border border-border/40'
                    }`}>
                      {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5 text-indigo-400" />}
                    </div>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-secondary/50 text-zinc-200 border border-border/40 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    <div className="p-2 rounded-xl bg-secondary/40 text-indigo-400 shrink-0 border border-border/40">
                      <Bot className="h-3.5 w-3.5 animate-pulse" />
                    </div>
                    <div className="bg-secondary/50 text-zinc-400 border border-border/40 px-4 py-3 rounded-2xl rounded-tl-none text-xs flex gap-1 items-center font-bold">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Pre-seeded prompts */}
              <div className="px-4 py-2 border-t border-border bg-muted/20 shrink-0 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                <button
                  onClick={() => handleAssistantPrompt('resume', 'Review my ATS score')}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-zinc-950/45 hover:bg-secondary text-[9px] font-bold text-zinc-350 hover:text-white transition-all cursor-pointer min-h-[28px] flex items-center justify-center"
                >
                  Resume ATS check
                </button>
                <button
                  onClick={() => handleAssistantPrompt('roadmap', 'Show next roadmap step')}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-zinc-950/45 hover:bg-secondary text-[9px] font-bold text-zinc-350 hover:text-white transition-all cursor-pointer min-h-[28px] flex items-center justify-center"
                >
                  Next roadmap step
                </button>
                <button
                  onClick={() => handleAssistantPrompt('interview', 'How to practice mock loops')}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-zinc-950/45 hover:bg-secondary text-[9px] font-bold text-zinc-350 hover:text-white transition-all cursor-pointer min-h-[28px] flex items-center justify-center"
                >
                  Interview practice
                </button>
                <button
                  onClick={() => handleAssistantPrompt('skills', 'Target full-stack skills')}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-zinc-950/45 hover:bg-secondary text-[9px] font-bold text-zinc-350 hover:text-white transition-all cursor-pointer min-h-[28px] flex items-center justify-center"
                >
                  Recommend skills
                </button>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-border bg-secondary/30 shrink-0 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a career question..."
                  className="flex-1 px-3.5 py-2.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-foreground focus:outline-none focus:border-indigo-500 placeholder-zinc-500 min-h-[40px]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-md shadow-indigo-600/10 cursor-pointer min-w-[40px] min-h-[40px]"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating action button trigger */}
        <button
          onClick={() => setAssistantOpen(!assistantOpen)}
          className={`h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-50 min-h-[56px] min-w-[56px] ${
            assistantOpen ? 'rotate-90 bg-indigo-600' : ''
          }`}
          aria-label="Open AI Assistant"
        >
          {assistantOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </button>
      </div>

    </div>
  );
}
