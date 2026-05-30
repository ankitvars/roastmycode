const MAX_DIFF_CHARS = 24000; // ~6k tokens — safe for Gemini Flash

export interface PRMeta {
  owner:    string;
  repo:     string;
  prNumber: number;
}

export function parseGithubPRUrl(url: string): PRMeta | null {
  try {
    const normalised = url.startsWith('http') ? url : `https://${url}`;
    const { pathname } = new URL(normalised);
    const match = pathname.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2], prNumber: Number(match[3]) };
  } catch {
    return null;
  }
}

export function formatDiffForReview(
  diff:     string,
  repoName: string,
  prTitle:  string,
  prAuthor: string
): string {
  const truncated = diff.length > MAX_DIFF_CHARS
    ? diff.slice(0, MAX_DIFF_CHARS) + '\n\n[... diff truncated for length ...]'
    : diff;

  return `Repository: ${repoName}
PR Title: ${prTitle}
Author: ${prAuthor}

=== DIFF ===
${truncated}`;
}

export interface FetchedPR {
  title:              string;
  author:             string;
  body:               string;
  diff:               string;
  formattedForReview: string;
}

export async function fetchGithubPR(meta: PRMeta): Promise<FetchedPR> {
  const headers: Record<string, string> = {
    'Accept':     'application/vnd.github.v3+json',
    'User-Agent': 'RoastMyCode/1.0',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const [prRes, diffRes] = await Promise.all([
    fetch(
      `https://api.github.com/repos/${meta.owner}/${meta.repo}/pulls/${meta.prNumber}`,
      { headers }
    ),
    fetch(
      `https://api.github.com/repos/${meta.owner}/${meta.repo}/pulls/${meta.prNumber}`,
      { headers: { ...headers, Accept: 'application/vnd.github.v3.diff' } }
    ),
  ]);

  if (!prRes.ok) {
    if (prRes.status === 404) throw new Error('PR not found. Make sure the repo is public.');
    if (prRes.status === 403) throw new Error('GitHub rate limit hit. Try again in a minute.');
    throw new Error(`GitHub API error: ${prRes.status}`);
  }

  const pr = await prRes.json() as {
    title: string;
    user:  { login: string };
    body:  string | null;
  };
  const diff = await diffRes.text();

  return {
    title:  pr.title,
    author: pr.user.login,
    body:   pr.body ?? '',
    diff,
    formattedForReview: formatDiffForReview(diff, meta.repo, pr.title, pr.user.login),
  };
}
