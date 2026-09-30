import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { isSupabaseConfigured } from '@/utils/supabase/env'

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> }

function safeNext(next: string | null): string {
  if (!next) return '/dashboard'
  if (!next.startsWith('/') || next.startsWith('//')) return '/dashboard'
  return next
}

function resolveOrigin(request: Request, fallbackOrigin: string): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  if (forwardedHost && process.env.NODE_ENV !== 'development') {
    const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
    return `${forwardedProto}://${forwardedHost}`
  }
  return fallbackOrigin
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))
  const baseOrigin = resolveOrigin(request, origin)

  const fail = () => NextResponse.redirect(`${baseOrigin}/auth/auth-code-error`)

  if (!isSupabaseConfigured()) {
    return fail()
  }

  if (!code) {
    return fail()
  }

  // Collect the refreshed session cookies so they can be replayed onto the
  // redirect response. Writing them only to the `cookies()` store is not enough:
  // the response returned to the browser is a fresh object that would otherwise
  // carry no Set-Cookie headers at all.
  const collected: { cookies: CookieToSet[] } = { cookies: [] }
  const supabase = await createClient(collected)
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Supabase auth code exchange error:', error)
    return fail()
  }

  const isProduction = process.env.NODE_ENV === 'production'
  const response = NextResponse.redirect(`${baseOrigin}${next}`)

  for (const { name, value, options } of collected.cookies) {
    response.cookies.set(name, value, {
      ...options,
      path: '/',
      sameSite: 'lax',
      secure: isProduction,
    })
  }

  // Keeps the proxy auth gate satisfied on the very first /dashboard hit,
  // before the client AuthContext has mounted. The Supabase session above is
  // the real authority; this is a non-authoritative hint that keeps a valid
  // login from bouncing before the browser has a chance to read the session.
  response.cookies.set('student_auth', 'true', {
    path: '/',
    sameSite: 'lax',
    secure: isProduction,
  })

  return response
}
