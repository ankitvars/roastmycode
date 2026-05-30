'use client';

import { useState, useRef } from 'react';
import type { ReviewResult } from '@/lib/types';

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

export default function ReviewForm({ onResult, onLoading }: ReviewFormProps) {
  const [tab, setTab]       = useState<Tab>('code');
  const [code, setCode]     = useState('');
  const [prUrl, setPrUrl]   = useState('');
  const [language, setLang] = useState('typescript');
  const [error, setError]   = useState('');
  const [prMeta, setPrMeta] = useState<{ title: string; author: string } | null>(null);
  const prDebounce          = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
        ? { type: 'code', code, language }
        : { type: 'github_pr', url: prUrl };

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
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex border-b border-gray-800">
        {(['code', 'github_pr'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-gray-800 text-white border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-300'
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
              <label className="text-xs text-gray-400 font-medium">Language</label>
              <select
                value={language}
                onChange={e => setLang(e.target.value)}
                className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 focus:outline-none"
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
              className="w-full bg-gray-950 text-gray-300 font-mono text-sm p-4 rounded-lg border border-gray-800 focus:outline-none focus:border-indigo-500 resize-none placeholder-gray-700"
            />
            <p className="text-xs text-gray-600 mt-2">{code.length} chars — max 30,000</p>
          </>
        ) : (
          <div>
            <label className="text-xs text-gray-400 font-medium block mb-2">
              GitHub PR URL (public repos only)
            </label>
            <input
              type="url"
              value={prUrl}
              onChange={e => handlePrUrlChange(e.target.value)}
              placeholder="https://github.com/owner/repo/pull/123"
              className="w-full bg-gray-950 text-gray-300 text-sm px-4 py-3 rounded-lg border border-gray-800 focus:outline-none focus:border-indigo-500 placeholder-gray-700"
            />
            {prMeta && (
              <div className="mt-3 bg-gray-800 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-400">PR found:</p>
                <p className="text-sm text-white font-medium mt-0.5">{prMeta.title}</p>
                <p className="text-xs text-gray-500">by @{prMeta.author}</p>
              </div>
            )}
            <p className="text-xs text-gray-600 mt-3">
              Works with any public GitHub repo. Private repos require a GitHub token.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-950 border border-red-800 rounded-lg px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isSubmittable}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-medium py-3 rounded-lg transition-colors text-sm"
        >
          🔥 Roast My Code
        </button>
      </div>
    </div>
  );
}
