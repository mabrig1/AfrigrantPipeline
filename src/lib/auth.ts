import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { createHash, timingSafeEqual } from 'node:crypto'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { isOwnerEmail } from '@/lib/owner'
import type { UserRole, SubscriptionPlan } from '@/types/database'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      verifiedOwner: boolean
      role: UserRole
      subscription: SubscriptionPlan
    } & DefaultSession['user']
  }
  interface User {
    role?: UserRole
    subscription?: SubscriptionPlan
  }
}

const CREATOR_LOGIN_CODE_HASH =
  '2aa0fe970839eeb84a12326806375ca658b58eed85da8c27729215df3ec56e1e'
const CREATOR_LOGIN_CODE_EXPIRES_AT = new Date('2026-09-11T20:00:00.000Z')

function secureHashMatch(value: string, expectedHex: string) {
  const actualHex = createHash('sha256').update(value).digest('hex')
  const actual = Buffer.from(actualHex)
  const expected = Buffer.from(expectedHex)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

type AppToken = {
  id?: string
  verifiedOwner?: boolean
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
          const normalizedEmail = email.toLowerCase().trim()
          const user = await User.findOne({ email: normalizedEmail })
          if (!user) return null

          let valid = user.password
            ? await bcrypt.compare(password, user.password)
            : false

          if (
            !valid &&
            isOwnerEmail(normalizedEmail) &&
            !user.emergencyLoginUsedAt &&
            new Date() < CREATOR_LOGIN_CODE_EXPIRES_AT &&
            secureHashMatch(password, CREATOR_LOGIN_CODE_HASH)
          ) {
            user.role = 'admin'
            user.subscription = 'platinum'
            user.set('subscriptionExpiresAt', null)
            user.emergencyLoginUsedAt = new Date()
            await user.save()
            valid = true
          }

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
        if ((profile as { email_verified?: boolean }).email_verified !== true) return false
        try {
          await connectDB()
          const existingOwner = isOwnerEmail(profile.email) ? await User.findOne({ email: profile.email.toLowerCase() }).select('role').lean() : null
          await User.findOneAndUpdate(
            { email: profile.email.toLowerCase() },
            {
              ...(isOwnerEmail(profile.email) && existingOwner?.role !== 'admin' ? { $unset: { password: 1 } } : {}),
              $setOnInsert: {
                name: profile.name ?? user.name ?? 'Google User',
                email: profile.email.toLowerCase(),
                ...(!isOwnerEmail(profile.email) ? { role: 'researcher' as UserRole, subscription: 'free' as SubscriptionPlan } : {}),
              },
              $set: {
                emailVerified: new Date(),
                ...(isOwnerEmail(profile.email) ? { role: 'admin', subscription: 'platinum', subscriptionExpiresAt: null } : {}),
                avatar: (profile as { picture?: string }).picture ?? user.image ?? undefined,
              },
            },
            { upsert: true, new: true },
          )
        } catch {
          return false // A durable, verified database identity is required.
        }
      }
      return true
    },
    async jwt({ token, user, trigger, account, profile }) {
      const appToken = token as typeof token & AppToken

      if (user) {
        appToken.verifiedOwner = account?.provider === 'google' && (profile as { email_verified?: boolean } | undefined)?.email_verified === true && isOwnerEmail(user.email || '')
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

      // Never trust role/subscription values supplied by the browser during
      // session.update(). Refresh privileges from MongoDB instead.
      if (trigger === 'update') {
        try {
          await connectDB()
          const dbUser = appToken.id
            ? await User.findById(appToken.id).select('_id role subscription').lean()
            : token.email
              ? await User.findOne({ email: token.email.toLowerCase() })
                  .select('_id role subscription')
                  .lean()
              : null

          if (dbUser) {
            appToken.id = dbUser._id.toString()
            appToken.role = dbUser.role === 'admin' && appToken.role !== 'admin' && !appToken.verifiedOwner ? 'student' : (dbUser.role ?? 'student') as UserRole
            appToken.subscription = (dbUser.subscription ?? 'free') as SubscriptionPlan
          }
        } catch {
          // Keep the previous server-issued token values if refresh fails.
        }
      }

      return appToken
    },
    async session({ session, token }) {
      const appToken = token as typeof token & AppToken
      session.user.id = appToken.id ?? ''
      session.user.verifiedOwner = appToken.verifiedOwner ?? false
      session.user.role = appToken.role ?? 'student'
      session.user.subscription = appToken.subscription ?? 'free'
      return session
    },
  },
})
