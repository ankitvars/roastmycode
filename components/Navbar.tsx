'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ThemeToggle from './ThemeToggle';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = () =>
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });

  const signOut = () => supabase.auth.signOut();

  return (
    <nav className="border-b border-line bg-canvas" aria-label="Main navigation">
      <div className="max-w-[64rem] mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono" aria-label="RoastMyCode home">
          <span className="text-fire text-sm font-bold" aria-hidden="true">▸</span>
          <span className="text-ink font-semibold text-sm tracking-tight">roastmycode</span>
          <span className="text-ghost text-xs hidden sm:block" aria-hidden="true">/ _</span>
        </Link>

        <div className="flex items-center gap-1 font-mono text-xs">
          <Link
            href="/review"
            className="px-3 py-1.5 text-dim hover:text-ink hover:bg-raised border border-transparent hover:border-line transition-colors"
          >
            new-review
          </Link>

          {user ? (
            <>
              <Link
                href="/profile"
                className="px-3 py-1.5 text-dim hover:text-ink transition-colors"
              >
                my-roasts
              </Link>
              <button
                onClick={signOut}
                className="px-3 py-1.5 text-dim hover:text-reject transition-colors"
              >
                sign-out
              </button>
            </>
          ) : (
            <button
              onClick={signIn}
              className="px-3 py-1.5 bg-raised text-ink border border-line hover:border-fire hover:text-fire transition-colors"
            >
              [sign-in-with-github]
            </button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
