import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The setup endpoint must remain reachable so the first admin can activate
// the admin cookie. All other admin API routes remain protected.
const ADMIN_SETUP_PATH = '/api/admin/make-admin'

function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get('admin-token')?.value
  const secret = process.env.ADMIN_SETUP_SECRET

  return Boolean(secret && token && token === secret)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow the initial setup endpoint to validate the secret and issue the cookie.
  if (pathname === ADMIN_SETUP_PATH) {
    return NextResponse.next()
  }

  // Protect the admin dashboard and every other /api/admin endpoint.
  const isProtected =
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/api/admin/')

  if (isProtected && !isAdmin(request)) {
    // Allow the /admin page to render its setup UI. The setup UI calls the
    // public make-admin endpoint above, which issues the admin cookie.
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      return NextResponse.next()
    }

    return NextResponse.json(
      { error: 'Unauthorized: Not an admin' },
      { status: 403 },
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
