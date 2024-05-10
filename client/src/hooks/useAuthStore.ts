import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthStore {
  isVerifying: boolean;
  setIsVerifying: (isVerifying: boolean) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isVerifying: false,
      setIsVerifying: (isVerifying: boolean) => set({ isVerifying }),
      email: null,
      setEmail: (email: string | null) => set({ email }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isVerifying: state.isVerifying,
        email: state.email,
      }),
    }
  )
);
