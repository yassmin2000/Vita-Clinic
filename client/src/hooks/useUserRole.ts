import { useSession } from 'next-auth/react';

export default function useUserRole() {
  const { data: session } = useSession();

  if (session && session.user.role) {
    return { role: session.user.role, isSuperAdmin: session.user.isSuperAdmin };
  }

  return { role: null, isSuperAdmin: false };
}
