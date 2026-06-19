'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { 
  ShieldAlert, Users, Server, Cpu, Database, 
  Activity, RefreshCw, AlertTriangle, Loader2 
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [metRes, usrRes] = await Promise.all([
        api.admin.getMetrics(),
        api.admin.getUsers()
      ]);
      if (metRes.success) setMetrics(metRes.data);
      if (usrRes.success) setUsers(usrRes.data);
    } catch (err) {
      console.error('Error fetching admin details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    setUpdatingId(userId);
    try {
      const res = await api.admin.updateUserRole(userId, nextRole);
      if (res.success) {
        setUsers(prev => prev.map(u => (u.id === userId || u._id === userId) ? { ...u, role: nextRole } : u));
      }
    } catch (err) {
      console.error(err);
      // Offline fallback
      setUsers(prev => prev.map(u => (u.id === userId || u._id === userId) ? { ...u, role: nextRole } : u));
    } finally {
      setUpdatingId(null);
    }
  };

  // Unauthorized page block
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-border/60 text-center mt-12 space-y-5">
        <div className="h-14 w-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Access Denied</h3>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            You do not possess the required administrator security context roles to access the system metrics control panel.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="px-5 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl text-xs font-semibold border border-border cursor-pointer transition-all w-full"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Admin Control Panel</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">Aggregated system diagnostic telemetry and user credentials management</p>
        </div>

        <button
          onClick={loadAdminData}
          className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground transition-all cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* System diagnostics telemetry panel */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-border/60 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-start justify-between">
            <div>
              <span className="text-zinc-550 text-zinc-550 text-zinc-500 block text-[9px] font-bold uppercase">System Uptime</span>
              <span className="text-xs font-extrabold text-zinc-200 mt-2.5 block">{metrics.system.uptime}</span>
            </div>
            <Server className="h-4 w-4 text-zinc-500 shrink-0" />
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-border/60 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-start justify-between">
            <div>
              <span className="text-zinc-550 text-zinc-500 block text-[9px] font-bold uppercase">CPU Load</span>
              <span className="text-xs font-extrabold text-indigo-400 mt-2.5 block">{metrics.system.cpuUsage}</span>
            </div>
            <Cpu className="h-4 w-4 text-indigo-400 shrink-0" />
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-border/60 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-start justify-between">
            <div>
              <span className="text-zinc-550 text-zinc-500 block text-[9px] font-bold uppercase">RAM Utilization</span>
              <span className="text-[10px] font-bold text-zinc-200 mt-2.5 block truncate max-w-[90px]">{metrics.system.memoryUsage}</span>
            </div>
            <Database className="h-4 w-4 text-purple-400 shrink-0" />
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-border/60 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-start justify-between">
            <div>
              <span className="text-zinc-550 text-zinc-500 block text-[9px] font-bold uppercase">API Latency</span>
              <span className="text-xs font-extrabold text-emerald-400 mt-2.5 block">{metrics.system.apiLatency}</span>
            </div>
            <Activity className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-border/60 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-start justify-between">
            <div>
              <span className="text-zinc-550 text-zinc-500 block text-[9px] font-bold uppercase">Database Status</span>
              <span className="text-[9px] font-bold text-amber-400 mt-2.5 block leading-normal">{metrics.system.dbConnection}</span>
            </div>
            <Database className="h-4 w-4 text-amber-500 shrink-0" />
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-border/60 hover:-translate-y-0.5 hover:shadow-md transition-all flex items-start justify-between">
            <div>
              <span className="text-zinc-550 text-zinc-500 block text-[9px] font-bold uppercase">Active Sockets</span>
              <span className="text-xs font-extrabold text-zinc-200 mt-2.5 block">{metrics.system.activeSockets} live</span>
            </div>
            <Users className="h-4 w-4 text-zinc-400 shrink-0" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Users Management list */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-border/60">
          <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2 text-white">
            <Users className="h-4.5 w-4.5 text-indigo-400" />
            Users Management Registry
          </h3>

          <div className="overflow-x-auto no-scrollbar border border-border/80 rounded-xl">
            <table className="w-full text-xs text-left divide-y divide-border/60">
              <thead className="bg-secondary/40 text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-semibold">
                {users.map((usr) => (
                  <tr key={usr.id || usr._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-bold text-zinc-200">{usr.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{usr.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-extrabold uppercase ${
                        usr.role === 'admin' 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'bg-zinc-800/85 bg-zinc-800 text-zinc-400 border border-zinc-700/30'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRoleToggle(usr.id || usr._id, usr.role)}
                        disabled={updatingId === (usr.id || usr._id)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-extrabold disabled:opacity-50 cursor-pointer transition-colors"
                      >
                        {updatingId === (usr.id || usr._id) ? 'Updating...' : 'Toggle Role'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Server Status alerts */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-border/60 bg-red-950/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-red-500/10 rounded-full blur-xl"></div>
            <div className="flex items-center gap-2 mb-3 text-red-400">
              <AlertTriangle className="h-4.5 w-4.5" />
              <h3 className="font-bold text-xs uppercase tracking-wider">System Warnings</h3>
            </div>
            <ul className="space-y-3.5 text-xs">
              <li className="leading-normal">
                <span className="font-bold text-zinc-200">Database Overwrite Check:</span> Using {metrics?.system.dbConnection}. Configure MONGODB_URI environment variables to link Atlas databases in production.
              </li>
              <li className="leading-normal">
                <span className="font-bold text-zinc-200">Auth Token Expiring:</span> Ensure token clocks are synchronized to avoid JWT skew failures.
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-border/60">
            <h3 className="font-extrabold text-sm mb-4">Diagnostics Console</h3>
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 font-mono text-[10px] text-zinc-400 space-y-2 max-h-48 overflow-y-auto no-scrollbar">
              <p className="text-zinc-600">[2026-06-10 14:31:36] SERVER INIT OK</p>
              <p className="text-indigo-400">[2026-06-10 14:31:40] DB FALLBACK INIT: IN-MEMORY SIM ACTIVE</p>
              <p className="text-emerald-400">[2026-06-10 14:32:02] SOCKET LISTENER BIND: OK</p>
              <p className="text-zinc-500">[2026-06-10 14:32:44] USER SIGNIN: user@career.os</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
