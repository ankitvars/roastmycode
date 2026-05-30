import { describe, it, expect } from 'vitest';
import { computeScores } from '@/lib/scorer';
import type { Finding } from '@/lib/types';

const noFindings: Finding[] = [];

const heavyFindings: Finding[] = [
  { id: '1', category: 'security',     severity: 'critical', title: 'SQL injection',      description: '', suggestion: '' },
  { id: '2', category: 'security',     severity: 'high',     title: 'XSS risk',           description: '', suggestion: '' },
  { id: '3', category: 'performance',  severity: 'critical', title: 'N+1 query',          description: '', suggestion: '' },
  { id: '4', category: 'accessibility',severity: 'high',     title: 'Missing aria-label', description: '', suggestion: '' },
  { id: '5', category: 'quality',      severity: 'medium',   title: 'No error handling',  description: '', suggestion: '' },
];

const lightFindings: Finding[] = [
  { id: '1', category: 'quality', severity: 'nitpick', title: 'Prefer const', description: '', suggestion: '' },
  { id: '2', category: 'quality', severity: 'low',     title: 'Rename var',   description: '', suggestion: '' },
];

describe('computeScores', () => {
  it('returns 100 for all categories when there are no findings', () => {
    const scores = computeScores(noFindings);
    expect(scores.security).toBe(100);
    expect(scores.performance).toBe(100);
    expect(scores.accessibility).toBe(100);
    expect(scores.quality).toBe(100);
    expect(scores.overall).toBe(100);
  });

  it('penalises critical security finding heavily', () => {
    const scores = computeScores(heavyFindings);
    expect(scores.security).toBeLessThan(40);
    expect(scores.performance).toBeLessThan(40);
    expect(scores.accessibility).toBeLessThan(70);
  });

  it('only slightly penalises nitpick findings', () => {
    const scores = computeScores(lightFindings);
    expect(scores.quality).toBeGreaterThan(80);
    expect(scores.security).toBe(100);
  });

  it('overall score is a weighted average of all category scores', () => {
    const scores = computeScores(heavyFindings);
    const manual = Math.round(
      scores.security * 0.35 +
      scores.performance * 0.25 +
      scores.accessibility * 0.20 +
      scores.quality * 0.20
    );
    expect(scores.overall).toBe(manual);
  });

  it('score never goes below 0', () => {
    const manyFindings: Finding[] = Array.from({ length: 20 }, (_, i) => ({
      id: String(i), category: 'security' as const, severity: 'critical' as const,
      title: `Issue ${i}`, description: '', suggestion: '',
    }));
    const scores = computeScores(manyFindings);
    expect(scores.security).toBeGreaterThanOrEqual(0);
  });
});
