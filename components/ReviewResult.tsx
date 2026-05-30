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
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <RoastBadge verdict={result.verdict} />
        <blockquote className="mt-4 text-xl font-semibold text-white leading-snug italic">
          &ldquo;{result.roastLine}&rdquo;
        </blockquote>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">{result.summary}</p>
        {result.detectedStack.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {result.detectedStack.map(s => (
              <span key={s} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
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
        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
            Findings ({sortedFindings.length})
          </h2>
          <div className="space-y-2">
            {sortedFindings.map(f => (
              <FindingRow key={f.id} finding={f} />
            ))}
          </div>
        </div>
      )}

      {/* Praise */}
      {result.praise.length > 0 && (
        <div className="bg-green-950 border border-green-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">
            What you got right
          </h2>
          <ul className="space-y-1.5">
            {result.praise.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-green-300">
                <span className="text-green-500 mt-0.5">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share */}
      <ShareCard result={result} reviewId={reviewId} />
    </div>
  );
}
