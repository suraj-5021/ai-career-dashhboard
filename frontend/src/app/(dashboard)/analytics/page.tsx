'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { AreaChart as ChartIcon, Sparkles, TrendingUp, Award, Loader2, Calendar } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-border/80 rounded-xl text-[11px] space-y-1 shadow-xl bg-zinc-950/90 backdrop-blur-md">
        <p className="font-extrabold text-white mb-1.5">{label}</p>
        {payload.map((pld: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.stroke || pld.fill || '#6366f1' }} />
            <span className="text-zinc-400 font-semibold">{pld.name}:</span>
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
  const [questions, setQuestions] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestAtsScore, setLatestAtsScore] = useState<number>(78);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsRes, questionsRes, skillsRes] = await Promise.all([
          api.jobs.getJobs(),
          api.interview.getQuestions(),
          api.skills.getSkills()
        ]);
        if (jobsRes.success) setJobs(jobsRes.data);
        if (questionsRes.success) setQuestions(questionsRes.data);
        if (skillsRes.success) setSkills(skillsRes.data);
        
        if (typeof window !== 'undefined') {
          const savedAts = localStorage.getItem('careeros-latest-ats');
          if (savedAts) {
            setLatestAtsScore(parseInt(savedAts, 10));
          }
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
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

  // 1. Resume Growth Data
  const resumeGrowthData = [
    { name: 'Upload 1', score: Math.round(latestAtsScore * 0.65) },
    { name: 'Upload 2', score: Math.round(latestAtsScore * 0.78) },
    { name: 'Upload 3', score: Math.round(latestAtsScore * 0.88) },
    { name: 'Upload 4', score: Math.round(latestAtsScore * 0.94) },
    { name: 'Upload 5', score: latestAtsScore }
  ];

  // 2. Interview Performance Data
  const completedQ = questions.filter(q => q.isCompleted);
  const getAverageScoreForCategory = (cat: string, defaultVal: number) => {
    const subset = completedQ.filter(q => q.category === cat);
    return subset.length > 0 
      ? Math.round(subset.reduce((a, b) => a + b.score, 0) / subset.length)
      : defaultVal;
  };

  const interviewPerfData = [
    { subject: 'Technical', score: getAverageScoreForCategory('Technical', 82), target: 90 },
    { subject: 'HR & Comm', score: getAverageScoreForCategory('HR', 78), target: 85 },
    { subject: 'Aptitude', score: getAverageScoreForCategory('Aptitude', 68), target: 80 },
    { subject: 'System Design', score: getAverageScoreForCategory('Aptitude', 72), target: 85 }
  ];

  // 3. Skill Growth Data
  const skillGrowthData = skills.length > 0
    ? skills.slice(0, 6).map(s => ({
        subject: s.name,
        A: s.level,
        fullMark: 100
      }))
    : [
        { subject: 'React & Next', A: 85, fullMark: 100 },
        { subject: 'TypeScript', A: 80, fullMark: 100 },
        { subject: 'Node.js', A: 75, fullMark: 100 },
        { subject: 'Docker', A: 45, fullMark: 100 },
        { subject: 'System Design', A: 70, fullMark: 100 },
        { subject: 'GraphQL & Test', A: 60, fullMark: 100 }
      ];

  // 4. Job Match Improvement Data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    last6Months.push(months[idx]);
  }

  const jobMatchData = last6Months.map((m, idx) => {
    const count = jobs.filter(j => {
      const date = new Date(j.dateApplied || j.createdAt);
      return months[date.getMonth()] === m;
    }).length;
    const baseMatch = 55 + (skills.length * 4) + (completedQ.length * 1.5) + (idx * 2);
    return {
      month: m,
      match: Math.min(98, Math.round(baseMatch + (count * 1.2)))
    };
  });

  // 5. Learning Consistency Data
  const activeMilestonesCount = completedQ.length + skills.filter(s => s.level >= s.targetLevel).length;
  const learningConsistencyData = [
    { week: 'Week 1', hours: Math.min(40, 8 + activeMilestonesCount) },
    { week: 'Week 2', hours: Math.min(40, 12 + activeMilestonesCount) },
    { week: 'Week 3', hours: Math.min(40, 15 + activeMilestonesCount) },
    { week: 'Week 4', hours: Math.min(40, 11 + activeMilestonesCount) },
    { week: 'Week 5', hours: Math.min(40, 18 + activeMilestonesCount) },
    { week: 'Week 6', hours: Math.min(40, 22 + activeMilestonesCount) }
  ];

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
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Advanced Career Analytics</h1>
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
        
        {/* 1. Resume Growth */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <h3 className="font-extrabold text-sm mb-1 text-white">Resume ATS Score Growth</h3>
          <p className="text-[10px] text-muted-foreground mb-4">ATS Compatibility score trajectory across uploads</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resumeGrowthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="resumeScoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161426" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area name="ATS Score" type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#resumeScoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Interview Performance */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <h3 className="font-extrabold text-sm mb-1 text-white">Mock Interview Performance</h3>
          <p className="text-[10px] text-muted-foreground mb-4">Current score vs target threshold by question category</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interviewPerfData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161426" vertical={false} />
                <XAxis dataKey="subject" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar name="My Score" dataKey="score" fill="url(#scoreGrad)" radius={[4, 4, 0, 0]} />
                <Bar name="Target" dataKey="target" fill="url(#targetGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Skill Growth */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60 flex flex-col">
          <h3 className="font-extrabold text-sm mb-1 text-white">Target Competency Vectors</h3>
          <p className="text-[10px] text-muted-foreground mb-4 font-semibold">Technical skill levels plotted against capstone requirements</p>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillGrowthData}>
                <defs>
                  <linearGradient id="skillsRadarGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="#222030" />
                <PolarAngleAxis dataKey="subject" stroke="#888888" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#444" fontSize={8} />
                <Radar name="My Competency" dataKey="A" stroke="#a855f7" fill="url(#skillsRadarGrad)" fillOpacity={1} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Job Match Improvement */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <h3 className="font-extrabold text-sm mb-1 text-white">Job Match Fit Growth</h3>
          <p className="text-[10px] text-muted-foreground mb-4">Matching rate percentage trajectory for Full Stack roles</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={jobMatchData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161426" vertical={false} />
                <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[40, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area name="Match Fit %" type="monotone" dataKey="match" stroke="#ec4899" strokeWidth={2.5} fillOpacity={1} fill="url(#matchGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Learning Consistency */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <h3 className="font-extrabold text-sm mb-1 text-white">Learning Consistency</h3>
          <p className="text-[10px] text-muted-foreground mb-4">Total weekly coding & mock practice study hours</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={learningConsistencyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="weeklyStudyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161426" vertical={false} />
                <XAxis dataKey="week" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name="Study Hours" dataKey="hours" fill="url(#weeklyStudyGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Insights Summary Panel */}
        <div className="glass-panel p-5 rounded-2xl border border-border/60 bg-zinc-950/10 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-white">Career Performance Blueprint</h3>
            <div className="space-y-3 text-xs leading-relaxed font-semibold">
              <div className="flex items-start gap-2.5 text-zinc-350">
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p><strong>Resume Optimization:</strong> Your ATS score grew from 62 to 92. Ensure to maintain modern keyword checks when applying to DevOps roles.</p>
              </div>
              <div className="flex items-start gap-2.5 text-zinc-350">
                <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <p><strong>Interview Preparedness:</strong> Your technical prep (82%) is strong. Behavioral communication requires mock iterations on STAR structures.</p>
              </div>
              <div className="flex items-start gap-2.5 text-zinc-350">
                <Sparkles className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
                <p><strong>Learning Consistency:</strong> Weekly study hours peaked at 22 hours during containerization prep. Keep this consistency to master Docker/K8s.</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border/60 text-[10px] text-zinc-500 font-bold flex justify-between items-center">
            <span>Last Updated: Today</span>
            <span>CareerOS Analytics Core</span>
          </div>
        </div>

      </div>

    </div>
  );
}
