'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('careeros-token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.auth.getMe();
        if (data.success) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('[Auth] Token check failed. Setting offline or unauthenticated state.');
        // If we have a mock token, let us mock keep logged in for smooth local demoing
        if (token === 'mock-token-abc') {
          const mockMe = await api.auth.getMe();
          setUser(mockMe.user);
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await api.auth.login(credentials);
      if (data.success) {
        localStorage.setItem('careeros-token', data.accessToken);
        localStorage.setItem('careeros-refresh-token', data.refreshToken);
        setUser(data.user);
        router.push('/dashboard');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: any) => {
    setLoading(true);
    try {
      const data = await api.auth.register(payload);
      if (data.success) {
        localStorage.setItem('careeros-token', data.accessToken);
        localStorage.setItem('careeros-refresh-token', data.refreshToken);
        setUser(data.user);
        router.push('/dashboard');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('careeros-token');
    localStorage.removeItem('careeros-refresh-token');
    setUser(null);
    router.push('/login');
  };

  const updateProfile = async (profileData: any) => {
    try {
      const data = await api.auth.updateProfile(profileData);
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
