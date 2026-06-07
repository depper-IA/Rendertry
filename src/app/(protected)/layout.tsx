'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/AuthContext';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}