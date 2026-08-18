import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes
const protectedRoutes = ['/admin', '/api/admin'];

// Check if the user is authenticated as admin
function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get('admin-token')?.value;
  // Replace with your actual admin validation logic
  // Example: Check if token matches ADMIN_SETUP_SECRET
  return token === process.env.ADMIN_SETUP_SECRET;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !isAdmin(request)) {
    // Redirect to login or home if not admin
    const loginUrl = new URL('/api/auth/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
