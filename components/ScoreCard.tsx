function blockBar(score: number, width = 20): string {
  const filled = Math.round((score / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function scoreColor(n: number) {
  if (n >= 80) return 'text-merge';
  if (n >= 60) return 'text-changes';
  if (n >= 40) return 'text-high';
  return 'text-reject';
}

interface ScoreRowProps {
  label: string;
  abbr:  string;
  score: number;
}

function ScoreRow({ label, abbr, score }: ScoreRowProps) {
  return (
    <div className="font-mono flex items-center gap-3 py-2 border-b border-line last:border-0">
      <span className="text-xs text-dim w-16 shrink-0 uppercase tracking-wider">{abbr}</span>
      <span
        className={`text-xs tracking-tighter ${scoreColor(score)}`}
        aria-hidden="true"
      >
        {blockBar(score)}
      </span>
      <span
        className={`text-sm font-bold tabular-nums ml-auto shrink-0 ${scoreColor(score)}`}
        aria-label={`${label}: ${score} out of 100`}
      >
        {score}
      </span>
    </div>
  );
}

interface ScoreCardProps {
  scores: {
    security:      number;
    performance:   number;
    accessibility: number;
    quality:       number;
    overall:       number;
  };
}

export default function ScoreCard({ scores }: ScoreCardProps) {
  return (
    <div className="bg-card border border-line p-5 font-mono">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-line">
        <span className="text-xs text-dim uppercase tracking-wider">scores</span>
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-3xl font-black tabular-nums ${scoreColor(scores.overall)}`}
            aria-label={`Overall score: ${scores.overall} out of 100`}
          >
            {scores.overall}
          </span>
          <span className="text-xs text-dim">/100</span>
        </div>
      </div>
      <div>
        <ScoreRow label="Security"      abbr="sec"     score={scores.security}      />
        <ScoreRow label="Performance"   abbr="perf"    score={scores.performance}   />
        <ScoreRow label="Accessibility" abbr="a11y"    score={scores.accessibility} />
        <ScoreRow label="Quality"       abbr="quality" score={scores.quality}       />
      </div>
    </div>
  );
}
