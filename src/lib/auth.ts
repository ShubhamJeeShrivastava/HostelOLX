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
          const res = await fetch('http://127.0.0.1:5000/api/colleges');
          const domains = await res.json();
          let matched = false;
          let matchedId = null;
          for (const d of domains) {
            if (new RegExp(d.regex_pattern).test(user.email || '')) {
              matched = true;
              matchedId = d.id;
              break;
            }
          }
          if (!matched) return '/login?error=InvalidDomain';
          
          Object.assign(user, { college_id: matchedId });
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
