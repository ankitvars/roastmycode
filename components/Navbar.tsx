'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
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
    <nav className="border-b border-gray-800 bg-gray-950 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-lg font-bold text-white">🔥 RoastMyCode</span>
        <span className="text-xs text-gray-500 hidden sm:block">— AI senior engineer</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/review" className="text-sm text-gray-400 hover:text-white transition-colors">
          New Review
        </Link>
        {user ? (
          <>
            <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors">
              My Roasts
            </Link>
            <button
              onClick={signOut}
              className="text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={signIn}
            className="text-sm bg-white text-gray-900 px-3 py-1.5 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Sign in with GitHub
          </button>
        )}
      </div>
    </nav>
  );
}
