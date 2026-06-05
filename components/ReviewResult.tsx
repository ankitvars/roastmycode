'use client';

import type { ReviewResult as ReviewResultType } from '@/lib/types';
import RoastBadge from './RoastBadge';
import ScoreCard from './ScoreCard';
import FindingRow from './FindingRow';
import ShareCard from './ShareCard';

interface ReviewResultProps {
  result:   ReviewResultType;
  reviewId: string | null;
}

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'nitpick'];

export default function ReviewResult({ result, reviewId }: ReviewResultProps) {
  const sortedFindings = [...result.findings].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );

  return (
    <div className="space-y-6">
      {/* Verdict + Roast Line */}
      <div className="bg-card border border-line rounded-xl p-6">
        <RoastBadge verdict={result.verdict} />
        <blockquote className="mt-4 text-xl font-semibold font-display text-ink leading-snug italic">
          &ldquo;{result.roastLine}&rdquo;
        </blockquote>
        <p className="mt-3 text-dim text-sm leading-relaxed">{result.summary}</p>
        {result.detectedStack.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap" aria-label="Detected technologies">
            {result.detectedStack.map(s => (
              <span key={s} className="text-xs bg-raised text-dim px-2 py-1 rounded border border-line">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Scores */}
      <ScoreCard scores={result.scores} />

      {/* Findings */}
      {sortedFindings.length > 0 && (
        <section aria-label="Findings">
          <h2 className="text-xs font-semibold text-dim uppercase tracking-widest font-display mb-3">
            Findings ({sortedFindings.length})
          </h2>
          <div className="space-y-2">
            {sortedFindings.map(f => (
              <FindingRow key={f.id} finding={f} />
            ))}
          </div>
        </section>
      )}

      {/* Praise */}
      {result.praise.length > 0 && (
        <section
          aria-label="What you got right"
          className="bg-merge/8 border border-merge/25 rounded-xl p-5"
        >
          <h2 className="text-xs font-semibold text-merge uppercase tracking-widest font-display mb-3">
            What you got right
          </h2>
          <ul className="space-y-1.5">
            {result.praise.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink">
                <span className="text-merge mt-0.5" aria-hidden="true">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Share */}
      <ShareCard result={result} reviewId={reviewId} />
    </div>
  );
}
