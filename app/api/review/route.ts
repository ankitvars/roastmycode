import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runAIReview } from '@/lib/reviewer';
import { fetchGithubPR, parseGithubPRUrl } from '@/lib/githubPR';
import { createClient } from '@/lib/supabase/server';

const RequestSchema = z.discriminatedUnion('type', [
  z.object({
    type:     z.literal('code'),
    code:     z.string().min(10, 'Code must be at least 10 characters').max(30000),
    language: z.string().optional().default('unknown'),
  }),
  z.object({
    type: z.literal('github_pr'),
    url:  z.string().url(),
  }),
]);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    let codeToReview: string;
    let inputType: 'code' | 'github_pr';
    let rawInput: string;
    let prTitle:  string | null = null;
    let prAuthor: string | null = null;
    let language = 'unknown';

    if (parsed.data.type === 'github_pr') {
      const meta = parseGithubPRUrl(parsed.data.url);
      if (!meta) {
        return NextResponse.json({ error: 'Invalid GitHub PR URL' }, { status: 400 });
      }
      const pr  = await fetchGithubPR(meta);
      codeToReview = pr.formattedForReview;
      inputType    = 'github_pr';
      rawInput     = parsed.data.url;
      prTitle      = pr.title;
      prAuthor     = pr.author;
    } else {
      codeToReview = parsed.data.code;
      inputType    = 'code';
      rawInput     = parsed.data.code;
      language     = parsed.data.language;
    }

    const review = await runAIReview(codeToReview, language);

    const { data: record, error: dbError } = await supabase
      .from('reviews')
      .insert({
        user_id:        user?.id ?? null,
        input_type:     inputType,
        raw_input:      rawInput,
        language:       review.language,
        pr_title:       prTitle,
        pr_author:      prAuthor,
        verdict:        review.verdict,
        summary:        review.summary,
        roast_line:     review.roastLine,
        findings:       review.findings,
        praise:         review.praise,
        score_security: review.scores.security,
        score_perf:     review.scores.performance,
        score_a11y:     review.scores.accessibility,
        score_quality:  review.scores.quality,
        score_overall:  review.scores.overall,
        is_public:      true,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('DB insert error:', dbError);
      return NextResponse.json({ review, id: null });
    }

    return NextResponse.json({ review, id: record.id });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Review failed';
    console.error('Review error:', err);

    if (message.includes('rate limit') || message.includes('429')) {
      return NextResponse.json(
        { error: 'AI rate limit hit — please wait 30 seconds and try again' },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
