import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ReviewResult from '@/components/ReviewResult';
import type { ReviewRecord } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('reviews')
    .select('roast_line, verdict, score_overall')
    .eq('id', id)
    .single();

  if (!data) return {};

  return {
    title: `RoastMyCode — ${data.verdict} (${data.score_overall}/100)`,
    description: data.roast_line,
    openGraph: {
      title: `Code Review: ${data.verdict}`,
      description: data.roast_line,
      images: [`/api/og/${id}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Code Review: ${data.verdict}`,
      description: data.roast_line,
      images: [`/api/og/${id}`],
    },
  };
}

export default async function ReviewPermalinkPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (error || !data) notFound();

  const record = data as ReviewRecord;

  const result = {
    verdict:       record.verdict,
    roastLine:     record.roast_line,
    summary:       record.summary,
    findings:      record.findings,
    praise:        record.praise,
    language:      record.language ?? 'unknown',
    detectedStack: [],
    scores: {
      security:      record.score_security,
      performance:   record.score_perf,
      accessibility: record.score_a11y,
      quality:       record.score_quality,
      overall:       record.score_overall,
    },
  };

  // Increment view count (fire-and-forget)
  supabase.from('reviews').update({ view_count: record.view_count + 1 }).eq('id', id);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          {record.pr_title && (
            <p className="text-sm text-gray-500">
              PR: <span className="text-gray-300">{record.pr_title}</span>
              {record.pr_author && <span className="text-gray-600"> by @{record.pr_author}</span>}
            </p>
          )}
          <p className="text-xs text-gray-600 mt-1">
            {new Date(record.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
            {' · '}{record.view_count} views
          </p>
        </div>
      </div>
      <ReviewResult result={result} reviewId={id} />
    </main>
  );
}
