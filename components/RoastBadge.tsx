import type { Verdict } from '@/lib/types';

const VERDICT_CONFIG: Record<Verdict, {
  label:  string;
  style:  string;
  prefix: string;
}> = {
  MERGE: {
    label:  'LGTM — MERGE',
    style:  'border-merge/40 text-merge bg-merge/8',
    prefix: '✓',
  },
  REQUEST_CHANGES: {
    label:  'REQUEST CHANGES',
    style:  'border-changes/40 text-changes bg-changes/8',
    prefix: '!',
  },
  REJECT: {
    label:  'REJECT',
    style:  'border-reject/40 text-reject bg-reject/8',
    prefix: '✗',
  },
};

export default function RoastBadge({ verdict }: { verdict: Verdict }) {
  const cfg = VERDICT_CONFIG[verdict];
  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 border font-mono ${cfg.style}`}>
      <span className="font-bold text-sm" aria-hidden="true">[{cfg.prefix}]</span>
      <span className="font-bold text-sm tracking-widest">{cfg.label}</span>
    </div>
  );
}
