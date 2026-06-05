'use client';

import type { Finding } from '@/lib/types';
import { useState } from 'react';

const SEVERITY_STYLE: Record<string, string> = {
  critical: 'bg-critical/10 text-critical border-critical/30',
  high:     'bg-high/10 text-high border-high/30',
  medium:   'bg-medium/10 text-medium border-medium/30',
  low:      'bg-low/10 text-low border-low/30',
  nitpick:  'bg-nitpick/10 text-nitpick border-nitpick/30',
};

const CATEGORY_ICON: Record<string, string> = {
  security:      '🔒',
  performance:   '⚡',
  accessibility: '♿',
  quality:       '✨',
  architecture:  '🏗️',
};

export default function FindingRow({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(false);
  const style = SEVERITY_STYLE[finding.severity] ?? SEVERITY_STYLE.low;

  return (
    <div className="border border-line rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-raised transition-colors"
      >
        <span className="mt-0.5 text-base" aria-hidden="true">
          {CATEGORY_ICON[finding.category] ?? '•'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${style}`}>
              {finding.severity.toUpperCase()}
            </span>
            {finding.lineRef && (
              <span className="text-xs text-ghost font-mono">{finding.lineRef}</span>
            )}
          </div>
          <p className="text-sm text-ink font-medium mt-1">{finding.title}</p>
        </div>
        <span className="text-ghost text-xs mt-1" aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-line px-4 pb-4 pt-3 space-y-3">
          <p className="text-sm text-dim">{finding.description}</p>

          {finding.codeSnippet && (
            <pre className="bg-canvas rounded p-3 text-xs font-mono text-dim overflow-x-auto border border-line">
              {finding.codeSnippet}
            </pre>
          )}

          <div className="bg-fire/5 border border-fire/20 rounded p-3">
            <p className="text-xs font-semibold text-fire mb-1">Suggestion</p>
            <p className="text-sm text-ink">{finding.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
