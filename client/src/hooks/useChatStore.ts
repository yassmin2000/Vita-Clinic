import { create } from 'zustand';

import type { Message } from '@/types/appointments.type';

interface ChatStore {
  addMessage: () => void;
  message: string;
  setMessage: (message: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addNewMessage: (message: Message) => void;
  deleteLastMessage: () => void;
  updateMessage: (id: string, text: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  addMessage: () => {},
  message: '',
  setMessage: (message: string) => set({ message }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  messages: [],
  setMessages: (messages: any[]) => set({ messages }),
  addNewMessage: (message: any) =>
    set((state) => ({ messages: [message, ...state.messages] })),
  deleteLastMessage: () =>
    set((state) => ({ messages: state.messages.slice(1) })),
  updateMessage: (id: string, text: string) =>
    set((state) => {
      const messages = state.messages.map((message) => {
        if (message.id === id) {
          return { ...message, message: text };
        }
        return message;
      });
      return { messages };
    }),
}));
