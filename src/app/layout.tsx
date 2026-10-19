import type { Metadata, Viewport } from 'next';
import { Golos_Text, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { getDictionary, getLocale } from '@/i18n';
import './globals.css';

// Монгол кирилл (Ө, Ү) нь cyrillic-ext-д багтана.
const inter = Inter({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-sans',
  display: 'swap',
});

/** Гол гарчгийн фонт */
const golos = Golos_Text({
  weight: '700',
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-display',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.title, description: meta.description };
}

export const viewport: Viewport = { themeColor: '#000000' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${inter.variable} ${golos.variable}`}>
      <body>{children}</body>
    </html>
  );
}
