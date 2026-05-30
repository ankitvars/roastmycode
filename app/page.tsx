import Link from 'next/link';

const EXAMPLES = [
  { score: 12, verdict: 'REJECT', roast: "This SQL query is so injectable, I could make it sing Bollywood songs." },
  { score: 67, verdict: 'REQUEST_CHANGES', roast: "More re-renders than a Netflix series reboot — at least those are intentional." },
  { score: 91, verdict: 'MERGE', roast: "Clean code, proper types, actual error handling. Are you sure you wrote this?" },
];

export default function HomePage() {
  return (
    <main>
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Free — no credit card — 15 reviews/min
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
          Get your code<br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-500">
            brutally roasted
          </span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste your code or drop a GitHub PR URL. An AI senior engineer with zero patience
          for bad code will tear it apart — security, performance, accessibility, architecture.
          No sugar-coating. No empty praise. Just the truth.
        </p>

        <Link
          href="/review"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
        >
          🔥 Roast My Code
          <span className="text-indigo-300 text-sm font-normal">— it&apos;s free</span>
        </Link>

        <p className="mt-4 text-gray-600 text-sm">
          Works with TypeScript, Python, Go, Java, Rust and more
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
          Real reviews — no filters
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {EXAMPLES.map((ex, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  ex.verdict === 'REJECT'
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : ex.verdict === 'MERGE'
                    ? 'bg-green-950 text-green-400 border border-green-800'
                    : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                }`}>
                  {ex.verdict}
                </span>
                <span className={`text-2xl font-black ${
                  ex.score >= 80 ? 'text-green-400' :
                  ex.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>{ex.score}</span>
              </div>
              <p className="text-sm text-gray-300 italic leading-relaxed">&ldquo;{ex.roast}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: '📋', title: 'Paste code or PR URL', desc: 'Drop any code snippet or link to a public GitHub PR.' },
              { icon: '🤖', title: 'AI reviews it', desc: 'Gemini 1.5 Flash analyzes security, performance, accessibility, and architecture.' },
              { icon: '🔥', title: 'Get roasted + share', desc: 'Receive a brutal scorecard. Share the verdict on Twitter to flex (or suffer).' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-xl mx-auto mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
