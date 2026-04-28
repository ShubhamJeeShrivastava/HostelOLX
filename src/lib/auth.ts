import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });
          const user = await res.json();
          if (res.ok && user) {
            return {
              id: user.user.id.toString(),
              name: user.user.name,
              email: user.user.email,
              college_id: user.user.college_id,
              token: user.token,
            } as any;
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const res = await fetch('http://127.0.0.1:5000/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              profile_photo: user.image
            })
          });

          if (!res.ok) {
            return '/login?error=InvalidDomain';
          }

          const data = await res.json();
          // Merge custom postgres response into NextAuth user object explicitly
          Object.assign(user, { 
            id: data.user.id.toString(),
            college_id: data.user.college_id,
            token: data.token
          });
          
          return true;
        } catch (e) {
           console.error('Google provider error:', e);
           return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.college_id = (user as any).college_id;
        token.backendToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).college_id = token.college_id;
        (session.user as any).backendToken = token.backendToken;
      }
      return session;
    },
  },
};
