-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read public reviews
CREATE POLICY "public_reviews_readable"
  ON reviews FOR SELECT
  USING (is_public = true);

-- Authenticated users can read their own private reviews
CREATE POLICY "own_reviews_readable"
  ON reviews FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone (including anon) can insert a review
-- user_id will be null for anonymous reviews
CREATE POLICY "anyone_can_review"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Only owner can update their review (e.g. toggle is_public)
CREATE POLICY "owner_can_update"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);
