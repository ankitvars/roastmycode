import type { Finding } from '@/lib/types';
import { useState } from 'react';

const SEVERITY_STYLE: Record<string, { badge: string; dot: string }> = {
  critical: { badge: 'bg-red-950 text-red-400 border-red-800',    dot: 'bg-red-500' },
  high:     { badge: 'bg-orange-950 text-orange-400 border-orange-800', dot: 'bg-orange-500' },
  medium:   { badge: 'bg-yellow-950 text-yellow-400 border-yellow-800', dot: 'bg-yellow-500' },
  low:      { badge: 'bg-blue-950 text-blue-400 border-blue-800',  dot: 'bg-blue-500' },
  nitpick:  { badge: 'bg-gray-800 text-gray-400 border-gray-700',  dot: 'bg-gray-500' },
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
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-900 transition-colors"
      >
        <span className="mt-0.5 text-base">{CATEGORY_ICON[finding.category] ?? '•'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${style.badge}`}>
              {finding.severity.toUpperCase()}
            </span>
            {finding.lineRef && (
              <span className="text-xs text-gray-600 font-mono">{finding.lineRef}</span>
            )}
          </div>
          <p className="text-sm text-white font-medium mt-1">{finding.title}</p>
        </div>
        <span className="text-gray-600 text-xs mt-1">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-gray-800 px-4 pb-4 pt-3 space-y-3">
          <p className="text-sm text-gray-300">{finding.description}</p>

          {finding.codeSnippet && (
            <pre className="bg-gray-950 rounded p-3 text-xs font-mono text-gray-400 overflow-x-auto">
              {finding.codeSnippet}
            </pre>
          )}

          <div className="bg-indigo-950 border border-indigo-800 rounded p-3">
            <p className="text-xs font-semibold text-indigo-400 mb-1">Suggestion</p>
            <p className="text-sm text-indigo-200">{finding.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
