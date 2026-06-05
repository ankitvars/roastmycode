import Link from 'next/link';

const EXAMPLES = [
  { score: 12, verdict: 'REJECT',          roast: "This SQL query is so injectable, I could make it sing Bollywood songs." },
  { score: 67, verdict: 'REQUEST_CHANGES', roast: "More re-renders than a Netflix series reboot — at least those are intentional." },
  { score: 91, verdict: 'MERGE',           roast: "Clean code, proper types, actual error handling. Are you sure you wrote this?" },
];

const VERDICT_STYLE: Record<string, string> = {
  REJECT:          'bg-reject/10 text-reject border-reject/30',
  REQUEST_CHANGES: 'bg-changes/10 text-changes border-changes/30',
  MERGE:           'bg-merge/10 text-merge border-merge/30',
};

const SCORE_COLOR: Record<string, string> = {
  REJECT:          'text-reject',
  REQUEST_CHANGES: 'text-changes',
  MERGE:           'text-merge',
};

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-card border border-line rounded-full px-4 py-1.5 text-xs text-dim mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-merge animate-pulse" aria-hidden="true" />
          Free — no credit card — 15 reviews/min
        </div>

        <h1 className="text-5xl sm:text-6xl font-black font-display text-ink leading-tight mb-6">
          Get your code<br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-fire to-ember">
            brutally roasted
          </span>
        </h1>

        <p className="text-dim text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste your code or drop a GitHub PR URL. An AI senior engineer with zero patience
          for bad code will tear it apart — security, performance, accessibility, architecture.
          No sugar-coating. No empty praise. Just the truth.
        </p>

        <Link
          href="/review"
          className="inline-flex items-center gap-2 bg-fire hover:bg-ember text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
        >
          🔥 Roast My Code
          <span className="text-white/70 text-sm font-normal">— it&apos;s free</span>
        </Link>

        <p className="mt-4 text-ghost text-sm">
          Works with TypeScript, Python, Go, Java, Rust and more
        </p>
      </section>

      {/* Example cards */}
      <section className="max-w-4xl mx-auto px-4 pb-20" aria-label="Example reviews">
        <h2 className="text-center text-xs font-semibold font-display text-ghost uppercase tracking-widest mb-8">
          Real reviews — no filters
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {EXAMPLES.map((ex, i) => (
            <div key={i} className="bg-card border border-line rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold font-display px-2 py-1 rounded border ${VERDICT_STYLE[ex.verdict]}`}>
                  {ex.verdict.replace('_', ' ')}
                </span>
                <span className={`text-2xl font-black font-display ${SCORE_COLOR[ex.verdict]}`}>
                  {ex.score}
                </span>
              </div>
              <p className="text-sm text-dim italic leading-relaxed">&ldquo;{ex.roast}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line py-20" aria-label="How it works">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold font-display text-ink text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: '📋', title: 'Paste code or PR URL', desc: 'Drop any code snippet or link to a public GitHub PR.' },
              { icon: '🤖', title: 'AI reviews it',        desc: 'Your chosen AI model analyzes security, performance, accessibility, and architecture.' },
              { icon: '🔥', title: 'Get roasted + share',  desc: 'Receive a brutal scorecard. Share the verdict on Twitter to flex (or suffer).' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-card border border-line flex items-center justify-center text-xl mx-auto mb-4" aria-hidden="true">
                  {icon}
                </div>
                <h3 className="font-semibold font-display text-ink mb-2">{title}</h3>
                <p className="text-sm text-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
