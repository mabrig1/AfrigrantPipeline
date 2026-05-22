import NextAuth, { type DefaultSession } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { clientPromise, connectDB } from './mongodb'
import User from '@/models/User'
import type { UserRole } from '@/types/database'

// ── Module augmentation ───────────────────────────────────────────────────────
//
// Extends next-auth's built-in types so session.user.id and session.user.role
// are fully typed everywhere — no more `as` casts.

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession['user']
  }
  interface User {
    role?: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
  }
}

// ── NextAuth config ───────────────────────────────────────────────────────────

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },

  // Required when running behind Cloudflare / Railway reverse proxies
  trustHost: true,

  pages: {
    signIn: '/login',
    error: '/login',   // redirect auth errors back to login with ?error=
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
        }
      },
    }),

    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
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
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Persist role and id on first sign-in
      if (user) {
        token.id = user.id as string
        token.role = (user.role ?? 'applicant') as UserRole
      }
      // Allow the client to force a session refresh via update()
      if (trigger === 'update' && session?.role) {
        token.role = session.role as UserRole
      }
      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      return session
    },
  },
})
