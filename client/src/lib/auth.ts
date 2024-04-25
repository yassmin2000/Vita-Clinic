import { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import axios from 'axios';
import { signOut } from 'next-auth/react';

async function refreshToken(token: JWT): Promise<JWT> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {},
      {
        headers: {
          authorization: `Refresh ${token.backendTokens.refreshToken}`,
        },
      }
    );

    return {
      ...token,
      backendTokens: response.data,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'joedoe@gmail.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const { email, password } = credentials;

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            email,
            password,
          }
        );

        if (response.status === 201) {
          return response.data;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }

      if (new Date().getTime() < token.backendTokens.expiresIn) {
        return token;
      }

      return await refreshToken(token);
    },

    async session({ token, session }) {
      if (token) {
        session.user = token.user;
        session.backendTokens = token.backendTokens;
        session.error = token.error;
      }
      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);

export const getAccessToken = async () => {
  const session = await getAuthSession();
  if (session && session.backendTokens.accessToken) {
    return session.backendTokens.accessToken;
  }
  return null;
};

export const getUserRole = async () => {
  const session = await getAuthSession();
  if (session && session.user.role) {
    return { role: session.user.role, isSuperAdmin: session.user.isSuperAdmin };
  }

  return { role: null, isSuperAdmin: false };
};
