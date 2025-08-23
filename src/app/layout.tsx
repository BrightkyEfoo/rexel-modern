import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientBody from './ClientBody';
import { QueryProvider } from '@/lib/query/provider';
import { CartProvider } from '@/lib/providers/cart-provider';
import { SessionProvider as CartSessionProvider } from '@/lib/providers/session-provider';
import { NextAuthProvider } from '@/lib/providers/nextauth-provider';
import { appConfig } from '@/lib/config/app';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
      <ClientBody>
        <NextAuthProvider>
          <QueryProvider>
            <CartSessionProvider>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </CartSessionProvider>
          </QueryProvider>
        </NextAuthProvider>
      </ClientBody>
    </html>
  );
}
