'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { isSupabaseConfigured } from '@/utils/supabase/env';

/**
 * Client-side companion to the proxy's server-side auth gate.
 *
 * The proxy authorises on the Supabase session cookie, while the dashboard UI
 * renders from the local student profile that AuthContext hydrates. Those two
 * settle independently, so a missing profile on first paint is not proof that
 * the visitor is signed out. This guard re-checks the real Supabase session and
 * only sends someone to the sign-in page once it is certain there is none,
 * which keeps an authenticated OAuth return from bouncing.
 */
export default function DashboardAuthGuard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isLoading || user) return;

    let cancelled = false;

    // Give the profile a beat to hydrate before treating it as a real sign-out
    const timer = window.setTimeout(async () => {
      if (cancelled) return;

      if (!isSupabaseConfigured()) {
        setChecked(true);
        return;
      }

      const { data } = await createClient().auth.getSession();
      if (cancelled) return;

      if (data.session) {
        // A real session exists, so the profile is simply still loading. Stay put.
        return;
      }

      setChecked(true);
    }, 1500);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isLoading, user]);

  useEffect(() => {
    if (!checked) return;
    router.replace('/signin');
  }, [checked, router]);

  return null;
}
