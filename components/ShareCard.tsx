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
  const cardRef = useRef<HTMLDivElement>(null);
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

  const verdictColor = VERDICT_COLOR[result.verdict] ?? '#f97316';

  return (
    <div className="font-mono">
      <div
        ref={cardRef}
        className="bg-canvas border border-line p-6 relative overflow-hidden"
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: verdictColor }}
          aria-hidden="true"
        />
        <div className="flex items-center justify-between mb-5 text-xs text-ghost" aria-hidden="true">
          <span>roastmycode — output.txt</span>
          <span>{new Date().toISOString().slice(0, 10)}</span>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-dim mb-1">verdict:</p>
            <p className="text-lg font-black tracking-widest" style={{ color: verdictColor }}>
              {result.verdict.replace('_', ' ')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-dim">score:</p>
            <p
              className="text-4xl font-black tabular-nums"
              style={{ color: verdictColor }}
              aria-label={`Score: ${result.scores.overall} out of 100`}
            >
              {result.scores.overall}<span className="text-base text-dim">/100</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-dim leading-relaxed mb-5 border-l-2 border-fire/40 pl-3">
          &ldquo;{result.roastLine}&rdquo;
        </p>

        <div className="grid grid-cols-4 gap-2 text-center" aria-label="Score breakdown">
          {[
            { label: 'Security',      abbr: 'sec',  value: result.scores.security },
            { label: 'Performance',   abbr: 'perf', value: result.scores.performance },
            { label: 'Accessibility', abbr: 'a11y', value: result.scores.accessibility },
            { label: 'Quality',       abbr: 'qual', value: result.scores.quality },
          ].map(({ label, abbr, value }) => (
            <div key={label} className="bg-card border border-line p-2">
              <div className="text-xs text-dim">{abbr}</div>
              <div className="text-sm font-bold text-ink" aria-label={`${label}: ${value}`}>{value}</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-dim mt-4">roastmycode.vercel.app</p>
      </div>

      <div className="mt-3 flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#1da1f2] hover:bg-[#1a91da] text-white text-xs font-mono py-2.5 transition-colors text-center"
        >
          share on x/twitter
        </a>
        <button
          onClick={copyLink}
          className="flex-1 bg-raised hover:bg-overlay text-dim hover:text-ink text-xs font-mono py-2.5 border border-line transition-colors"
          aria-label={copying ? 'Link copied' : 'Copy share link'}
        >
          {copying ? '[✓] copied!' : 'copy link'}
        </button>
      </div>
    </div>
  );
}
