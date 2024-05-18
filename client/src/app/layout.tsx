import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import './globals.css';
import 'simplebar-react/dist/simplebar.min.css';

import Providers from '@/components/Providers';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vita Clinic - Advanced Oncology Care',
  description:
    'Vita Clinic offers comprehensive oncology care with versatile EMR solutions, dedicated to enhancing patient health and well-being through cutting-edge treatments and compassionate support.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background', inter.className)}>
        <Providers>
          <NextTopLoader color="#2563eb" />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
