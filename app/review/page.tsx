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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-display text-ink mb-3">🔥 Get Roasted</h1>
          <p className="text-dim text-base">
            Paste your code or drop a GitHub PR URL.<br />
            A brutally honest AI senior engineer will tear it apart.
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20" role="status" aria-live="polite">
          <div className="text-4xl mb-4 animate-bounce" aria-hidden="true">🔥</div>
          <p className="text-ink font-medium text-lg">Reviewing your code…</p>
          <p className="text-dim text-sm mt-2">The senior engineer is judging you right now</p>
        </div>
      )}

      {result ? (
        <div>
          <ReviewResult result={result} reviewId={reviewId} />
          <button
            onClick={() => { setResult(null); setId(null); }}
            className="mt-6 w-full border border-line text-dim hover:text-ink hover:border-trim py-3 rounded-lg text-sm transition-colors"
          >
            Review another piece of code
          </button>
        </div>
      ) : (
        !loading && <ReviewForm onResult={handleResult} onLoading={setLoading} />
      )}
    </main>
  );
}
