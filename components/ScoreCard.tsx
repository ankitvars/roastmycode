interface ScoreProps {
  label: string;
  score: number;
  icon:  string;
}

function Score({ label, score, icon }: ScoreProps) {
  const color =
    score >= 80 ? 'text-green-400'  :
    score >= 60 ? 'text-yellow-400' :
    score >= 40 ? 'text-orange-400' : 'text-red-400';

  const barColor =
    score >= 80 ? 'bg-green-500'  :
    score >= 60 ? 'bg-yellow-500' :
    score >= 40 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-medium">{icon} {label}</span>
        <span className={`text-xl font-bold tabular-nums ${color}`}>{score}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
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
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Scores</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Overall</span>
          <span className={`text-2xl font-black tabular-nums ${
            scores.overall >= 80 ? 'text-green-400' :
            scores.overall >= 60 ? 'text-yellow-400' :
            scores.overall >= 40 ? 'text-orange-400' : 'text-red-400'
          }`}>{scores.overall}</span>
          <span className="text-xs text-gray-600">/100</span>
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
