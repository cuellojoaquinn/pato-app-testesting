'use client';

import type React from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (requireAdmin && user.rol !== 'admin') {
      router.push('/');
      return;
    }
  }, [user, requireAdmin, router]);

  if (!user) return null;
  if (requireAdmin && user.rol !== 'admin') return null;

  return <>{children}</>;
}
