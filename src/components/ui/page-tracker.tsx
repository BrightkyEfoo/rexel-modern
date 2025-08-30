'use client';

import { useCurrentPageTracker } from '@/lib/hooks/useAuthRedirect';

export function PageTracker() {
  useCurrentPageTracker();
  return null;
}
