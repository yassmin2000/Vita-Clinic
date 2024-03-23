import { useSession } from 'next-auth/react';

export default function useUserRole() {
  const { data: session } = useSession();

  if (session && session.user.role) {
    return session.user.role;
  }

  return null;
}
