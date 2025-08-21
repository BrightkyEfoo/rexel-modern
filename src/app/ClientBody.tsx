"use client";

import { Suspense, type ReactNode } from "react";

interface ClientBodyProps {
  children: ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  return (
    <Suspense fallback={<div></div>}>
      <body
        suppressHydrationWarning
        className="antialiased bg-background text-foreground font-sans"
      >
        {children}
      </body>
    </Suspense>
  );
}
