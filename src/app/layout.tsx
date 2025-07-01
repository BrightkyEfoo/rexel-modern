import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientBody from './ClientBody';
import { QueryProvider } from '@/lib/query/provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Rexel France | Fournisseur de matériel électrique moderne',
  description: 'Leader de la distribution professionnelle de produits et services pour le monde de l\'énergie. Une expérience d\'achat moderne et simplifiée.',
  keywords: 'matériel électrique, Rexel, distribution électrique, éclairage, câbles, appareillage',
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
