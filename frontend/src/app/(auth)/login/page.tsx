'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, ArrowLeft, Calendar, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'user' | 'admin') => {
    setError('');
    const credentials = {
      user: { email: 'user@career.os', password: 'password123' },
      admin: { email: 'admin@career.os', password: 'password123' }
    };
    const choice = credentials[role];
    setEmail(choice.email);
    setPassword(choice.password);
  };

  return (
    <div className="min-h-screen bg-[#030207] grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Background radial effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none"></div>

      {/* ========================================== */}
      {/* LEFT COLUMN: HERO ILLUSTRATION (Desktop Only) */}
      {/* ========================================== */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-950/40 border-r border-zinc-900/50 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-500/5 blur-[140px] pointer-events-none"></div>

        {/* Header Branding */}
        <div className="flex items-center gap-3 z-10">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="text-white font-extrabold text-lg">C</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">CareerOS <span className="text-indigo-400 font-medium text-xs px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 ml-1">Pro</span></span>
        </div>

        {/* Mockup Dashboard Section */}
        <div className="relative flex items-center justify-center py-10 z-10">
          <div className="w-full max-w-md relative space-y-6">
            
            {/* Mock Card 1: Kanban ticket */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md shadow-2xl relative group hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-600 opacity-60"></div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">Active Application</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">Interviewing</span>
              </div>
              <h4 className="text-sm font-extrabold text-white">Senior Staff Engineer</h4>
              <p className="text-xs text-zinc-500 mt-1 font-semibold">Stripe &bull; San Francisco, CA</p>
              
              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex justify-between items-center text-[10px] text-zinc-400">
                <span className="flex items-center gap-1.5 font-bold"><Calendar className="h-3.5 w-3.5 text-indigo-400" /> Onsite Loop tomorrow</span>
                <span className="font-bold text-zinc-500">STAR Prep ready</span>
              </div>
            </motion.div>

            {/* Mock Card 2: ATS Score Dial */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -right-8 -top-16 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md shadow-2xl flex items-center gap-4 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="relative h-14 w-14 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="23" stroke="currentColor" className="text-zinc-800" strokeWidth="3" fill="transparent" />
                  <circle cx="28" cy="28" r="23" stroke="currentColor" className="text-indigo-400" strokeWidth="3" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 23} 
                          strokeDashoffset={2 * Math.PI * 23 * 0.18} />
                </svg>
                <span className="text-xs font-extrabold text-white">82%</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">ATS Scorer</span>
                <span className="text-xs font-extrabold text-zinc-200 mt-0.5 block flex items-center gap-1"><Sparkles className="h-3 w-3 text-indigo-400" /> Optimize keywords</span>
              </div>
            </motion.div>

            {/* Mock Card 3: Metrics List */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -left-10 -bottom-8 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md shadow-2xl flex items-center gap-3.5 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Trophy className="h-4.5 w-4.5" /></div>
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Mock Prep Index</span>
                <span className="text-xs font-extrabold text-zinc-200 mt-0.5 block">92/100 behavioral score</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Footer Carousel Info */}
        <div className="z-10 max-w-md">
          <h3 className="text-lg font-bold text-white tracking-tight">Accelerate your career development.</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mt-2 font-medium">
            Join thousands of elite engineers using CareerOS Pro to pass competitive technical loops, audit resume keywords, and track application funnels.
          </p>
        </div>

      </div>

      {/* ========================================== */}
      {/* RIGHT COLUMN: LOGIN FORM SECTION */}
      {/* ========================================== */}
      <div className="flex flex-col justify-center items-center p-6 lg:p-12 z-10 w-full relative">
        <div className="w-full max-w-md">
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm font-semibold mb-6 transition-all group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to landing page
          </Link>

          {/* Glass Card */}
          <div className="glass-panel rounded-3xl p-8 shadow-2xl relative border border-white/5 bg-zinc-950/20 backdrop-blur-xl">
            <div className="flex flex-col items-center mb-8">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4 lg:hidden">
                <span className="text-white font-extrabold text-xl">C</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome back</h2>
              <p className="text-zinc-500 text-sm mt-1.5 font-medium">Sign in to access your CareerOS Pro workspace</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 bg-red-950/20 border border-red-500/15 text-red-400 rounded-xl text-xs font-semibold mb-6 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs transition-all font-semibold pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/15 active:scale-[0.98] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Verifying workspace access...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-900"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#030207] px-3.5 text-zinc-500 font-bold tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => {
                  setError('');
                  setEmail('user@career.os');
                  setPassword('password123');
                }}
                type="button"
                className="flex items-center justify-center py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer hover:border-zinc-700"
              >
                Google
              </button>
              <button
                onClick={() => {
                  setError('');
                  setEmail('admin@career.os');
                  setPassword('password123');
                }}
                type="button"
                className="flex items-center justify-center py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer hover:border-zinc-700"
              >
                GitHub
              </button>
            </div>

            {/* Quick Review Shortcuts */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest text-center">Quick Reviewer Shortcuts</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('user')}
                  className="flex-1 py-2 rounded-xl bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-500/15 text-indigo-300 text-[10px] font-bold transition-all cursor-pointer text-center"
                >
                  Autofill User
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="flex-1 py-2 rounded-xl bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-500/15 text-indigo-300 text-[10px] font-bold transition-all cursor-pointer text-center"
                >
                  Autofill Admin
                </button>
              </div>
            </div>

            <div className="text-center mt-6">
              <span className="text-xs text-zinc-500 font-semibold">Don't have an account? </span>
              <Link href="/register" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
