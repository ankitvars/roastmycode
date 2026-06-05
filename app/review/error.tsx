'use client';

import { useEffect } from 'react';

const KNOWN_ERRORS: Record<string, { icon: string; title: string; hint: string }> = {
  'rate limit': {
    icon:  '⏳',
    title: 'AI rate limit hit',
    hint:  'The free tier allows ~15 reviews/min. Wait 30 seconds and try again.',
  },
  'PR not found': {
    icon:  '🔍',
    title: 'PR not found',
    hint:  'Make sure the GitHub repo is public and the PR number is correct.',
  },
  'GitHub rate limit': {
    icon:  '🚦',
    title: 'GitHub rate limit',
    hint:  'Unauthenticated GitHub requests are limited to 60/hr. Add a GITHUB_TOKEN to your env to raise it to 5,000/hr.',
  },
  'API_KEY': {
    icon:  '🔑',
    title: 'Missing API key',
    hint:  'Set the provider API key in your .env.local and restart the dev server.',
  },
};

function matchKnown(message: string) {
  for (const [key, val] of Object.entries(KNOWN_ERRORS)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return null;
}

export default function ReviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const known = matchKnown(error.message ?? '');

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center" role="alert">
      <div className="text-5xl mb-4" aria-hidden="true">{known?.icon ?? '🔥'}</div>
      <h2 className="text-lg font-bold font-display text-ink mb-2">
        {known?.title ?? 'Review failed'}
      </h2>
      <p className="text-dim text-sm mb-6 leading-relaxed max-w-sm mx-auto">
        {known?.hint ?? (error.message || 'Something went wrong while running the review.')}
      </p>
      {error.digest && (
        <p className="text-ghost font-mono text-xs mb-6">ref: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="bg-fire hover:bg-ember text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
