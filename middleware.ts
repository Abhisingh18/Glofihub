import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifyToken } from '@/lib/session';
import { ROLE_HOME } from '@/lib/roles';
import type { UserRole } from '@/lib/database.types';

const PROTECTED = ['/admin', '/counsellor', '/student'];
const AUTH_PAGES = ['/login', '/register', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;
  const host = (request.headers.get('host') ?? url.host).toLowerCase();

  // Portal split: the admin host (admin.glofihub.com OR admin.localhost:3000 for
  // local testing) is staff-only; the public glofihub.com blocks staff routes.
  // Plain localhost / *.vercel.app stay fully open for dev & previews.
  const isAdminHost = host.startsWith('admin.');
  const isPublicProd = host.endsWith('glofihub.com');
  const mainHost = host.replace(/^(admin\.|www\.)/, '');

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;
  const role = session?.role as UserRole | undefined;

  const isProtected = PROTECTED.some((p) => path.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => path.startsWith(p));

  // ── Hostname-based portal split ──
  if (isAdminHost) {
    // Students don't belong on the staff portal → bounce to the public site.
    if (role === 'student') {
      return NextResponse.redirect(`${url.protocol}//${mainHost}/student/dashboard`);
    }
    // Root of the admin host shows a dedicated portal landing (not the public site).
    if (path === '/') {
      if (session) {
        const home = ROLE_HOME[role ?? 'student'] ?? '/login';
        const u = url.clone(); u.pathname = home; u.search = '';
        return NextResponse.redirect(u);
      }
      return NextResponse.rewrite(new URL('/portal', url));
    }
    // The admin host serves ONLY: portal landing, login/forgot, admin/*, counsellor/*, api/*.
    const allowed =
      path === '/portal' ||
      path.startsWith('/admin') ||
      path.startsWith('/counsellor') ||
      path === '/login' ||
      path === '/forgot-password' ||
      path.startsWith('/api');
    if (!allowed) {
      const u = url.clone();
      u.pathname = '/login';
      u.search = '';
      return NextResponse.redirect(u);
    }
  } else if (isPublicProd) {
    // Public glofihub.com: staff areas live on the admin subdomain.
    if (path.startsWith('/admin') || path.startsWith('/counsellor')) {
      return NextResponse.redirect(`${url.protocol}//admin.${mainHost}/login`);
    }
  }

  // ── Auth gate ──
  if (!session && isProtected) {
    const u = url.clone();
    u.pathname = '/login';
    u.searchParams.set('redirect', path);
    return NextResponse.redirect(u);
  }

  if (session) {
    const home = ROLE_HOME[role ?? 'student'] ?? '/login';

    if (isAuthPage) {
      const u = url.clone();
      u.pathname = home;
      u.search = '';
      return NextResponse.redirect(u);
    }

    const section = PROTECTED.find((p) => path.startsWith(p));
    if (section && role !== 'super_admin' && !home.startsWith(section)) {
      const u = url.clone();
      u.pathname = home;
      u.search = '';
      return NextResponse.redirect(u);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next internals & static files (those have a dot).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
