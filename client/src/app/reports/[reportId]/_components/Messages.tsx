import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { Loader2, MessageSquare } from 'lucide-react';

import Message from './Message';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteQuery } from '@tanstack/react-query';
import { INFINITE_QUERY_LIMIT } from '@/lib/config';
import { useChat } from '@/hooks/useChat';

interface MessagesProps {
  fileId: string;
}

export interface MessageType {
  id: string;
  text: string | JSX.Element;
  createdAt: string;
  isUserMessage: boolean;
}

export const messagesData: MessageType[] = [
  {
    id: '6',
    text: 'Good morning!',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '7',
    text: 'Good morning to you too!',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '8',
    text: 'What are your plans for today?',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '9',
    text: 'I have some work to do and then maybe relax.',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '10',
    text: 'Sounds like a good plan.',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '11',
    text: 'Indeed.',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '12',
    text: 'Have you watched any interesting movies lately?',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '13',
    text: 'Yes, I watched a really good one last night.',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '14',
    text: 'What was it about?',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '15',
    text: 'It was a thriller about a detective solving a murder case.',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '16',
    text: 'That sounds intriguing!',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '17',
    text: 'It definitely was.',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '18',
    text: "I'm thinking of going for a walk later.",
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '19',
    text: 'That sounds like a great idea!',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '20',
    text: 'I find it refreshing.',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '21',
    text: 'Definitely!',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '22',
    text: 'Did you hear about the new restaurant that opened downtown?',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '23',
    text: "No, I haven't. What's it called?",
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '24',
    text: 'It\'s called "The Spice Garden". I\'ve heard good things about it.',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '25',
    text: 'We should check it out sometime.',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '26',
    text: 'Definitely!',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '27',
    text: "What's your favorite type of cuisine?",
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '28',
    text: 'I love Italian food. What about you?',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '29',
    text: "I'm a fan of Chinese cuisine.",
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '30',
    text: "It's always nice to explore different flavors.",
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '31',
    text: 'Absolutely!',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '32',
    text: 'Have you ever traveled abroad?',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '33',
    text: "Yes, I've been to several countries.",
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '34',
    text: 'That sounds amazing! Which was your favorite?',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '35',
    text: 'I really enjoyed my trip to Japan.',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '36',
    text: 'Japan is on my bucket list!',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '37',
    text: 'You should definitely visit if you get the chance.',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '38',
    text: 'I will!',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '39',
    text: "What's your favorite hobby?",
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '40',
    text: 'I enjoy painting in my free time.',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '41',
    text: 'That sounds like a relaxing activity.',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '42',
    text: 'It definitely is.',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '43',
    text: 'What do you like to paint?',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '44',
    text: 'I mostly paint landscapes and portraits.',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '45',
    text: "Sounds like you're quite talented!",
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '46',
    text: 'Thank you!',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '47',
    text: 'Do you have any pets?',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '48',
    text: 'Yes, I have a dog named Max.',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
  {
    id: '49',
    text: 'Dogs make great companions.',
    createdAt: new Date().toISOString(),
    isUserMessage: true,
  },
  {
    id: '50',
    text: 'They certainly do!',
    createdAt: new Date().toISOString(),
    isUserMessage: false,
  },
];

export default function Messages({ fileId }: MessagesProps) {
  const { isLoading: isLoadingAIMessage, messages, setMessages } = useChat();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [`file_messages_${fileId}`],
    queryFn: async ({ pageParam = 1 }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const output = messagesData
        .toReversed()
        .slice(
          (pageParam - 1) * INFINITE_QUERY_LIMIT,
          pageParam * INFINITE_QUERY_LIMIT
        ) as MessageType[];

      return output;
    },
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialData: {
      pages: [],
      pageParams: [1],
    },
    initialPageParam: 1,
  });

  const { ref, entry } = useIntersection({
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  useEffect(() => {
    setMessages(data?.pages.flatMap((page) => page) ?? []);
  }, [data]);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: 'loading-message',
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    // ...(isLoadingAIMessage ? [loadingMessage] : []),
    ...messages,
  ];

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-light scrollbar-w-2 scrolling-touch flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3">
      {combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage === message.isUserMessage;

          if (i === combinedMessages.length - 1) {
            return (
              <Message
                key={message.id}
                ref={ref}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          } else {
            return (
              <Message
                key={message.id}
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          }
        })
      ) : isFetchingNextPage ? (
        <div className="flex w-full flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
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
