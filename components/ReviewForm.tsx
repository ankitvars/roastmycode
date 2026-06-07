'use client';

import { useState, useRef } from 'react';
import type { ReviewResult } from '@/lib/types';
import type { Provider } from '@/lib/provider-config';
import { PROVIDER_LABELS } from '@/lib/provider-config';

interface ReviewFormProps {
  onResult:  (result: ReviewResult, id: string | null) => void;
  onLoading: (loading: boolean) => void;
}

type Tab = 'code' | 'github_pr';

const PLACEHOLDER_CODE = `// Paste your code here — any language works
function authenticate(username, password) {
  const query = \`SELECT * FROM users WHERE username='\${username}'\`;
  return db.execute(query);
}`;

const LANGUAGE_OPTIONS = [
  'typescript', 'javascript', 'python', 'go', 'java',
  'rust', 'c++', 'c#', 'ruby', 'php', 'unknown',
];

const PROVIDER_ICONS: Record<Provider, string> = {
  gemini:    '✦',
  anthropic: '◆',
  openai:    '⬡',
  qwen:      '❋',
};

export default function ReviewForm({ onResult, onLoading }: ReviewFormProps) {
  const [tab, setTab]           = useState<Tab>('code');
  const [code, setCode]         = useState('');
  const [prUrl, setPrUrl]       = useState('');
  const [language, setLang]     = useState('typescript');
  const [provider, setProvider] = useState<Provider>('gemini');
  const [error, setError]       = useState('');
  const [prMeta, setPrMeta]     = useState<{ title: string; author: string } | null>(null);
  const prDebounce              = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handlePrUrlChange = (url: string) => {
    setPrUrl(url);
    setPrMeta(null);
    clearTimeout(prDebounce.current);
    if (!url.includes('github.com') || !url.includes('/pull/')) return;
    prDebounce.current = setTimeout(async () => {
      const res  = await fetch(`/api/github-pr?url=${encodeURIComponent(url)}`);
      const data = await res.json() as { title?: string; author?: string; error?: string };
      if (data.title) setPrMeta({ title: data.title, author: data.author ?? '' });
    }, 600);
  };

  const handleSubmit = async () => {
    setError('');
    onLoading(true);

    try {
      const body = tab === 'code'
        ? { type: 'code', code, language, provider }
        : { type: 'github_pr', url: prUrl, provider };

      const res  = await fetch('/api/review', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      const data = await res.json() as { review?: ReviewResult; id?: string; error?: string };

      if (!res.ok || data.error) {
        setError(data.error ?? 'Review failed — please try again');
        return;
      }

      onResult(data.review!, data.id ?? null);

    } catch {
      setError('Network error — please try again');
    } finally {
      onLoading(false);
    }
  };

  const isSubmittable = tab === 'code'
    ? code.trim().length >= 10
    : prUrl.includes('github.com') && prUrl.includes('/pull/');

  return (
    <div className="border border-line overflow-hidden font-mono">
      {/* Terminal title bar */}
      <div className="bg-raised border-b border-line px-4 py-2 flex items-center gap-2" aria-hidden="true">
        <span className="w-2.5 h-2.5 rounded-full bg-reject/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-changes/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-merge/60" />
        <span className="ml-2 text-xs text-ghost">roastmycode — code-review.sh</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line" role="tablist">
        {(['code', 'github_pr'] as Tab[]).map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-xs font-mono transition-colors ${
              tab === t
                ? 'bg-canvas text-fire border-b border-fire -mb-px'
                : 'text-dim hover:text-ink bg-raised'
            }`}
          >
            {t === 'code' ? '[paste code]' : '[github pr]'}
          </button>
        ))}
        <div className="flex-1 bg-raised" aria-hidden="true" />
      </div>

      <div className="p-5 bg-canvas">
        {tab === 'code' ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="lang-select" className="text-xs text-dim">
                <span className="text-fire" aria-hidden="true">--</span>lang
              </label>
              <select
                id="lang-select"
                value={language}
                onChange={e => setLang(e.target.value)}
                className="bg-raised text-dim text-xs px-2 py-1 border border-line focus:outline-none focus:border-fire font-mono"
              >
                {LANGUAGE_OPTIONS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={PLACEHOLDER_CODE}
              rows={14}
              aria-label="Code to review"
              className="w-full bg-raised text-dim font-mono text-xs p-4 border border-line focus:outline-none focus:border-fire resize-none placeholder-ghost leading-relaxed"
            />
            <p className="text-xs text-ghost mt-2" aria-live="polite">
              <span className="text-fire opacity-60" aria-hidden="true">// </span>
              {code.length.toLocaleString()} chars — max 30,000
            </p>
          </>
        ) : (
          <div>
            <label htmlFor="pr-url" className="text-xs text-dim block mb-2">
              <span className="text-fire" aria-hidden="true">--</span>url{' '}
              <span className="text-ghost">(public repos only)</span>
            </label>
            <input
              id="pr-url"
              type="url"
              value={prUrl}
              onChange={e => handlePrUrlChange(e.target.value)}
              placeholder="https://github.com/owner/repo/pull/123"
              className="w-full bg-raised text-dim text-xs px-4 py-3 border border-line focus:outline-none focus:border-fire placeholder-ghost font-mono"
            />
            {prMeta && (
              <div className="mt-3 bg-raised px-4 py-3 border border-line" aria-live="polite">
                <p className="text-xs text-ghost">pr found:</p>
                <p className="text-sm text-ink font-medium mt-0.5">{prMeta.title}</p>
                <p className="text-xs text-ghost">@{prMeta.author}</p>
              </div>
            )}
            <p className="text-xs text-ghost mt-3">
              <span className="text-fire opacity-60" aria-hidden="true">// </span>
              works with any public github repo
            </p>
          </div>
        )}

        {/* Provider selector */}
        <fieldset className="mt-5">
          <legend className="text-xs text-dim mb-2.5">
            <span className="text-fire" aria-hidden="true">--</span>provider
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PROVIDER_LABELS) as Provider[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setProvider(p)}
                aria-pressed={provider === p}
                className={`flex items-center gap-2 px-3 py-2 border text-xs font-mono transition-colors ${
                  provider === p
                    ? 'border-fire bg-fire/10 text-fire'
                    : 'border-line bg-raised text-dim hover:border-trim hover:text-ink'
                }`}
              >
                <span aria-hidden="true">{PROVIDER_ICONS[p]}</span>
                <span className="truncate">{PROVIDER_LABELS[p]}</span>
                {provider === p && <span className="ml-auto text-fire/60" aria-hidden="true">✓</span>}
              </button>
            ))}
          </div>
        </fieldset>

        {error && (
          <div
            role="alert"
            className="mt-4 bg-reject/10 border border-reject/30 px-4 py-3"
          >
            <p className="text-xs text-reject">
              <span className="opacity-60" aria-hidden="true">[error] </span>{error}
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isSubmittable}
          className="mt-4 w-full bg-fire hover:bg-ember disabled:bg-raised disabled:text-ghost text-white font-mono py-3 transition-colors text-sm disabled:cursor-not-allowed"
        >
          {isSubmittable
            ? <><span className="opacity-70 mr-2" aria-hidden="true">$</span>roast my code</>
            : <span className="opacity-50">$ roast my code</span>
          }
        </button>
      </div>
    </div>
  );
}
