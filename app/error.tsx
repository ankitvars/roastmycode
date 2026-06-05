'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-6" aria-hidden="true">💥</div>
      <h1 className="text-xl font-bold font-display text-ink mb-2">Something went wrong</h1>
      <p className="text-dim text-sm mb-8 leading-relaxed">
        {error.message || 'An unexpected error occurred.'}
        {error.digest && (
          <span className="block mt-1 text-ghost font-mono text-xs">
            ref: {error.digest}
          </span>
        )}
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-fire hover:bg-ember text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-line text-dim hover:text-ink text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
