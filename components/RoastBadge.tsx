import type { Verdict } from '@/lib/types';

const VERDICT_CONFIG: Record<Verdict, {
  label:  string;
  style:  string;
  icon:   string;
}> = {
  MERGE: {
    label: 'LGTM — MERGE',
    style: 'bg-merge/10 border-merge/30 text-merge',
    icon:  '✅',
  },
  REQUEST_CHANGES: {
    label: 'REQUEST CHANGES',
    style: 'bg-changes/10 border-changes/30 text-changes',
    icon:  '🔄',
  },
  REJECT: {
    label: 'REJECT',
    style: 'bg-reject/10 border-reject/30 text-reject',
    icon:  '❌',
  },
};

export default function RoastBadge({ verdict }: { verdict: Verdict }) {
  const cfg = VERDICT_CONFIG[verdict];
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${cfg.style}`}>
      <span aria-hidden="true">{cfg.icon}</span>
      <span className="font-bold text-sm tracking-widest font-display">{cfg.label}</span>
    </div>
  );
}
