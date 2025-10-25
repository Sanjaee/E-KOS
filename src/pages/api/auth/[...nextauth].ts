import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '@/db/schema';
import { loginWithGoogle } from "@/services/services";
import { Profile } from "next-auth";

// Extend Profile type to include Google-specific fields
interface GoogleProfile extends Profile {
  picture?: string;
  email_verified?: boolean;
  locale?: string;
  hd?: string;
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      loginMethod: string;
      image?: string;
    }
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    loginMethod: string;
    image?: string;
  }
}

const db = drizzle(process.env.DATABASE_URL!);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .execute();

          if (user.length === 0) {
            throw new Error('User not found');
          }

          // Check login method
          if (user[0].loginMethod === 'google') {
            throw new Error('This email is registered with Google. Please sign in with Google.');
          }

          // Verify email
          if (!user[0].emailVerified) {
            throw new Error('EMAIL_NOT_VERIFIED');
          }

          // Verify password
          const isValidPassword = await compare(credentials.password, user[0].password!);
          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          return user.length > 0 ? {
            id: user[0].id,
            email: user[0].email!,
            name: user[0].name!,
            role: user[0].role,
            loginMethod: user[0].loginMethod ?? '',
            image: user[0].image ?? undefined,
          } : null;
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          const googleProfile = profile as GoogleProfile;
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .execute();

          if (existingUser.length > 0 && existingUser[0].loginMethod === 'credentials') {
            throw new Error('This email is registered with email/password. Please sign in with your password.');
          }

          // Update user's profile image if it exists in Google profile
          if (existingUser.length > 0 && googleProfile?.picture) {
            await db
              .update(users)
              .set({ image: googleProfile.picture })
              .where(eq(users.email, user.email!))
              .execute();
          }
        }
        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    },

    async jwt({ token, account, profile, user }) {
      try {
        if (account?.provider === "credentials") {
          token.sub = user.id;
          token.email = user.email;
          token.name = user.name;
          token.role = user.role;
          token.picture = user.image;
          token.loginMethod = 'credentials';
        }

        if (account?.provider === "google") {
          if (!profile?.name || !profile?.email) {
            throw new Error('Google profile is missing required information');
          }

          const googleProfile = profile as GoogleProfile;

          const data = {
            username: profile.name,
            email: profile.email,
            image: googleProfile.picture ?? '',
          };

          const googleUser = await loginWithGoogle(data);
          token.sub = googleUser.id;
          token.email = googleUser.email;
          token.name = googleUser.name;
          token.role = googleUser.role;
          token.picture = googleProfile.picture || googleUser.image;
          token.loginMethod = 'google';
        }

        return token;
      } catch (error) {
        console.error('JWT error:', error);
        throw error;
      }
    },

    async session({ session, token }) {
      try {
        session.user.id = token.sub ?? '';
        session.user.email = token.email ?? '';
        session.user.name = token.name ?? '';
        session.user.role = token.role as string;
        session.user.loginMethod = token.loginMethod as string;
        session.user.image = token.picture ?? '';

        return session;
      } catch (error) {
        console.error('Session error:', error);
        throw error;
      }
    },

    async redirect({ url, baseUrl }) {
      // Jika URL sudah absolute dan dari domain yang sama, gunakan
      if (url.startsWith(baseUrl)) return url;
      
      // Jika hanya path saja
      else if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Default fallback
      else return baseUrl;
    }
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log sign in event
      console.log('User signed in:', {
        email: user.email,
        provider: account?.provider,
        isNewUser,
      });
    },
  },

  pages: {
    signIn: "/auth/login",
    error: '/auth/login',
    newUser: '/auth/register'
  },

  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);