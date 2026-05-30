import { getFlashModel } from './gemini';
import { computeScores } from './scorer';
import type { ReviewResult, Finding, Verdict } from './types';
import { randomUUID } from 'crypto';

export function buildReviewPrompt(code: string, language: string): string {
  return `You are a brutally honest senior software engineer with 12 years of experience.
You have zero tolerance for bad code. You are reviewing code like a staff engineer at a top product company (think CRED, Razorpay, Google).

You care deeply about: security (OWASP Top 10), performance (no unnecessary re-renders, N+1 queries, memory leaks), accessibility (WCAG 2.1 AA), and clean architecture (SOLID, DRY, proper error handling).

Review the following ${language} code and return ONLY a valid JSON object — no markdown, no explanation, no code blocks. Just raw JSON.

The JSON must have exactly this shape:
{
  "verdict": "MERGE" | "REQUEST_CHANGES" | "REJECT",
  "roastLine": "one brutal, witty, specific one-liner about the biggest problem (this is the viral hook — make it memorable and India-specific if possible)",
  "summary": "2-3 sentence overall assessment — be direct, be specific",
  "findings": [
    {
      "id": "unique-short-id",
      "category": "security" | "performance" | "accessibility" | "quality" | "architecture",
      "severity": "critical" | "high" | "medium" | "low" | "nitpick",
      "title": "short specific problem title",
      "description": "1-2 sentences explaining the problem and why it matters",
      "suggestion": "specific, actionable fix — include code if helpful",
      "lineRef": "Line X or Lines X-Y if identifiable, else omit",
      "codeSnippet": "offending snippet if short enough, else omit"
    }
  ],
  "praise": ["1 to 3 strings — specific things done well, not generic praise"],
  "language": "${language}",
  "detectedStack": ["list of frameworks/libraries detected e.g. React, Next.js, TypeScript"]
}

Rules:
- verdict REJECT only for critical security vulnerabilities or completely broken logic
- verdict MERGE only if code is genuinely production-ready
- findings must be specific to THIS code — no generic advice
- roastLine must be funny, specific, and slightly savage — it's what gets shared on Twitter
- praise must be genuine — don't praise bad code
- if no issues found in a category, simply don't include findings for it
- maximum 10 findings total — prioritise the worst ones

=== CODE TO REVIEW ===
${code}
=== END CODE ===`;
}

export function parseReviewResponse(raw: string): ReviewResult {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`AI returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }

  const verdict = parsed.verdict as Verdict;
  if (!['MERGE', 'REQUEST_CHANGES', 'REJECT'].includes(verdict)) {
    throw new Error(`Invalid verdict: ${verdict}`);
  }

  const roastLine = String(parsed.roastLine || '');
  const summary   = String(parsed.summary || '');
  const language  = String(parsed.language || 'unknown');

  const rawFindings = (parsed.findings as Finding[] | undefined) ?? [];
  const findings: Finding[] = rawFindings.map(f => ({
    id:          f.id || randomUUID().slice(0, 8),
    category:    f.category,
    severity:    f.severity,
    title:       f.title,
    description: f.description,
    suggestion:  f.suggestion,
    lineRef:     f.lineRef,
    codeSnippet: f.codeSnippet,
  }));

  const praise        = (parsed.praise as string[] | undefined) ?? [];
  const detectedStack = (parsed.detectedStack as string[] | undefined) ?? [];
  const scores        = computeScores(findings);

  return { verdict, roastLine, summary, findings, praise, scores, language, detectedStack };
}

export async function runAIReview(code: string, language = 'unknown'): Promise<ReviewResult> {
  const model  = getFlashModel();
  const prompt = buildReviewPrompt(code, language);
  const result = await model.generateContent(prompt);
  const text   = result.response.text();
  return parseReviewResponse(text);
}
