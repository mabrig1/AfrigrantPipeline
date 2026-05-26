import { auth } from '@/lib/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  const isDashboard = pathname.startsWith('/dashboard')
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')

  // Redirect unauthenticated users trying to access dashboard
  if (isDashboard && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return Response.redirect(loginUrl)
  }

  // Redirect already-authenticated users away from auth pages
  if (isAuthPage && isLoggedIn) {
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') ?? '/dashboard'
    // Ensure callbackUrl is a relative path to prevent open-redirect
    const safeCallback = callbackUrl.startsWith('/') ? callbackUrl : '/dashboard'
    return Response.redirect(new URL(safeCallback, req.nextUrl))
  }
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
}
