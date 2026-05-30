import type { Verdict } from '@/lib/types';

const VERDICT_CONFIG: Record<Verdict, {
  label:   string;
  bg:      string;
  border:  string;
  text:    string;
  icon:    string;
}> = {
  MERGE: {
    label:  'LGTM — MERGE',
    bg:     'bg-green-950',
    border: 'border-green-700',
    text:   'text-green-400',
    icon:   '✅',
  },
  REQUEST_CHANGES: {
    label:  'REQUEST CHANGES',
    bg:     'bg-yellow-950',
    border: 'border-yellow-700',
    text:   'text-yellow-400',
    icon:   '🔄',
  },
  REJECT: {
    label:  'REJECT',
    bg:     'bg-red-950',
    border: 'border-red-800',
    text:   'text-red-400',
    icon:   '❌',
  },
};

export default function RoastBadge({ verdict }: { verdict: Verdict }) {
  const cfg = VERDICT_CONFIG[verdict];
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${cfg.bg} ${cfg.border}`}>
      <span>{cfg.icon}</span>
      <span className={`font-bold text-sm tracking-widest ${cfg.text}`}>{cfg.label}</span>
    </div>
  );
}
