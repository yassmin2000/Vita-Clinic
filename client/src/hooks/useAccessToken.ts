import { useSession } from 'next-auth/react';

export default function useAccessToken() {
  const { data: session } = useSession();

  if (session && session.backendTokens.accessToken) {
    return session.backendTokens.accessToken;
  }

  return null;
}
