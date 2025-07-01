'use client';

import { type ReactNode } from 'react';

interface ClientBodyProps {
  children: ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  return (
    <body suppressHydrationWarning className="antialiased bg-background text-foreground font-sans">
      {children}
    </body>
  );
}
