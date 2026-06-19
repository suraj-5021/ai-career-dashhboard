'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, Cpu, Award, MessageSquare, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#030207]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <span className="text-sm text-zinc-400 font-medium">Syncing profile context...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030207] text-zinc-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-extrabold text-lg">C</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">CareerOS</span>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-sm font-semibold border border-zinc-800 transition-all cursor-pointer"
        >
          Sign In
        </button>
      </header>

      {/* Hero Body */}
      <main className="max-w-7xl mx-auto w-full px-6 flex-1 flex flex-col items-center justify-center text-center py-16 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 animate-fade-in shadow-inner">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          Now Live: CareerOS v1.0
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 max-w-4xl">
          Supercharge Your Job Search with{' '}
          <span className="text-gradient">CareerOS</span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
          The ultimate workspace for modern job seekers. Elevate your resume with AI score feedback, track applications in a Kanban pipeline, and prep for technical loops.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all scale-100 hover:scale-102 cursor-pointer group"
          >
            Launch Dashboard
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800/80 text-zinc-200 border border-zinc-800 font-semibold transition-all cursor-pointer"
          >
            Create Free Account
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-5xl">
          <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900/80 flex flex-col items-center text-center shadow-md">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/15">
              <Briefcase className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-zinc-100">Job Tracker</h3>
            <p className="text-zinc-500 text-sm leading-normal">
              Manage your applications in an interactive Kanban pipeline. Never miss followups.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900/80 flex flex-col items-center text-center shadow-md">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/15">
              <Cpu className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-zinc-100">Resume Analyzer</h3>
            <p className="text-zinc-500 text-sm leading-normal">
              ATS keywords and missing skill suggestions based on your target jobs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900/80 flex flex-col items-center text-center shadow-md">
            <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 border border-pink-500/15">
              <MessageSquare className="h-5 w-5 text-pink-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-zinc-100">Interview Prep</h3>
            <p className="text-zinc-500 text-sm leading-normal">
              AI-generated behavioral and tech questions with real-time grading & feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900/80 flex flex-col items-center text-center shadow-md">
            <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 border border-violet-500/15">
              <Award className="h-5 w-5 text-violet-400" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-zinc-100">Skills Roadmap</h3>
            <p className="text-zinc-500 text-sm leading-normal">
              Analyze gaps between current proficiency and target expectations with custom tracks.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-8 border-t border-zinc-900 text-xs text-zinc-600 z-10 max-w-7xl mx-auto px-6">
        &copy; {new Date().getFullYear()} CareerOS Inc. All rights reserved. Built for funded startup quality evaluation.
      </footer>
    </div>
  );
}
