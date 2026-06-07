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
    <div className="space-y-5 font-mono">
      {/* Verdict + Roast Line */}
      <div className="bg-card border border-line p-6">
        <RoastBadge verdict={result.verdict} />
        <blockquote className="mt-4 text-base font-bold text-ink leading-snug border-l-2 border-fire pl-4">
          &ldquo;{result.roastLine}&rdquo;
        </blockquote>
        <p className="mt-3 text-dim text-sm leading-relaxed">{result.summary}</p>
        {result.detectedStack.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap" aria-label="Detected technologies">
            {result.detectedStack.map(s => (
              <span key={s} className="text-xs bg-raised text-dim px-2 py-1 border border-line">
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
          <div className="text-xs text-dim uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-fire" aria-hidden="true">▸</span>
            <span>findings ({sortedFindings.length})</span>
            <span className="flex-1 border-t border-line ml-1" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            {sortedFindings.map(f => (
              <FindingRow key={f.id} finding={f} />
            ))}
          </div>
        </section>
      )}

      {/* Praise */}
      {result.praise.length > 0 && (
        <section aria-label="What you got right">
          <div className="text-xs text-merge uppercase tracking-wider mb-3 flex items-center gap-2">
            <span aria-hidden="true">▸</span>
            <span>what you got right</span>
            <span className="flex-1 border-t border-merge/30 ml-1" aria-hidden="true" />
          </div>
          <div className="bg-merge/8 border border-merge/25 p-4 space-y-2">
            {result.praise.map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-ink">
                <span className="text-merge shrink-0 mt-0.5" aria-hidden="true">[✓]</span>
                {p}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Share */}
      <ShareCard result={result} reviewId={reviewId} />
    </div>
  );
}
