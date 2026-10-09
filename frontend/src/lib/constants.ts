// Shared by proxy.ts (no server-only imports there) and the server code.
export const SESSION_COOKIE = 'session';
export const SESSION_MAX_AGE = 12 * 60 * 60; // matches the API's JWT lifetime
export const PUBLIC_PATHS = ['/login', '/forgot-password', '/reset-password'];
