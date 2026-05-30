-- Reviews table: one row per AI review
CREATE TABLE IF NOT EXISTS reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Input
  input_type      TEXT NOT NULL CHECK (input_type IN ('code', 'github_pr')),
  raw_input       TEXT NOT NULL,              -- pasted code or PR URL
  language        TEXT,                       -- detected: typescript, python, etc.
  pr_title        TEXT,                       -- if github_pr
  pr_author       TEXT,                       -- if github_pr

  -- AI Output
  verdict         TEXT NOT NULL CHECK (verdict IN ('MERGE', 'REQUEST_CHANGES', 'REJECT')),
  summary         TEXT NOT NULL,              -- 2-3 sentence overall take
  roast_line      TEXT NOT NULL,              -- one brutal one-liner (the viral hook)
  findings        JSONB NOT NULL DEFAULT '[]',-- array of Finding objects
  praise          JSONB NOT NULL DEFAULT '[]',-- array of strings — what's good

  -- Scores (0-100)
  score_security  INTEGER NOT NULL DEFAULT 0,
  score_perf      INTEGER NOT NULL DEFAULT 0,
  score_a11y      INTEGER NOT NULL DEFAULT 0,
  score_quality   INTEGER NOT NULL DEFAULT 0,
  score_overall   INTEGER NOT NULL DEFAULT 0,

  -- Meta
  is_public       BOOLEAN NOT NULL DEFAULT true,
  view_count      INTEGER NOT NULL DEFAULT 0,
  share_count     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id
  ON reviews(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_public
  ON reviews(is_public, created_at DESC)
  WHERE is_public = true;
