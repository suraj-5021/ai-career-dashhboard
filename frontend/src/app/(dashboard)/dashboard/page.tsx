'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { 
  Briefcase, CheckCircle2, XCircle, Clock, 
  Sparkles, Calendar, ChevronRight, TrendingUp 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const jobsRes = await api.jobs.getJobs();
        if (jobsRes.success) setJobs(jobsRes.data);
        
        // Fetch roadmap for main skill to display in progress
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

  // Aggregate stats
  const stats = {
    applied: jobs.filter(j => j.status === 'applied').length,
    interviewing: jobs.filter(j => j.status === 'interviewing').length,
    offered: jobs.filter(j => j.status === 'offered').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
    total: jobs.length
  };

  // Pre-seed chart data matching current dates
  const applicationHistory = [
    { name: 'Jan', applied: 3, interviews: 1 },
    { name: 'Feb', applied: 5, interviews: 2 },
    { name: 'Mar', applied: 8, interviews: 3 },
    { name: 'Apr', applied: 4, interviews: 2 },
    { name: 'May', applied: 12, interviews: 6 },
    { name: 'Jun', applied: stats.total, interviews: stats.interviewing + stats.offered }
  ];

  // Upcomings mock interviews list
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-2/3 skeleton-shimmer rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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

  // Dashboard cards styling configs
  const statCards = [
    { title: 'Applied', value: stats.applied, label: 'applications tracked', icon: Briefcase, colorClass: 'text-indigo-400', borderClass: 'border-l-indigo-500', bgClass: 'bg-indigo-500/5 hover:bg-indigo-500/10' },
    { title: 'Interviewing', value: stats.interviewing, label: 'loops active', icon: Clock, colorClass: 'text-amber-400', borderClass: 'border-l-amber-500', bgClass: 'bg-amber-500/5 hover:bg-amber-500/10' },
    { title: 'Offered', value: stats.offered, label: 'proposals extended', icon: CheckCircle2, colorClass: 'text-emerald-400', borderClass: 'border-l-emerald-500', bgClass: 'bg-emerald-500/5 hover:bg-emerald-500/10' },
    { title: 'Rejected', value: stats.rejected, label: 'pipelines closed', icon: XCircle, colorClass: 'text-rose-400', borderClass: 'border-l-rose-500', bgClass: 'bg-rose-500/5 hover:bg-rose-500/10' }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* ========================================== */}
      {/* WELCOME BANNER (Glassmorphic) */}
      {/* ========================================== */}
      <div className="relative p-6 lg:p-8 rounded-3xl overflow-hidden glass-panel border border-border/40 bg-zinc-950/20 shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground text-xs mt-1.5 font-semibold">
              Currently targeting <span className="text-indigo-400">{user?.targetTitle || 'Software Engineer'}</span> positions. You have {stats.interviewing} active interview loops.
            </p>
          </div>
          <Link 
            href="/tracker" 
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            Manage Applications
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ========================================== */}
      {/* STATISTICS GRID */}
      {/* ========================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
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
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{card.title}</span>
                <div className={`p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 ${card.colorClass}`}><Icon className="h-4 w-4" /></div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-extrabold text-white">{card.value}</h3>
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

        {/* Right Column (AI Insights, Completion, Upcoming) */}
        <div className="space-y-6">
          
          {/* Profile Completion Score Dial */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50 bg-zinc-950/10 flex flex-col items-center justify-center text-center">
            <h3 className="font-extrabold text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Profile Completion</h3>
            <div className="relative h-28 w-28 flex items-center justify-center">
              {/* Radial circle representation */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="currentColor" className="text-zinc-900" strokeWidth="6" fill="transparent" />
                <circle cx="56" cy="56" r="46" stroke="currentColor" className="text-indigo-500" strokeWidth="6" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 46} 
                        strokeDashoffset={2 * Math.PI * 46 * (1 - (user?.profileCompletion || 78) / 100)} 
                        strokeLinecap="round" />
              </svg>
              <span className="text-2xl font-extrabold text-white">{user?.profileCompletion || 78}%</span>
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
              <li className="text-zinc-400">
                <span className="font-extrabold text-zinc-200">ATS Keyword Deficit:</span> Based on your target title <span className="text-indigo-400">{user?.targetTitle || 'Software Engineer'}</span>, you are missing 4 keywords. Consider uploading your resume.
              </li>
              <li className="text-zinc-400">
                <span className="font-extrabold text-zinc-200">Interview Readiness:</span> You have an upcoming loop. Try running mock questions on SSR/SSG.
              </li>
            </ul>
          </div>

          {/* Upcoming mock schedule / interviews list */}
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

    </div>
  );
}
