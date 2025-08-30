'use client';

import { useCurrentPageTracker } from '@/lib/hooks/useAuthRedirect';
import { useEffect, useState } from 'react';

export function PageTrackerDebug() {
  const { getCurrentPage, clearCurrentPage } = useCurrentPageTracker();
  const [currentPage, setCurrentPage] = useState<string>('');

  useEffect(() => {
    setCurrentPage(getCurrentPage());
  }, [getCurrentPage]);

  // Afficher seulement en mode développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
      <div className="font-bold mb-1">Page Tracker Debug</div>
      <div className="mb-2">
        <strong>Current Page:</strong> {currentPage}
      </div>
      <div className="mb-2">
        <strong>Auth Redirect:</strong> {typeof window !== 'undefined' ? localStorage.getItem('auth_redirect_url') || 'none' : 'none'}
      </div>
      <button
        onClick={() => {
          clearCurrentPage();
          localStorage.removeItem('auth_redirect_url');
          setCurrentPage(getCurrentPage());
        }}
        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
      >
        Clear All
      </button>
    </div>
  );
}
