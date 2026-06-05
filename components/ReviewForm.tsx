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
    <div className="bg-card border border-line rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-line" role="tablist">
        {(['code', 'github_pr'] as Tab[]).map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-raised text-ink border-b-2 border-fire'
                : 'text-dim hover:text-ink'
            }`}
          >
            {t === 'code' ? '📋 Paste Code' : '🔗 GitHub PR URL'}
          </button>
        ))}
      </div>

      <div className="p-5">
        {tab === 'code' ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="lang-select" className="text-xs text-dim font-medium">Language</label>
              <select
                id="lang-select"
                value={language}
                onChange={e => setLang(e.target.value)}
                className="bg-raised text-dim text-xs px-2 py-1 rounded border border-line focus:outline-none focus:border-fire"
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
              className="w-full bg-canvas text-dim font-mono text-sm p-4 rounded-lg border border-line focus:outline-none focus:border-fire resize-none placeholder-ghost"
            />
            <p className="text-xs text-ghost mt-2" aria-live="polite">
              {code.length.toLocaleString()} chars — max 30,000
            </p>
          </>
        ) : (
          <div>
            <label htmlFor="pr-url" className="text-xs text-dim font-medium block mb-2">
              GitHub PR URL (public repos only)
            </label>
            <input
              id="pr-url"
              type="url"
              value={prUrl}
              onChange={e => handlePrUrlChange(e.target.value)}
              placeholder="https://github.com/owner/repo/pull/123"
              className="w-full bg-canvas text-dim text-sm px-4 py-3 rounded-lg border border-line focus:outline-none focus:border-fire placeholder-ghost"
            />
            {prMeta && (
              <div className="mt-3 bg-raised rounded-lg px-4 py-3 border border-line" aria-live="polite">
                <p className="text-xs text-dim">PR found:</p>
                <p className="text-sm text-ink font-medium mt-0.5">{prMeta.title}</p>
                <p className="text-xs text-ghost">by @{prMeta.author}</p>
              </div>
            )}
            <p className="text-xs text-ghost mt-3">
              Works with any public GitHub repo. Private repos require a GitHub token.
            </p>
          </div>
        )}

        {/* Provider selector */}
        <fieldset className="mt-4">
          <legend className="text-xs text-dim font-medium mb-2">AI Provider</legend>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PROVIDER_LABELS) as Provider[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setProvider(p)}
                aria-pressed={provider === p}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                  provider === p
                    ? 'border-fire bg-fire/10 text-fire'
                    : 'border-line bg-raised text-dim hover:border-trim hover:text-ink'
                }`}
              >
                <span aria-hidden="true">{PROVIDER_ICONS[p]}</span>
                <span className="truncate">{PROVIDER_LABELS[p]}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {error && (
          <div
            role="alert"
            className="mt-4 bg-reject/10 border border-reject/30 rounded-lg px-4 py-3"
          >
            <p className="text-sm text-reject">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isSubmittable}
          className="mt-4 w-full bg-fire hover:bg-ember disabled:bg-raised disabled:text-ghost text-white font-medium py-3 rounded-lg transition-colors text-sm font-display"
        >
          🔥 Roast My Code
        </button>
      </div>
    </div>
  );
}
