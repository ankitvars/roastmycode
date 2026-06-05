interface ScoreProps {
  label: string;
  score: number;
  icon:  string;
}

function scoreColor(n: number) {
  if (n >= 80) return 'text-merge';
  if (n >= 60) return 'text-changes';
  if (n >= 40) return 'text-high';
  return 'text-reject';
}

function barColor(n: number) {
  if (n >= 80) return 'bg-merge';
  if (n >= 60) return 'bg-changes';
  if (n >= 40) return 'bg-high';
  return 'bg-reject';
}

function Score({ label, score, icon }: ScoreProps) {
  return (
    <div className="bg-card border border-line rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-dim font-medium">
          <span aria-hidden="true">{icon} </span>{label}
        </span>
        <span
          className={`text-xl font-bold tabular-nums font-display ${scoreColor(score)}`}
          aria-label={`${score} out of 100`}
        >
          {score}
        </span>
      </div>
      <div className="w-full bg-raised rounded-full h-1.5" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${barColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-dim uppercase tracking-widest font-display">
          Scores
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ghost">Overall</span>
          <span
            className={`text-2xl font-black tabular-nums font-display ${scoreColor(scores.overall)}`}
            aria-label={`Overall score: ${scores.overall} out of 100`}
          >
            {scores.overall}
          </span>
          <span className="text-xs text-ghost">/100</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Score label="Security"      score={scores.security}      icon="🔒" />
        <Score label="Performance"   score={scores.performance}   icon="⚡" />
        <Score label="Accessibility" score={scores.accessibility} icon="♿" />
        <Score label="Quality"       score={scores.quality}       icon="✨" />
      </div>
    </div>
  );
}
