import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifyToken } from '@/lib/session';
import { ROLE_HOME } from '@/lib/roles';
import type { UserRole } from '@/lib/database.types';

const PROTECTED = ['/admin', '/counsellor', '/student'];
const AUTH_PAGES = ['/login', '/register', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  const isProtected = PROTECTED.some((p) => path.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => path.startsWith(p));

  // Not signed in → block protected areas.
  if (!session && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  if (session) {
    const home = ROLE_HOME[session.role as UserRole] ?? '/login';

    // Already signed in → keep away from auth pages.
    if (isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = home;
      url.search = '';
      return NextResponse.redirect(url);
    }

    // Wrong section for this role (admin may go anywhere).
    const section = PROTECTED.find((p) => path.startsWith(p));
    if (section && session.role !== 'super_admin' && !home.startsWith(section)) {
      const url = request.nextUrl.clone();
      url.pathname = home;
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/counsellor/:path*', '/student/:path*', '/login', '/register', '/forgot-password'],
};
