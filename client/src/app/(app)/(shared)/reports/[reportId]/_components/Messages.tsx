import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Loader2, MessageSquare } from 'lucide-react';

import Message from './Message';
import { Skeleton } from '@/components/ui/skeleton';

import { useChat } from '@/hooks/useChat';
import useAccessToken from '@/hooks/useAccessToken';
import type { Message as MessageType } from '@/types/appointments.type';

interface MessagesProps {
  fileId: string;
}

export default function Messages({ fileId }: MessagesProps) {
  const { isLoading: isLoadingAIMessage, messages, setMessages } = useChat();
  const accessToken = useAccessToken();

  const { data, isLoading } = useQuery({
    queryKey: [`messages_${fileId}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${fileId}/messages`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as MessageType[];
      return data.toReversed();
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: 'loading-message',
    isUserMessage: false,
    message: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const totalMessages = [
    ...(isLoadingAIMessage ? [loadingMessage] : []),
    ...messages,
  ];

  const combinedMessages = totalMessages.filter(
    (message, index, self) =>
      index === self.findIndex((m) => m.id === message.id)
  );

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-light scrollbar-w-2 scrolling-touch flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3">
      {combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage === message.isUserMessage;

          return (
            <Message
              key={message.id}
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
            />
          );
        })
      ) : !accessToken || isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
          <p className="text-sm text-zinc-500">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
}
