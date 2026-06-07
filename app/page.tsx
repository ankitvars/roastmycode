import Link from 'next/link';

const EXAMPLES = [
  { score: 12, verdict: 'REJECT',          roast: "This SQL query is so injectable, I could make it sing Bollywood songs." },
  { score: 67, verdict: 'REQUEST_CHANGES', roast: "More re-renders than a Netflix series reboot — at least those are intentional." },
  { score: 91, verdict: 'MERGE',           roast: "Clean code, proper types, actual error handling. Are you sure you wrote this?" },
];

const VERDICT_STYLE: Record<string, string> = {
  REJECT:          'text-reject border-reject/50',
  REQUEST_CHANGES: 'text-changes border-changes/50',
  MERGE:           'text-merge border-merge/50',
};

const SCORE_COLOR: Record<string, string> = {
  REJECT:          'text-reject',
  REQUEST_CHANGES: 'text-changes',
  MERGE:           'text-merge',
};

export default function HomePage() {
  return (
    <main>
      {/* Hero — terminal session */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-20">
        <div className="font-mono text-xs space-y-1 mb-10 text-ghost" aria-hidden="true">
          <p><span className="text-fire">$</span> roastmycode <span className="text-dim">--version</span></p>
          <p className="pl-4 text-dim">v2.0.0-brutal — AI senior engineer code review</p>
          <p><span className="text-fire">$</span> roastmycode <span className="text-dim">--help</span></p>
          <p className="pl-4 text-dim">Usage: roastmycode [code|pr-url] [--provider=&lt;model&gt;]</p>
          <p className="pl-4 text-dim">Get your code torn apart. Security, perf, arch. No filters.</p>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black font-mono text-ink leading-[1.1] mb-6">
          get your code<br />
          <span className="text-fire">brutally roasted.</span>
        </h1>

        <p className="font-mono text-dim text-sm max-w-2xl mb-10 leading-relaxed border-l-2 border-line pl-4">
          <span className="text-ghost" aria-hidden="true">// </span>paste code or github pr url<br />
          <span className="text-ghost" aria-hidden="true">// </span>ai senior engineer tears it apart<br />
          <span className="text-ghost" aria-hidden="true">// </span>security · performance · architecture<br />
          <span className="text-ghost" aria-hidden="true">// </span>no sugar-coating — just the truth
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/review"
            className="inline-flex items-center gap-2 bg-fire hover:bg-ember text-white font-mono text-sm px-6 py-3 transition-colors"
          >
            <span aria-hidden="true" className="opacity-60">$</span> roast my code
          </Link>
          <span className="font-mono text-dim text-xs">
            free · no credit card · 15 reviews/min
          </span>
        </div>

        <p className="mt-4 font-mono text-dim text-xs">
          <span aria-hidden="true" className="opacity-60">/* </span>
          typescript · python · go · java · rust · and more
          <span aria-hidden="true" className="opacity-60"> */</span>
        </p>
      </section>

      {/* Example output */}
      <section className="max-w-4xl mx-auto px-4 pb-20" aria-label="Example reviews">
        <h2 className="font-mono text-xs text-dim mb-4 flex items-center gap-2">
          <span className="text-fire" aria-hidden="true">$</span>
          example reviews
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {EXAMPLES.map((ex, i) => (
            <div key={i} className="bg-card border border-line p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold border px-2 py-0.5 ${VERDICT_STYLE[ex.verdict]}`}>
                  {ex.verdict.replace('_', ' ')}
                </span>
                <span
                  className={`text-2xl font-black tabular-nums font-mono ${SCORE_COLOR[ex.verdict]}`}
                  aria-label={`Score: ${ex.score}`}
                >
                  {ex.score}
                </span>
              </div>
              <p className="text-xs text-dim leading-relaxed">&ldquo;{ex.roast}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line py-20" aria-label="How it works">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-mono text-xs text-dim mb-10 flex items-center gap-2">
            <span className="text-fire" aria-hidden="true">$</span>
            how it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'paste code or pr url', desc: 'Drop any code snippet or link to a public GitHub PR.' },
              { step: '02', title: 'ai reviews it',        desc: 'Your chosen model analyzes security, performance, accessibility, and architecture.' },
              { step: '03', title: 'get roasted + share',  desc: 'Receive a brutal scorecard. Share the verdict to flex (or suffer).' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div className="text-fire text-sm font-bold mb-2 font-mono" aria-hidden="true">[{step}]</div>
                <h3 className="font-semibold text-ink text-sm mb-2">{title}</h3>
                <p className="text-xs text-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
