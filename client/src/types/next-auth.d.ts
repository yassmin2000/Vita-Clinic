import NextAuth from 'next-auth/next';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      isSuperAdmin: boolean;
      firstName: string;
      lastName: string;
      avatarURL: string;
      sex: string;
      phoneNumber: string;
      address: string;
      enableDicomCaching: boolean;
      enableDicomCompression: boolean;
      enableDicomCleanup: boolean;
      cleanupDuration: number;
      createdAt: string;
      updatedAt: string;
    };

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };

    error?: string;
  }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      email: string;
      role: string;
      isSuperAdmin: boolean;
      firstName: string;
      lastName: string;
      avatarURL: string;
      sex: string;
      phoneNumber: string;
      address: string;
      enableDicomCaching: boolean;
      enableDicomCompression: boolean;
      enableDicomCleanup: boolean;
      cleanupDuration: number;
      createdAt: string;
      updatedAt: string;
    };

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };

    error?: string;
  }
}
