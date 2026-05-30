import { describe, it, expect } from 'vitest';
import { parseGithubPRUrl, formatDiffForReview } from '@/lib/githubPR';

describe('parseGithubPRUrl', () => {
  it('parses a valid GitHub PR URL', () => {
    const result = parseGithubPRUrl('https://github.com/ankitvars/my-app/pull/42');
    expect(result).toEqual({ owner: 'ankitvars', repo: 'my-app', prNumber: 42 });
  });

  it('returns null for non-PR URL', () => {
    expect(parseGithubPRUrl('https://github.com/ankitvars/my-app')).toBeNull();
    expect(parseGithubPRUrl('not-a-url')).toBeNull();
    expect(parseGithubPRUrl('')).toBeNull();
  });

  it('parses PR URL without https', () => {
    const result = parseGithubPRUrl('github.com/ankitvars/my-app/pull/7');
    expect(result?.prNumber).toBe(7);
  });
});

describe('formatDiffForReview', () => {
  it('truncates extremely long diffs to stay under token limit', () => {
    const longDiff = 'x'.repeat(50000);
    const result = formatDiffForReview(longDiff, 'my-app', 'Fix auth bug', 'ankitvars');
    expect(result.length).toBeLessThan(30000);
  });

  it('includes PR metadata in the formatted output', () => {
    const result = formatDiffForReview(
      'diff --git a/src/auth.ts\n+const token = req.body.token',
      'my-app',
      'Fix auth token handling',
      'ankitvars'
    );
    expect(result).toContain('my-app');
    expect(result).toContain('Fix auth token handling');
    expect(result).toContain('ankitvars');
  });
});
