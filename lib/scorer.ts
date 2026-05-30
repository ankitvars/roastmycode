import type { Finding, Category } from './types';

const SEVERITY_PENALTY: Record<string, number> = {
  critical: 65,
  high:     35,
  medium:   15,
  low:       5,
  nitpick:   2,
};

const CATEGORY_WEIGHT: Record<Category, number> = {
  security:      0.35,
  performance:   0.25,
  accessibility: 0.20,
  quality:       0.20,
  architecture:  0,   // folds into quality
};

function scoreCategory(findings: Finding[], category: Category): number {
  const relevant = findings.filter(
    f => f.category === category || (category === 'quality' && f.category === 'architecture')
  );
  const penalty = relevant.reduce((sum, f) => sum + (SEVERITY_PENALTY[f.severity] ?? 0), 0);
  return Math.max(0, 100 - penalty);
}

export function computeScores(findings: Finding[]): {
  security:      number;
  performance:   number;
  accessibility: number;
  quality:       number;
  overall:       number;
} {
  const security      = scoreCategory(findings, 'security');
  const performance   = scoreCategory(findings, 'performance');
  const accessibility = scoreCategory(findings, 'accessibility');
  const quality       = scoreCategory(findings, 'quality');

  const overall = Math.round(
    security      * CATEGORY_WEIGHT.security +
    performance   * CATEGORY_WEIGHT.performance +
    accessibility * CATEGORY_WEIGHT.accessibility +
    quality       * CATEGORY_WEIGHT.quality
  );

  return { security, performance, accessibility, quality, overall };
}
