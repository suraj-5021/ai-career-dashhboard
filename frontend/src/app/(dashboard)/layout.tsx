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
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row relative overflow-x-hidden">
      
      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================== */}
      {/* SIDEBAR (Slide-in mobile/tablet, Sticky desktop) */}
      {/* ========================================== */}
      <aside 
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 lg:z-30 flex flex-col w-64 bg-card border-r border-border h-screen shrink-0 justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-extrabold text-lg">C</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gradient">CareerOS</span>
            </div>
            {/* Mobile close button */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center border border-border/80"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
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
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer min-h-[44px] ${
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 shrink-0 ${
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
              className="h-10 w-10 rounded-full object-cover border border-border"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate leading-tight">{user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-zinc-950/40 hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs font-bold transition-all border border-border cursor-pointer min-h-[44px]"
          >
            <LogOut className="h-4 w-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* MOBILE HEADER & NAVIGATION BREAKPOINTS */}
      {/* ========================================== */}
      <header className="lg:hidden flex items-center justify-between px-5 py-3 bg-card border-b border-border sticky top-0 z-40 min-h-[64px]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 -ml-2 rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center border border-transparent hover:bg-secondary/40"
            aria-label="Open menu"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-extrabold text-base">C</span>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-gradient">CareerOS</span>
        </div>

        {/* Right side utility icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center border border-border/45"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Mobile Notifications badge */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-all cursor-pointer relative min-w-[44px] min-h-[44px] flex items-center justify-center border border-border/45 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
              aria-label="Toggle notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4.5 w-4.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-indigo-600 text-[8px] text-white font-extrabold items-center justify-center border border-card">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* MAIN VIEWPORT AND TOPBAR FOR DESKTOP */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 pb-12 lg:pb-0">
        
        {/* Desktop Topbar Utilities (Visible lg+) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30 min-h-[70px]">
          <h2 className="font-extrabold text-lg text-muted-foreground capitalize">
            {pathname.replace('/', '').replace('-', ' ') || 'Overview'}
          </h2>

          <div className="flex items-center gap-4">
            {/* Theme selector */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-secondary hover:bg-secondary/85 border border-border/80 text-muted-foreground transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Notifications panel dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-3 rounded-xl bg-secondary hover:bg-secondary/85 border border-border/80 text-muted-foreground transition-all cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-indigo-500/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4.5 w-4.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-indigo-600 text-[9px] text-white font-extrabold items-center justify-center border border-card">
                      {unreadCount}
                    </span>
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
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer min-h-[30px]"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto no-scrollbar py-1 divide-y divide-border">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center flex flex-col items-center justify-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-zinc-500">
                          <Bell className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-xs text-zinc-400 font-bold mt-1">All caught up!</span>
                        <span className="text-[10px] text-zinc-500 font-medium px-4">You have read all recent alerts in your feed.</span>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id || Math.random()} 
                          className={`p-3.5 flex flex-col gap-1 transition-all hover:bg-secondary/20 ${
                            !notif.read ? 'bg-indigo-600/5' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs leading-normal">{notif.title}</span>
                            {!notif.read && (
                              <button 
                                onClick={() => handleMarkAsRead(notif._id)}
                                className="h-6 w-6 rounded bg-secondary hover:bg-indigo-600/20 flex items-center justify-center text-indigo-400 cursor-pointer border border-transparent hover:border-indigo-500/15 min-h-[24px] min-w-[24px]"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-normal">{notif.message}</p>
                          <span className="text-[9px] text-zinc-500 mt-1 font-medium font-sans">
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
        <main className="flex-1 p-5 lg:p-8 overflow-y-auto min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-70px)]">
          {children}
        </main>
      </div>

    </div>
  );

  function lgNotifFallback() {
    return (
      <div className="lg:hidden fixed top-[64px] left-0 right-0 glass-panel border-b border-border z-40 p-4 max-h-72 overflow-y-auto divide-y divide-border animate-slide-up">
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Alerts Feed</span>
          <button 
            onClick={() => {
              handleMarkAllAsRead();
              setShowNotifDropdown(false);
            }} 
            className="text-[10px] text-indigo-400 font-bold min-h-[30px]"
          >
            Mark all read
          </button>
        </div>
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground font-medium">No alerts today</div>
        ) : (
          notifications.map((notif) => (
            <div key={notif._id || Math.random()} className="py-3 flex flex-col gap-0.5 animate-fade-in">
              <div className="flex justify-between">
                <span className="font-bold text-xs">{notif.title}</span>
                {!notif.read && (
                  <button onClick={() => handleMarkAsRead(notif._id)} className="h-6 w-6 flex items-center justify-center text-indigo-400 min-h-[24px] min-w-[24px]">
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
