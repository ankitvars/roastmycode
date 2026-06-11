'use client';

import type { Finding } from '@/lib/types';
import { useState } from 'react';

const SEVERITY_STYLE: Record<string, { badge: string; abbr: string }> = {
  critical: { badge: 'text-critical border-critical/40', abbr: 'CRIT' },
  high:     { badge: 'text-high border-high/40',         abbr: 'HIGH' },
  medium:   { badge: 'text-medium border-medium/40',     abbr: 'MED'  },
  low:      { badge: 'text-low border-low/40',           abbr: 'LOW'  },
  nitpick:  { badge: 'text-nitpick border-nitpick/40',   abbr: 'NIT'  },
};

const CATEGORY_ABBR: Record<string, string> = {
  security:      'sec',
  performance:   'perf',
  accessibility: 'a11y',
  quality:       'qual',
  architecture:  'arch',
};

export default function FindingRow({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(false);
  const style = SEVERITY_STYLE[finding.severity] ?? SEVERITY_STYLE.low;

  return (
    <div className="border border-line overflow-hidden font-mono">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-raised transition-colors"
      >
        <span className={`text-xs font-bold border px-1.5 py-0.5 shrink-0 mt-0.5 tabular-nums ${style.badge}`}>
          {style.abbr}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-ghost uppercase">{CATEGORY_ABBR[finding.category] ?? finding.category}</span>
            {finding.lineRef && (
              <span className="text-xs text-fire">{finding.lineRef}</span>
            )}
          </div>
          <p className="text-sm text-ink mt-0.5">{finding.title}</p>
        </div>
        <span className="text-ghost text-xs mt-1 shrink-0" aria-hidden="true">{open ? '[-]' : '[+]'}</span>
      </button>

      {open && (
        <div className="border-t border-line px-4 pb-4 pt-3 space-y-3 bg-raised">
          <p className="text-sm text-dim leading-relaxed">{finding.description}</p>

          {finding.codeSnippet && (
            <pre className="bg-canvas p-3 text-xs font-mono text-dim overflow-x-auto border border-line leading-relaxed">
              {finding.codeSnippet}
            </pre>
          )}

          <div className="bg-fire/5 border border-fire/20 p-3">
            <p className="text-xs font-semibold text-fire mb-1">// suggestion</p>
            <p className="text-sm text-ink">{finding.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
