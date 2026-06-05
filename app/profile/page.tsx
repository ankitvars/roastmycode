import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { ReviewRecord } from '@/lib/types';

const VERDICT_STYLE: Record<string, string> = {
  MERGE:           'bg-merge/10 text-merge border-merge/30',
  REQUEST_CHANGES: 'bg-changes/10 text-changes border-changes/30',
  REJECT:          'bg-reject/10 text-reject border-reject/30',
};

function scoreColor(n: number) {
  if (n >= 80) return 'text-merge';
  if (n >= 60) return 'text-changes';
  return 'text-reject';
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/review');

  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, verdict, roast_line, score_overall, language, created_at, input_type, pr_title')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const list = (reviews ?? []) as Pick<
    ReviewRecord,
    'id' | 'verdict' | 'roast_line' | 'score_overall' | 'language' | 'created_at' | 'input_type' | 'pr_title'
  >[];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-ink">My Roasts</h1>
        <p className="text-dim text-sm mt-1">
          {list.length} review{list.length !== 1 ? 's' : ''}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20 text-ghost">
          <p className="text-4xl mb-4" aria-hidden="true">🤷</p>
          <p className="text-dim">No reviews yet.</p>
          <Link
            href="/review"
            className="mt-4 inline-block text-fire hover:text-ember text-sm transition-colors"
          >
            Get your first roast →
          </Link>
        </div>
      ) : (
        <ol className="space-y-3" aria-label="Your reviews">
          {list.map(r => (
            <li key={r.id}>
              <Link
                href={`/review/${r.id}`}
                className="block bg-card border border-line rounded-xl p-5 hover:border-trim transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-bold font-display px-2 py-0.5 rounded border ${VERDICT_STYLE[r.verdict] ?? ''}`}>
                        {r.verdict.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-ghost">
                        {r.input_type === 'github_pr' ? '🔗 PR' : '📋 Code'} · {r.language}
                      </span>
                    </div>
                    {r.pr_title && (
                      <p className="text-xs text-dim mb-1 truncate">{r.pr_title}</p>
                    )}
                    <p className="text-sm text-dim italic truncate">&ldquo;{r.roast_line}&rdquo;</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-2xl font-black font-display tabular-nums ${scoreColor(r.score_overall)}`}>
                      {r.score_overall}
                    </p>
                    <p className="text-xs text-ghost mt-0.5">
                      {new Date(r.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short',
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
