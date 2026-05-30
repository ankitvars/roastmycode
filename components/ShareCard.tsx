'use client';

import { useRef, useState } from 'react';
import type { ReviewResult } from '@/lib/types';

interface ShareCardProps {
  result:   ReviewResult;
  reviewId: string | null;
}

const VERDICT_COLOR: Record<string, string> = {
  MERGE:           '#22c55e',
  REQUEST_CHANGES: '#eab308',
  REJECT:          '#ef4444',
};

export default function ShareCard({ result, reviewId }: ShareCardProps) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);

  const shareUrl = reviewId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/review/${reviewId}`
    : typeof window !== 'undefined' ? window.location.href : '';

  const tweetText = encodeURIComponent(
    `My code got roasted 🔥\n\n"${result.roastLine}"\n\nOverall score: ${result.scores.overall}/100\n\nGet your code roasted: ${shareUrl}`
  );

  const copyLink = async () => {
    setCopying(true);
    await navigator.clipboard.writeText(shareUrl);
    setTimeout(() => setCopying(false), 2000);
  };

  const verdictColor = VERDICT_COLOR[result.verdict] ?? '#6366f1';

  return (
    <div>
      {/* Visual card (rendered for screenshotting) */}
      <div
        ref={cardRef}
        className="bg-gray-950 border border-gray-800 rounded-2xl p-6 relative overflow-hidden"
        style={{ fontFamily: 'monospace' }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: verdictColor }}
        />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">🔥 RoastMyCode</p>
            <p
              className="text-lg font-black"
              style={{ color: verdictColor }}
            >
              {result.verdict.replace('_', ' ')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Overall Score</p>
            <p
              className="text-4xl font-black tabular-nums"
              style={{ color: verdictColor }}
            >
              {result.scores.overall}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-300 italic mb-4 leading-relaxed">
          &ldquo;{result.roastLine}&rdquo;
        </p>

        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: '🔒', value: result.scores.security },
            { label: '⚡', value: result.scores.performance },
            { label: '♿', value: result.scores.accessibility },
            { label: '✨', value: result.scores.quality },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-900 rounded-lg p-2">
              <div className="text-lg">{label}</div>
              <div className="text-sm font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-700 mt-4 text-center">roastmycode.vercel.app</p>
      </div>

      {/* Share actions */}
      <div className="mt-4 flex gap-3">
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#1da1f2] hover:bg-[#1a91da] text-white text-sm font-medium py-2.5 rounded-lg transition-colors text-center"
        >
          Share on X/Twitter
        </a>
        <button
          onClick={copyLink}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          {copying ? '✓ Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
