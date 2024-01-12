import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const handleCookies = (req, response, name, value, options = {}) => {
  req.cookies.set({ name, value, ...options })

  response.cookies.set({ name, value, ...options })

  return NextResponse.next({
    request: { headers: req.headers },
  })
}

export async function middleware(req) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          return handleCookies(req, res, name, value, options)
        },
        remove(name, options) {
          return handleCookies(req, res, name, '', options)
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdmin = user?.user_metadata?.is_admin

  if (isAdmin && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/admin-dashboard', req.url))
  }

  if (!isAdmin && req.nextUrl.pathname === '/admin-dashboard') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (user && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!user && req.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url))
  }
  return res
}

export const config = {
  matcher: ['/', '/dashboard', '/admin-dashboard'],
}
