import { NextResponse, type NextRequest } from 'next/server'

import { createServerClient } from '@supabase/ssr'

import type { Database } from '@/types/database'

const protectedRoutes = [
  '/skills',
  '/mcps',
  '/prompts',
  '/categories',
  '/admin',
  '/settings',
  '/contribute',
]
const authRoutes = ['/login', '/signup']
const publicRoutes: string[] = []

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  if (isPublicRoute) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
  const isAuthRoute = authRoutes.some((route) => pathname === route)

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/skills', request.url))
  }
  if (pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL('/skills', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return supabaseResponse
}
