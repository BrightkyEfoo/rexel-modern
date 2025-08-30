import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query/provider";
import { CartProvider } from "@/lib/providers/cart-provider";
import { SessionProvider as CartSessionProvider } from "@/lib/providers/session-provider";
import { NextAuthProvider } from "@/lib/providers/nextauth-provider";
import { appConfig } from "@/lib/config/app";
import { Toaster } from "@/components/ui/toaster";
import { PageTracker } from "@/components/ui/page-tracker";
import { PageTrackerDebug } from "@/components/ui/page-tracker-debug";
import { CartDebugPanel } from "@/components/debug/CartDebugPanel";
import "@/lib/debug/cart-debug-utils";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: appConfig.seo.title,
  description: appConfig.seo.description,
  keywords: appConfig.seo.keywords,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body
        suppressHydrationWarning
        className="antialiased bg-background text-foreground font-sans"
      >
        <Suspense fallback={<></>}>
          <NextAuthProvider>
            <QueryProvider>
              <CartSessionProvider>
                <CartProvider>
                  <PageTracker />
                  {children}
                  <Toaster />
                  <PageTrackerDebug />
                  <CartDebugPanel />
                </CartProvider>
              </CartSessionProvider>
            </QueryProvider>
          </NextAuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
