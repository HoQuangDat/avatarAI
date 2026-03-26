import type { NextAuthOptions, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './db';
import User from '@/models/User';
import type { JWT } from 'next-auth/jwt';

interface ExtendedSession extends Session {
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
    plan: string;
    credits: number;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email và mật khẩu là bắt buộc');
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('Không tìm thấy tài khoản với email này');
        }

        if (!user.passwordHash) {
          throw new Error('Tài khoản này sử dụng đăng nhập Google');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          throw new Error('Mật khẩu không chính xác');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false;
        
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name || '',
            image: user.image || '',
            provider: 'google',
            plan: 'free',
            credits: 3,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: { id?: string; email?: string | null } }) {
      if (user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.plan = dbUser.plan;
          token.credits = dbUser.credits;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const extSession = session as ExtendedSession;
      if (token) {
        extSession.user.id = token.id as string;
        extSession.user.plan = token.plan as string;
        extSession.user.credits = token.credits as number;
      }
      return extSession;
    },
  },
};
