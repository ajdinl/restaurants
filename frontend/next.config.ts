import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const securityHeaders = [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

const nextConfig: NextConfig = {
    // Every screen is per-user data from the Rails API, so there is nothing to prerender or cache;
    // the classic dynamic model keeps pages simple (cookies() just makes a route dynamic).
    cacheComponents: false,
    poweredByHeader: false,
    turbopack: {
        // Pin the workspace root; a stray lockfile higher up would otherwise be picked up.
        root: process.cwd(),
        rules: {
            '*.css': {
                loaders: ['@tailwindcss/turbopack'],
                as: '*.css',
            },
        },
    },
    async headers() {
        return [{ source: '/:path*', headers: securityHeaders }];
    },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
