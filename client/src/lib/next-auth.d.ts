import NextAuth from 'next-auth/next';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
      avatarURL: string;
      sex: string;
      phoneNumber: string;
      address: string;
      createdAt: string;
      updatedAt: string;
    };

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
      avatarURL: string;
      sex: string;
      phoneNumber: string;
      address: string;
      createdAt: string;
      updatedAt: string;
    };

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}
