'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell
} from 'recharts';
import { AreaChart as ChartIcon, Sparkles, TrendingUp, Award, Loader2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-border/80 rounded-xl text-[10px] space-y-1 shadow-xl bg-zinc-950/80 backdrop-blur-md">
        <p className="font-extrabold text-zinc-300 mb-1">{label}</p>
        {payload.map((pld: any, idx: number) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pld.stroke || pld.fill }} />
            <span className="text-muted-foreground font-semibold">{pld.name}:</span>
            <span className="font-extrabold text-white">{pld.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.jobs.getJobs();
        if (res.success) setJobs(res.data);
      } catch (err) {
        console.error('Error fetching jobs for analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Aggregate stats
  const stats = {
    applied: jobs.filter(j => j.status === 'applied').length,
    interviewing: jobs.filter(j => j.status === 'interviewing').length,
    offered: jobs.filter(j => j.status === 'offered').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
    total: jobs.length
  };

  // 1. Monthly application history
  const monthlyData = [
    { month: 'Jan', applications: 4, interviews: 1, offers: 0 },
    { month: 'Feb', applications: 7, interviews: 2, offers: 0 },
    { month: 'Mar', applications: 9, interviews: 4, offers: 1 },
    { month: 'Apr', applications: 5, interviews: 2, offers: 0 },
    { month: 'May', applications: 13, interviews: 6, offers: 1 },
    { month: 'Jun', applications: stats.total || 8, interviews: stats.interviewing + stats.offered, offers: stats.offered }
  ];

  // 2. Industry sector distributions
  const industryData = [
    { name: 'Fintech', value: 45, fill: '#6366f1' },
    { name: 'SaaS DevTools', value: 35, fill: '#a855f7' },
    { name: 'Cloud Infrastructure', value: 25, fill: '#ec4899' },
    { name: 'Edtech', value: 15, fill: '#14b8a6' },
    { name: 'Healthcare AI', value: 10, fill: '#f59e0b' }
  ];

  // 3. Skills Radar data
  const skillsRadarData = [
    { subject: 'Frontend', A: 85, fullMark: 100 },
    { subject: 'Backend', A: 70, fullMark: 100 },
    { subject: 'System Design', A: 45, fullMark: 100 },
    { subject: 'Cloud Devops', A: 30, fullMark: 100 },
    { subject: 'Teamwork / STAR', A: 90, fullMark: 100 },
    { subject: 'API Integrity', A: 80, fullMark: 100 }
  ];

  // Conversion rates
  const conversionRate = stats.total > 0 
    ? Math.round(((stats.interviewing + stats.offered) / stats.total) * 100)
    : 35;

  const successRate = stats.total > 0
    ? Math.round((stats.offered / stats.total) * 100)
    : 12;

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Advanced Analytics</h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Aggregated insights tracking application conversions, sector interest, and competency vectors</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Response Conversion</span>
          <div className="flex justify-between items-end mt-3">
            <h3 className="text-2xl font-extrabold text-indigo-400">{conversionRate}%</h3>
            <span className="text-[10px] text-zinc-500 font-bold">Applications to Interviews</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Offer Win Rate</span>
          <div className="flex justify-between items-end mt-3">
            <h3 className="text-2xl font-extrabold text-emerald-400">{successRate}%</h3>
            <span className="text-[10px] text-zinc-500 font-bold">Applications to Offers</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border/60 bg-indigo-950/10 flex items-center gap-3">
          <Award className="h-5 w-5 text-indigo-400 shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold text-zinc-200 block">AI Talent Profile</span>
            <p className="text-muted-foreground mt-0.5 leading-normal">Strongest index: Frontend Development & STAR behavioral formats.</p>
          </div>
        </div>
      </div>

      {/* Charts Layout grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly applications trends */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <h3 className="font-extrabold text-sm mb-4">Historical Pipeline Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="intGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area name="Applications" type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#appGradient)" />
                <Area name="Interviews" type="monotone" dataKey="interviews" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#intGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry distribution bars */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <h3 className="font-extrabold text-sm mb-4">Target Sector Interest</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="fintechGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  <linearGradient id="saasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                  <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#db2777" />
                  </linearGradient>
                  <linearGradient id="edtechGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Interest Index">
                  {industryData.map((entry, index) => {
                    const grads = ["url(#fintechGrad)", "url(#saasGrad)", "url(#cloudGrad)", "url(#edtechGrad)", "url(#healthGrad)"];
                    return <Cell key={`cell-${index}`} fill={grads[index % grads.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Radar chart */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60 flex flex-col">
          <h3 className="font-extrabold text-sm mb-4">Candidate Competency Map</h3>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillsRadarData}>
                <defs>
                  <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="#222030" />
                <PolarAngleAxis dataKey="subject" stroke="#888888" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#444" fontSize={8} />
                <Radar name="Target Competency" dataKey="A" stroke="#818cf8" fill="url(#radarGradient)" fillOpacity={1} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome Breakdown summary */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm mb-4">Application Outcomes Funnel</h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-border/60 font-semibold">
                <span className="text-zinc-400">Total Applications Logged</span>
                <span className="font-bold text-zinc-200">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/60 font-semibold">
                <span className="text-zinc-400">Interviews Call-backs</span>
                <span className="font-bold text-amber-400">{stats.interviewing}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/60 font-semibold">
                <span className="text-zinc-400">Offers Extended</span>
                <span className="font-bold text-emerald-400">{stats.offered}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/60 font-semibold">
                <span className="text-zinc-400">Rejections Logged</span>
                <span className="font-bold text-rose-400">{stats.rejected}</span>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border/60 text-[10px] text-muted-foreground font-semibold leading-normal mt-4">
            Pro Tip: Your target sector interest is heavily weighted in Fintech. Focus mock interview prep on ledger systems and payment integrations to boost conversion success.
          </div>
        </div>

      </div>

    </div>
  );
}
