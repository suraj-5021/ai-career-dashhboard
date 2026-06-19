'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030207] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm font-semibold mb-6 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        {/* Glass Card */}
        <div className="glass-panel rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4">
              <span className="text-white font-extrabold text-2xl">C</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
            <p className="text-zinc-500 text-sm mt-1.5 font-medium">Get started with CareerOS today</p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Suraj Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-sm transition-all focus:ring-2 focus:ring-indigo-500/25"
              />
            </div>

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
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-sm transition-all focus:ring-2 focus:ring-indigo-500/25"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-xs text-zinc-500 font-medium">Already have an account? </span>
            <Link href="/login" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
