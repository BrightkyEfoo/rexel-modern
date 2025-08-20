'use client';

import { useSessionId } from '@/lib/hooks/useSessionId';

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  // Initialiser le sessionId
  useSessionId();
  
  return <>{children}</>;
}
