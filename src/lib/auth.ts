import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import type { UserRole, SubscriptionPlan } from '@/types/database'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      subscription: SubscriptionPlan
    } & DefaultSession['user']
  }
  interface User {
    role?: UserRole
    subscription?: SubscriptionPlan
  }
}

type AppToken = {
  id?: string
  role?: UserRole
  subscription?: SubscriptionPlan
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'researcher' as UserRole,
          subscription: 'free' as SubscriptionPlan,
        }
      },
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email
          const password = credentials?.password
          if (typeof email !== 'string' || typeof password !== 'string') return null
          if (!email || !password) return null
          await connectDB()
          const user = await User.findOne({ email: email.toLowerCase().trim() }).lean()
          if (!user || !user.password) return null
          const valid = await bcrypt.compare(password, user.password)
          if (!valid) return null
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar ?? null,
            role: user.role,
            subscription: (user.subscription ?? 'free') as SubscriptionPlan,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        try {
          await connectDB()
          await User.findOneAndUpdate(
            { email: profile.email.toLowerCase() },
            {
              $setOnInsert: {
                name: profile.name ?? user.name ?? 'Google User',
                email: profile.email.toLowerCase(),
                role: 'researcher' as UserRole,
                subscription: 'free' as SubscriptionPlan,
              },
              $set: {
                avatar: (profile as { picture?: string }).picture ?? user.image ?? undefined,
              },
            },
            { upsert: true, new: true },
          )
        } catch {
          // Don't block sign-in if the profile upsert fails.
        }
      }
      return true
    },
    async jwt({ token, user, trigger, session, account, profile }) {
      const appToken = token as typeof token & AppToken
      if (user) {
        appToken.id = user.id as string
        appToken.role = (user.role ?? 'student') as UserRole
        appToken.subscription = (user.subscription ?? 'free') as SubscriptionPlan
      }
      if (account?.provider === 'google' && profile?.email) {
        try {
          await connectDB()
          const dbUser = await User.findOne({
            email: (profile.email as string).toLowerCase(),
          })
            .select('_id role subscription')
            .lean()
          if (dbUser) {
            appToken.id = dbUser._id.toString()
            appToken.role = (dbUser.role ?? 'researcher') as UserRole
            appToken.subscription = (dbUser.subscription ?? 'free') as SubscriptionPlan
          }
        } catch {
          // Keep existing token values.
        }
      }
      if (trigger === 'update') {
        if (session?.role) appToken.role = session.role as UserRole
        if (session?.subscription) {
          appToken.subscription = session.subscription as SubscriptionPlan
        }
      }
      return appToken
    },
    async session({ session, token }) {
      const appToken = token as typeof token & AppToken
      session.user.id = appToken.id ?? ''
      session.user.role = appToken.role ?? 'student'
      session.user.subscription = appToken.subscription ?? 'free'
      return session
    },
  },
})
