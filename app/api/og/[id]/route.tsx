import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('reviews')
    .select('verdict, roast_line, score_overall, score_security, score_perf, score_a11y, score_quality, language')
    .eq('id', id)
    .single();

  if (!data) {
    return new NextResponse('Not found', { status: 404 });
  }

  const verdictColor =
    data.verdict === 'MERGE'           ? '#22c55e' :
    data.verdict === 'REQUEST_CHANGES' ? '#eab308' : '#ef4444';

  const scoreColor = (s: number) =>
    s >= 80 ? '#22c55e' : s >= 60 ? '#eab308' : s >= 40 ? '#f97316' : '#ef4444';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px; height: 630px; background: #030712;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex; flex-direction: column; justify-content: space-between; padding: 60px;
      border-top: 8px solid ${verdictColor};
    }
    .top { display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 24px; color: #6b7280; font-weight: 600; }
    .verdict { font-size: 48px; font-weight: 900; color: ${verdictColor}; letter-spacing: -1px; }
    .overall { text-align: right; }
    .overall-label { font-size: 18px; color: #6b7280; }
    .overall-score { font-size: 96px; font-weight: 900; color: ${verdictColor}; line-height: 1; }
    .roast { font-size: 32px; color: #e5e7eb; font-style: italic; line-height: 1.4; max-width: 900px; }
    .scores { display: flex; gap: 32px; }
    .score-item { text-align: center; }
    .score-icon { font-size: 28px; margin-bottom: 4px; }
    .score-value { font-size: 36px; font-weight: 900; }
    .score-label { font-size: 14px; color: #6b7280; margin-top: 2px; }
    .footer { font-size: 18px; color: #374151; }
  </style>
</head>
<body>
  <div class="top">
    <div>
      <div class="brand">🔥 RoastMyCode</div>
      <div class="verdict">${data.verdict.replace('_', ' ')}</div>
    </div>
    <div class="overall">
      <div class="overall-label">Overall Score</div>
      <div class="overall-score">${data.score_overall}</div>
    </div>
  </div>

  <div class="roast">"${data.roast_line.slice(0, 120)}${data.roast_line.length > 120 ? '…' : ''}"</div>

  <div style="display: flex; justify-content: space-between; align-items: flex-end;">
    <div class="scores">
      <div class="score-item">
        <div class="score-icon">🔒</div>
        <div class="score-value" style="color: ${scoreColor(data.score_security)}">${data.score_security}</div>
        <div class="score-label">Security</div>
      </div>
      <div class="score-item">
        <div class="score-icon">⚡</div>
        <div class="score-value" style="color: ${scoreColor(data.score_perf)}">${data.score_perf}</div>
        <div class="score-label">Performance</div>
      </div>
      <div class="score-item">
        <div class="score-icon">♿</div>
        <div class="score-value" style="color: ${scoreColor(data.score_a11y)}">${data.score_a11y}</div>
        <div class="score-label">A11y</div>
      </div>
      <div class="score-item">
        <div class="score-icon">✨</div>
        <div class="score-value" style="color: ${scoreColor(data.score_quality)}">${data.score_quality}</div>
        <div class="score-label">Quality</div>
      </div>
    </div>
    <div class="footer">roastmycode.vercel.app</div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
