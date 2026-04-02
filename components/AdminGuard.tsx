"use client";

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = (session?.user as any)?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !isAdmin) {
      router.replace("/login");
    }
  }, [session, status, isAdmin, router]);

  if (status === "loading") return <div className="p-10 text-center">Verifying Vault Access...</div>;
  
  // 🚨 RENDER BLOCKER
  if (!session || !isAdmin) return null;

  return <>{children}</>;
}