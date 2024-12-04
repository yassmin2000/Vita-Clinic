'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import NotificationsProvider from '../context/NotificationsProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NotificationsProvider>{children}</NotificationsProvider>
          <ReactQueryDevtools />
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
