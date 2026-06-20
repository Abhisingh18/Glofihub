import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on the CRM areas + auth pages only. Landing page & static assets untouched.
  matcher: [
    '/admin/:path*',
    '/counsellor/:path*',
    '/student/:path*',
    '/login',
    '/register',
    '/forgot-password',
  ],
};
