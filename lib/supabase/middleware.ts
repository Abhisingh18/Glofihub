import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { UserRole } from '@/lib/database.types';

const HOME: Record<UserRole, string> = {
  super_admin: '/admin/dashboard',
  counsellor: '/counsellor/dashboard',
  student: '/student/dashboard',
};

const PROTECTED_PREFIXES = ['/admin', '/counsellor', '/student'];
const AUTH_PAGES = ['/login', '/register', '/forgot-password'];

/** Refreshes the Supabase session cookie and enforces route-level RBAC. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Supabase not configured yet — let pages render (CRM stays inactive until keys are set).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => path.startsWith(p));

  // Not logged in → block protected areas.
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  if (user) {
    // Look up role to enforce per-section access + redirect away from auth pages.
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    const role = (profile?.role ?? 'student') as UserRole;
    const home = HOME[role];

    if (isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = home;
      url.search = '';
      return NextResponse.redirect(url);
    }

    // Wrong section for this role → send to their own home.
    const section = PROTECTED_PREFIXES.find((p) => path.startsWith(p));
    if (section && !home.startsWith(section)) {
      const url = request.nextUrl.clone();
      url.pathname = home;
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return response;
}
