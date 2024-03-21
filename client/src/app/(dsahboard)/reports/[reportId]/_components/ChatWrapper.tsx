'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Loader2, XCircle } from 'lucide-react';

import Messages from './Messages';
import ChatInput from './ChatInput';
import { buttonVariants } from '@/components/ui/button';

interface ChatWrapperProps {
  fileId: string;
}

export default function ChatWrapper({ fileId }: ChatWrapperProps) {
  const { data, isLoading } = useQuery({
    queryKey: [`file_status_${fileId}`],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        status: 'SUCCESS',
      };
    },
  });

  if (isLoading) {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-background dark:divide-gray-800">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Loading...</h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput fileId={fileId} disabled />
      </div>
    );
  }

  if (data?.status === 'PROCESSING') {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-background dark:divide-gray-800">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold">Processing PDF...</h3>
            <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
          </div>
        </div>

        <ChatInput fileId={fileId} disabled />
      </div>
    );
  }

  if (data?.status === 'FAILED') {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-background dark:divide-gray-800">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="text-xl font-semibold">Too many pages in PDF</h3>
            <p className="text-sm text-zinc-500">
              Your <span className="font-medium">Free</span> plan supports up to
              5 pages per PDF.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: 'secondary',
                className: 'mt-4',
              })}
            >
              <ChevronLeft className="mr-1.5 h-3 w-3" /> Back
            </Link>
          </div>
        </div>

        <ChatInput fileId={fileId} disabled />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-background dark:divide-gray-800">
      <div className="flex-co mb-28 flex flex-1 justify-between">
        <Messages fileId={fileId} />
      </div>

      <ChatInput fileId={fileId} />
    </div>
  );
}
