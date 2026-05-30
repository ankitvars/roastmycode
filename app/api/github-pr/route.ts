import { NextRequest, NextResponse } from 'next/server';
import { parseGithubPRUrl, fetchGithubPR } from '@/lib/githubPR';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'url param required' }, { status: 400 });
  }

  const meta = parseGithubPRUrl(url);
  if (!meta) {
    return NextResponse.json({ error: 'Invalid GitHub PR URL' }, { status: 400 });
  }

  try {
    const pr = await fetchGithubPR(meta);
    return NextResponse.json({
      title:  pr.title,
      author: pr.author,
      valid:  true,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch PR' },
      { status: 400 }
    );
  }
}
