'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSocket } from '@/context/SocketContext';
import { api } from '@/services/api';
import { 
  LayoutDashboard, Briefcase, FileText, MessageSquareCode, 
  Award, AreaChart, ShieldAlert, Settings, LogOut, Bell,
  Sun, Moon, Menu, X, Check
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { socket } = useSocket();
  const router = useRouter();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile menu toggle if needed

  // Auth Guard redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load initial notifications
  useEffect(() => {
    if (user) {
      api.notifications.getNotifications()
        .then(res => {
          if (res.success) setNotifications(res.data);
        })
        .catch(err => console.error('Error fetching notifications:', err));
    }
  }, [user]);

  // Listen for real-time WebSocket alerts
  useEffect(() => {
    if (socket) {
      socket.on('notification', (notif: any) => {
        setNotifications(prev => [notif, ...prev]);
        // Optional: play subtle sound or show custom toast
      });
      return () => {
        socket.off('notification');
      };
    }
  }, [socket]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#030207]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <span className="text-sm text-zinc-400 font-medium">Authorizing dashboard access...</span>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await api.notifications.markAsRead(id);
      if (res.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      // Offline fallback
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Job Tracker', href: '/tracker', icon: Briefcase },
    { name: 'Resume AI', href: '/resume', icon: FileText },
    { name: 'Interview Prep', href: '/interview', icon: MessageSquareCode },
    { name: 'Skills & Roadmap', href: '/skills', icon: Award },
    { name: 'Analytics', href: '/analytics', icon: AreaChart },
    ...(user.role === 'admin' ? [{ name: 'Admin Control', href: '/admin', icon: ShieldAlert }] : []),
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row relative">
      
      {/* ========================================== */}
      {/* DESKTOP SIDEBAR (Visible lg+) */}
      {/* ========================================== */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0 shrink-0 z-30 justify-between">
        <div>
          {/* Logo Brand */}
          <div className="px-6 py-6 flex items-center gap-3.5 border-b border-border">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-extrabold text-lg">C</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gradient">CareerOS</span>
          </div>

          {/* Nav Links */}
          <nav className="px-4 py-6 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group cursor-pointer ${
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer context */}
        <div className="p-4 border-t border-border bg-muted/40 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"} 
              alt="Avatar" 
              className="h-9 w-9 rounded-full object-cover border border-border"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate leading-tight">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-zinc-950/40 hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs font-bold transition-all border border-border cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* MOBILE HEADER & NAVIGATION BREAKPOINTS */}
      {/* ========================================== */}
      <header className="lg:hidden flex items-center justify-between px-5 py-4 bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-extrabold text-base">C</span>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-gradient">CareerOS</span>
        </div>

        {/* Right side utility icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground transition-all cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Mobile Notifications badge */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground transition-all cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 bg-indigo-600 text-[10px] text-white font-extrabold flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* MAIN VIEWPORT AND TOPBAR FOR DESKTOP */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        
        {/* Desktop Topbar Utilities (Visible lg+) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
          <h2 className="font-extrabold text-lg text-muted-foreground capitalize">
            {pathname.replace('/', '').replace('-', ' ') || 'Overview'}
          </h2>

          <div className="flex items-center gap-5">
            {/* Theme selector */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border/80 text-muted-foreground transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notifications panel dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border/80 text-muted-foreground transition-all cursor-pointer relative"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-indigo-600 text-[10px] text-white font-extrabold flex items-center justify-center rounded-full border border-card">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Glass Dropdown Panel */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-3.5 w-80 glass-panel border border-border rounded-2xl shadow-xl py-4 z-50 animate-slide-up">
                  <div className="px-4 pb-2 border-b border-border flex justify-between items-center">
                    <span className="font-bold text-sm text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto no-scrollbar py-1 divide-y divide-border">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-muted-foreground font-medium">
                        No notifications found
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id || Math.random()} 
                          className={`p-3.5 flex flex-col gap-1 transition-all ${
                            !notif.read ? 'bg-indigo-600/5' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs leading-normal">{notif.title}</span>
                            {!notif.read && (
                              <button 
                                onClick={() => handleMarkAsRead(notif._id)}
                                className="h-4 w-4 rounded bg-secondary hover:bg-indigo-600/20 flex items-center justify-center text-indigo-400 cursor-pointer"
                              >
                                <Check className="h-2.5 w-2.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-normal">{notif.message}</p>
                          <span className="text-[9px] text-zinc-500 mt-1 font-medium">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar quick badge */}
            <div className="flex items-center gap-2.5 border-l border-border pl-4">
              <img 
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"} 
                alt="Avatar" 
                className="h-8.5 w-8.5 rounded-full object-cover border border-border"
              />
              <span className="text-sm font-semibold text-muted-foreground">{user.name.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Mobile Notifications dropdown banner */}
        {showNotifDropdown && lgNotifFallback()}

        {/* Core Main content slots */}
        <main className="flex-1 p-5 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* ========================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Visible md/sm) */}
      {/* ========================================== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center py-2.5 px-3.5 z-40 backdrop-blur-md">
        {navigationItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-5.5 w-5.5" />
              <span className="text-[9px] mt-1 font-bold tracking-tight">{item.name.replace(' & Roadmap', '').replace(' AI', '')}</span>
            </Link>
          );
        })}
        {/* Additional actions sheet toggle / settings */}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
            pathname === '/settings' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Settings className="h-5.5 w-5.5" />
          <span className="text-[9px] mt-1 font-bold tracking-tight">Settings</span>
        </Link>
      </nav>

    </div>
  );

  function lgNotifFallback() {
    return (
      <div className="lg:hidden fixed top-[69px] left-0 right-0 glass-panel border-b border-border z-40 p-4 max-h-72 overflow-y-auto divide-y divide-border animate-slide-up">
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Alerts Feed</span>
          <button 
            onClick={() => {
              handleMarkAllAsRead();
              setShowNotifDropdown(false);
            }} 
            className="text-[10px] text-indigo-400 font-bold"
          >
            Mark all read
          </button>
        </div>
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground font-medium">No alerts today</div>
        ) : (
          notifications.map((notif) => (
            <div key={notif._id || Math.random()} className="py-3 flex flex-col gap-0.5">
              <div className="flex justify-between">
                <span className="font-bold text-xs">{notif.title}</span>
                {!notif.read && (
                  <button onClick={() => handleMarkAsRead(notif._id)} className="h-4 w-4 flex items-center justify-center text-indigo-400">
                    <Check className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">{notif.message}</p>
            </div>
          ))
        )}
      </div>
    );
  }
}
