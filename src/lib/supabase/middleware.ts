import { NextResponse, type NextRequest } from 'next/server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'

import type { Database } from '@/types/database'

// Routes that require authentication
const protectedRoutes = ['/prompts', '/categories', '/admin', '/settings']
// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/signup']
// Public marketing routes that don't need auth checks at all
const publicRoutes = ['/about']

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip auth middleware entirely for public marketing routes
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  if (isPublicRoute) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname === route)

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/prompts', request.url))
  }

  // Redirect root to prompts page for authenticated users, or about page for visitors
  if (pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/prompts', request.url))
    } else {
      return NextResponse.redirect(new URL('/about', request.url))
    }
  }

  return response
}
