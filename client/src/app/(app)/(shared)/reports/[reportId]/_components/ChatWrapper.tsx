'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Loader2, RotateCcw, XCircle } from 'lucide-react';

import Messages from './Messages';
import ChatInput from './ChatInput';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

interface ChatWrapperProps {
  fileId: string;
  status: 'initial' | 'processed' | 'failed';
}

export default function ChatWrapper({ fileId, status }: ChatWrapperProps) {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: processReport, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/embeddings', {
        reportId: fileId,
      });

      return response;
    },
    onError: () => {
      return toast({
        title: `Failed to process the report`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      router.refresh();
      return toast({
        title: `Report processed successfully`,
        description: 'The report has been processed successfully.',
      });
    },
  });

  useEffect(() => {
    if (status === 'initial') {
      processReport();
    }
  }, [status]);

  if (status === 'initial') {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-background py-2 dark:divide-gray-800">
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

  if (status === 'failed') {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-background py-2 dark:divide-gray-800">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500" />
            <h3 className="text-xl font-semibold">
              Failed to process PDF. Please try again.
            </h3>
            <p className="text-sm text-zinc-500">
              Something went wrong while processing the PDF. Please try again.
            </p>
            <Button
              onClick={() => processReport()}
              disabled={isPending}
              className="mt-4 flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Process Again
            </Button>
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
