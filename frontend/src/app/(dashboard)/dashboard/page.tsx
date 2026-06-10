'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { 
  Briefcase, CheckCircle2, XCircle, Clock, 
  Sparkles, Calendar, ChevronRight, TrendingUp 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar 
} from 'recharts';
import Link from 'next/link';

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

  return (
    <div className="space-y-8 pb-10">
      
      {/* ========================================== */}
      {/* WELCOME BANNER (Glassmorphic) */}
      {/* ========================================== */}
      <div className="relative p-6 lg:p-8 rounded-3xl overflow-hidden glass-panel border border-border/60">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5 font-semibold">
              Currently targeting <span className="text-indigo-400">{user?.targetTitle}</span> positions. You have {stats.interviewing} active loops.
            </p>
          </div>
          <Link 
            href="/tracker" 
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
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
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Applied</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Briefcase className="h-4 w-4" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold">{stats.applied}</h3>
            <span className="text-[10px] text-zinc-500 font-bold mt-1 block">active tracking</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Interviews</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Clock className="h-4 w-4" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold">{stats.interviewing}</h3>
            <span className="text-[10px] text-zinc-500 font-bold mt-1 block">interviews pending</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Offers</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><CheckCircle2 className="h-4 w-4" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold">{stats.offered}</h3>
            <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Congratulations!</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rejections</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400"><XCircle className="h-4 w-4" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold">{stats.rejected}</h3>
            <span className="text-[10px] text-zinc-500 font-bold mt-1 block">failures build strength</span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* RESPONSIVE LAYOUT MATRIX (Multi-col) */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Charts and Trends) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-extrabold text-base">Application Trend</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Summary of applications vs. interview call-backs</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                <TrendingUp className="h-3.5 w-3.5" />
                +24% MoM
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={applicationHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="appliedColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0d0c15', border: '1px solid #222030', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="applied" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#appliedColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50">
            <h3 className="font-extrabold text-base mb-5">Recent Tracking Events</h3>
            <div className="relative pl-6 border-l border-border space-y-6">
              {jobs.slice(0, 3).map((job, idx) => (
                <div key={job._id || idx} className="relative">
                  <div className="absolute -left-[30px] top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background"></div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground block">{new Date(job.dateApplied).toLocaleDateString()}</span>
                    <h4 className="text-xs font-bold mt-0.5">{job.company} &bull; <span className="text-muted-foreground">{job.position}</span></h4>
                    <p className="text-[11px] text-zinc-500 mt-1 truncate">{job.notes || 'No description updates recorded.'}</p>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="text-center text-xs text-muted-foreground py-4">No events logged yet. Create your first job tracker card!</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (AI Insights, Completion, Upcoming) */}
        <div className="space-y-6">
          
          {/* Profile Completion Score Dial */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground mb-4">Profile Completion</h3>
            <div className="relative h-28 w-28 flex items-center justify-center">
              {/* Radial circle representation */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" stroke="currentColor" className="text-zinc-800 dark:text-zinc-900" strokeWidth="6" fill="transparent" />
                <circle cx="56" cy="56" r="46" stroke="currentColor" className="text-indigo-500" strokeWidth="6" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 46} 
                        strokeDashoffset={2 * Math.PI * 46 * (1 - (user?.profileCompletion || 78) / 100)} />
              </svg>
              <span className="text-2xl font-extrabold">{user?.profileCompletion || 78}%</span>
            </div>
            <p className="text-xs text-zinc-400 font-semibold mt-4">
              Add your current resume to raise your score to <span className="text-emerald-400">90%+</span>
            </p>
          </div>

          {/* AI Career Insights */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50 bg-indigo-950/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-500/10 rounded-full blur-xl"></div>
            <div className="flex items-center gap-2 mb-3.5 text-indigo-400">
              <Sparkles className="h-4.5 w-4.5" />
              <h3 className="font-bold text-xs uppercase tracking-wider">AI Pilot Insights</h3>
            </div>
            <ul className="space-y-3.5">
              <li className="text-xs leading-normal">
                <span className="font-bold text-zinc-200">ATS Optimization Warning:</span> Based on your target title <span className="text-indigo-400">{user?.targetTitle}</span>, you are missing 4 keywords. Consider uploading your resume.
              </li>
              <li className="text-xs leading-normal">
                <span className="font-bold text-zinc-200">Interview Readiness:</span> You have an upcoming loop. Try running mock questions on SSR/SSG.
              </li>
            </ul>
          </div>

          {/* Upcoming mock schedule / interviews list */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50">
            <h3 className="font-extrabold text-sm mb-4">Upcoming Schedule</h3>
            <div className="space-y-3.5">
              {upcomingInterviews.map((item: any) => (
                <div key={item._id} className="p-3.5 rounded-xl bg-secondary border border-border/60 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0"><Calendar className="h-4 w-4" /></div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold truncate">{item.company} &bull; <span className="text-muted-foreground">{item.position}</span></h4>
                    <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{item.stage}</p>
                    <span className="text-[9px] text-indigo-400 font-bold mt-1 block">
                      {item.date.toLocaleDateString()} at {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {upcomingInterviews.length === 0 && (
                <div className="text-center text-xs text-muted-foreground py-4">No interviews scheduled. Update your application tracking cards to configure schedules!</div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
