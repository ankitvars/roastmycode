import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { ReviewRecord } from '@/lib/types';

const VERDICT_STYLE: Record<string, string> = {
  MERGE:           'bg-green-950 text-green-400 border-green-800',
  REQUEST_CHANGES: 'bg-yellow-950 text-yellow-400 border-yellow-800',
  REJECT:          'bg-red-950 text-red-400 border-red-800',
};

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
        <h1 className="text-2xl font-bold text-white">My Roasts</h1>
        <p className="text-gray-500 text-sm mt-1">{list.length} review{list.length !== 1 ? 's' : ''}</p>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <p className="text-4xl mb-4">🤷</p>
          <p>No reviews yet.</p>
          <Link href="/review" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm">
            Get your first roast →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(r => (
            <Link
              key={r.id}
              href={`/review/${r.id}`}
              className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${VERDICT_STYLE[r.verdict] ?? ''}`}>
                      {r.verdict}
                    </span>
                    <span className="text-xs text-gray-600">
                      {r.input_type === 'github_pr' ? '🔗 PR' : '📋 Code'} · {r.language}
                    </span>
                  </div>
                  {r.pr_title && (
                    <p className="text-xs text-gray-500 mb-1 truncate">{r.pr_title}</p>
                  )}
                  <p className="text-sm text-gray-300 italic truncate">&ldquo;{r.roast_line}&rdquo;</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-2xl font-black tabular-nums ${
                    r.score_overall >= 80 ? 'text-green-400' :
                    r.score_overall >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>{r.score_overall}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {new Date(r.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short',
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
