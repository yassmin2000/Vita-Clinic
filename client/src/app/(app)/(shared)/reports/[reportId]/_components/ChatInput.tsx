import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useChatStore } from '@/hooks/useChatStore';

interface ChatInputProps {
  fileId: string;
  disabled?: boolean;
}

export default function ChatInput({
  fileId,
  disabled = false,
}: ChatInputProps) {
  const {
    message,
    setMessage,
    isLoading,
    setIsLoading,
    addNewMessage,
    updateMessage,
    deleteLastMessage,
  } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const backupMessage = useRef('');
  const { toast } = useToast();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage('');
      setIsLoading(true);

      await queryClient.cancelQueries({
        queryKey: [`messages_${fileId}`],
      });

      addNewMessage({
        id: crypto.randomUUID(),
        reportId: fileId,
        message,
        createdAt: new Date().toISOString(),
        isUserMessage: true,
      });
    },
    onError: () => {
      setMessage(backupMessage.current);
      deleteLastMessage();
      return toast({
        title: 'Something went wrong',
        description: 'Your message could not be sent, please try again later.',
        variant: 'destructive',
      });
    },
    onSettled: async () => {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: [`messages_${fileId}`] });
    },
    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        return toast({
          title: 'There was a problem sending this message',
          description: 'Please refresh the page and try again',
          variant: 'destructive',
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let accResponse = '';
      let isAIResponseCreated = false;
      const randomId = crypto.randomUUID();

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accResponse += chunkValue;

        if (isAIResponseCreated) {
          updateMessage(randomId, accResponse);
        } else {
          isAIResponseCreated = true;
          addNewMessage({
            id: randomId,
            reportId: fileId,
            message: accResponse,
            createdAt: new Date().toISOString(),
            isUserMessage: false,
          });
        }
      }
    },
  });

  const addMessage = () => {
    sendMessage({ message });
    textareaRef.current?.focus();
  };

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex w-full flex-grow flex-col p-4">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                rows={1}
                maxRows={4}
                autoFocus
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                  }
                }}
                disabled={disabled || isLoading}
                placeholder="Enter your question..."
                className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-light scrollbar-w-2 resize-none py-3 pr-12 text-base"
              />

              <Button
                className="absolute bottom-1.5 right-[8px]"
                aria-label="send message"
                onClick={addMessage}
                disabled={disabled || isLoading}
                type="button"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
