'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <ReactQueryDevtools />
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
