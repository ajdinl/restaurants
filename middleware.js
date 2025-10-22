import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAdmin = token?.is_admin;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/restaurant/')) {
        return NextResponse.next();
    }

    if (isAdmin && pathname === '/') {
        return NextResponse.redirect(new URL('/admin-dashboard', req.url));
    }

    if (!isAdmin && pathname === '/admin-dashboard') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (token && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!token && pathname !== '/') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard', '/admin-dashboard', '/restaurant/:path*'],
};
