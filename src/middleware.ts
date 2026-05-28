import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  const isLoggedIn = !!token
  const isDashboard = pathname.startsWith('/dashboard')
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')

  if (isDashboard && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && isLoggedIn) {
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') ?? '/dashboard'
    const safeCallback = callbackUrl.startsWith('/') ? callbackUrl : '/dashboard'
    return NextResponse.redirect(new URL(safeCallback, req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
}
