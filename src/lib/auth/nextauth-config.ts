/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { nextAuthApiClient } from '@/lib/api/nextauth-client';
import type { User } from '@/lib/api/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      // @ts-ignore
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Appeler notre API de connexion
          const response = await nextAuthApiClient.post<{
            message: string;
            data: {
              user: User;
              token: string;
            };
          }>('/opened/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          if (response.data.data.user && response.data.data.token) {
            const { user, token } = response.data.data;
            
            return {
              id: user.id.toString(),
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              type: user.type,
              // @ts-ignore
              isEmailVerified: user.isEmailVerified,
              accessToken: token,
            };
          }

          return null;
        } catch (error: any) {
          // Gérer les erreurs spéciales (vérification email requise)
          if (error.response?.data?.data?.requiresVerification) {
            throw new Error(JSON.stringify({
              type: 'VERIFICATION_REQUIRED',
              message: error.response.data.message,
              userId: error.response.data.data.userId,
              email: error.response.data.data.email,
            }));
          }

          console.error('NextAuth login error:', error);
          throw new Error(error.response?.data?.message || 'Erreur de connexion');
        }
      }
    })
  ],
  
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 heures
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 24 heures
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Lors de la première connexion, stocker les données utilisateur dans le token
      if (account && user) {
        token.accessToken = (user as any).accessToken;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.phone = (user as any).phone;
        token.type = (user as any).type;
        token.isEmailVerified = (user as any).isEmailVerified;
        token.userId = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      // Passer les données du token à la session
      if (token) {
        session.user.id = token.userId as string;
        session.accessToken = token.accessToken as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phone = token.phone as string;
        session.user.type = token.type as string;
        session.user.isEmailVerified = token.isEmailVerified as boolean;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Gérer les redirections après connexion
      // Si l'URL est relative, la construire à partir de baseUrl
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Si l'URL appartient au même domaine, l'autoriser
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Sinon, rediriger vers la page d'accueil
      return baseUrl;
    }
  },

  events: {
    async signOut(message) {
    }
  },

  debug: process.env.NODE_ENV === 'development',
};
