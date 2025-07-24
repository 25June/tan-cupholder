import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextRequest } from 'next/server';

const authMiddleware = NextAuth(authConfig).auth;
export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes('admin/')) {
    return (authMiddleware as any)(request);
  }
  return true;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
