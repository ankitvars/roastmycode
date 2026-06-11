'use client';

import { useState } from 'react';
import ReviewForm from '@/components/ReviewForm';
import ReviewResult from '@/components/ReviewResult';
import type { ReviewResult as ReviewResultType } from '@/lib/types';

export default function ReviewPage() {
  const [result, setResult]   = useState<ReviewResultType | null>(null);
  const [reviewId, setId]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResult = (r: ReviewResultType, id: string | null) => {
    setResult(r);
    setId(id);
    if (id) window.history.pushState({}, '', `/review/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {!result && !loading && (
        <div className="mb-8 font-mono">
          <div className="text-xs text-ghost mb-4 flex items-center gap-2" aria-hidden="true">
            <span className="text-fire">$</span>
            <span className="text-dim">roastmycode --interactive</span>
          </div>
          <h1 className="text-3xl font-bold text-ink mb-3">get roasted</h1>
          <p className="text-dim text-sm">
            paste your code or a github pr url.<br />
            a brutally honest ai senior engineer will tear it apart.
          </p>
        </div>
      )}

      {loading && (
        <div className="py-20 font-mono" role="status" aria-live="polite">
          <div className="space-y-2 text-sm">
            <p><span className="text-fire" aria-hidden="true">▸</span> <span className="text-dim">analyzing code structure…</span></p>
            <p><span className="text-fire" aria-hidden="true">▸</span> <span className="text-dim">checking security vulnerabilities…</span></p>
            <p><span className="text-fire" aria-hidden="true">▸</span> <span className="text-dim">judging your life choices…</span></p>
            <p className="text-dim text-xs mt-4 animate-pulse">the senior engineer is reviewing your code</p>
          </div>
        </div>
      )}

      {result ? (
        <div>
          <ReviewResult result={result} reviewId={reviewId} />
          <button
            onClick={() => { setResult(null); setId(null); }}
            className="mt-6 w-full border border-line text-dim hover:text-ink hover:border-trim py-3 text-sm font-mono transition-colors"
          >
            <span className="text-fire opacity-60" aria-hidden="true">$ </span>roastmycode --new
          </button>
        </div>
      ) : (
        !loading && <ReviewForm onResult={handleResult} onLoading={setLoading} />
      )}
    </main>
  );
}
