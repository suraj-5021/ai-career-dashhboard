'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#030207] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm font-semibold mb-6 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Glass Card */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl relative">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
              <span className="text-white font-extrabold text-2xl">C</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome to CareerOS</h2>
            <p className="text-zinc-500 text-sm mt-1.5 font-medium">Elevate your job search today</p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-sm transition-all focus:ring-2 focus:ring-indigo-500/25"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-sm transition-all focus:ring-2 focus:ring-indigo-500/25 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying account...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#030207] px-3 text-zinc-600 font-bold tracking-wider">Or continue with</span>
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
              className="flex items-center justify-center py-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
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
              className="flex items-center justify-center py-2.5 rounded-lg border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
            >
              GitHub
            </button>
          </div>

          {/* Quick Review Shortcuts */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/10 flex flex-col gap-2.5">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest text-center">Quick Reviewer Shortcuts</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('user')}
                className="flex-1 py-1.5 rounded-lg bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-500/15 text-indigo-300 text-xs font-semibold transition-all cursor-pointer text-center"
              >
                Autofill User Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex-1 py-1.5 rounded-lg bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-500/15 text-indigo-300 text-xs font-semibold transition-all cursor-pointer text-center"
              >
                Autofill Admin Demo
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <span className="text-xs text-zinc-500 font-medium">Don't have an account? </span>
            <Link href="/register" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
