import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for request processing
 * 
 * Currently a placeholder for future middleware functionality.
 * Can be used for authentication, redirects, headers, etc.
 */
export function middleware(request: NextRequest) {
  // Add middleware logic here as needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

