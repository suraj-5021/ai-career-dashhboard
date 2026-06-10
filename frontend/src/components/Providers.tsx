'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';

function SocketWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <SocketProvider userId={user ? (user.id || user._id) : null}>
      {children}
    </SocketProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketWrapper>
          {children}
        </SocketWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}
