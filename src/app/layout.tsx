import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

// Монгол кирилл (Ө, Ү) нь cyrillic-ext-д багтана.
const inter = Inter({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Цэмбий — хивс, буйдан, матрас, сандал цэвэрлэгээ',
  description:
    'Хивс, буйдан, матрас, сандлын цэвэрлэгээ. Үйлчилгээгээ сагслаад хүсэлт илгээнэ үү — бид холбогдож үнэ, цагийг тохирно.',
};

export const viewport: Viewport = { themeColor: '#f7f3ec' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="mn" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
