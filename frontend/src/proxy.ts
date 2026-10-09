import { NextResponse, type NextRequest } from 'next/server';
import { PUBLIC_PATHS, SESSION_COOKIE } from '@/lib/constants';

// Optimistic check only: it looks for the cookie, the API decides whether the token is valid.
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSession = request.cookies.has(SESSION_COOKIE);
    const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

    if (!hasSession && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (hasSession && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|session/expired|icon.svg|favicon.ico|robots.txt).*)'],
};
