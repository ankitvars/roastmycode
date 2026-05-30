import { describe, it, expect } from 'vitest';
import { buildReviewPrompt, parseReviewResponse } from '@/lib/reviewer';

describe('buildReviewPrompt', () => {
  it('includes the code in the prompt', () => {
    const prompt = buildReviewPrompt('const x = 1;', 'typescript');
    expect(prompt).toContain('const x = 1;');
    expect(prompt).toContain('typescript');
  });

  it('instructs AI to return valid JSON only', () => {
    const prompt = buildReviewPrompt('const x = 1;', 'typescript');
    expect(prompt.toLowerCase()).toContain('json');
    expect(prompt).toContain('roastLine');
    expect(prompt).toContain('verdict');
    expect(prompt).toContain('findings');
  });
});

describe('parseReviewResponse', () => {
  it('parses valid JSON response from Gemini', () => {
    const raw = JSON.stringify({
      verdict: 'REQUEST_CHANGES',
      roastLine: "This code has more issues than a Mumbai traffic jam.",
      summary: "Overall mediocre quality with some security concerns.",
      findings: [
        {
          id: '1',
          category: 'security',
          severity: 'high',
          title: 'No input validation',
          description: 'User input is not validated before use.',
          suggestion: 'Add Zod schema validation.',
        }
      ],
      praise: ['Good variable naming'],
      language: 'typescript',
      detectedStack: ['React', 'TypeScript'],
    });

    const result = parseReviewResponse(raw);
    expect(result.verdict).toBe('REQUEST_CHANGES');
    expect(result.roastLine).toContain('Mumbai');
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].severity).toBe('high');
    expect(result.scores.security).toBeLessThan(100);
    expect(result.scores.overall).toBeGreaterThan(0);
  });

  it('throws on malformed response', () => {
    expect(() => parseReviewResponse('not json at all')).toThrow();
  });

  it('throws if verdict is missing', () => {
    expect(() => parseReviewResponse(JSON.stringify({ roastLine: 'hi' }))).toThrow();
  });
});
