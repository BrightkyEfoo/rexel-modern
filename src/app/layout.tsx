import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientBody from './ClientBody';
import { QueryProvider } from '@/lib/query/provider';
import { appConfig } from '@/lib/config/app';

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
        <QueryProvider>
          {children}
        </QueryProvider>
      </ClientBody>
    </html>
  );
}
