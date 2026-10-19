import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

// Монгол кирилл (Ө, Ү) нь cyrillic-ext-д багтана.
const inter = Inter({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-sans',
  display: 'swap',
});

/** Гол гарчгийн фонт */
const manrope = Manrope({
  weight: '800',
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Цэмбий — хивс, буйдан, матрас, сандал цэвэрлэгээ',
  description:
    'Хивс, буйдан, матрас, сандлын цэвэрлэгээ. Үйлчилгээгээ сагслаад хүсэлт илгээнэ үү — бид холбогдож үнэ, цагийг тохирно.',
};

export const viewport: Viewport = { themeColor: '#000000' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="mn" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
