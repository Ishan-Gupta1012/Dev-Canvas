import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseEnv } from '@/utils/supabase/env'

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> }

export async function createClient(collect?: { cookies: CookieToSet[] }) {
  const env = getSupabaseEnv()

  if (!env) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
    )
  }

  const cookieStore = await cookies()

  return createServerClient(
    env.url,
    env.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // Route Handlers can pass a collector so the refreshed session can be
          // replayed onto the response they are about to return
          if (collect) {
            collect.cookies.push(...(cookiesToSet as CookieToSet[]))
          }
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
