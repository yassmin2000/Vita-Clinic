import { useSession } from 'next-auth/react';

export default function useUserCachingSettings() {
  const { data: session } = useSession();

  if (session && session.user.role) {
    return {
      enableDicomCaching: session.user.enableDicomCaching,
      enableDicomCompression: session.user.enableDicomCompression,
      enableDicomCleanup: session.user.enableDicomCleanup,
      cleanupDuration: session.user.cleanupDuration,
    };
  }

  return null;
}
