
CREATE TABLE public.leaderboard (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL CHECK (char_length(username) BETWEEN 1 AND 50),
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leaderboard_score_desc ON public.leaderboard (score DESC);

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaderboard"
  ON public.leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert score"
  ON public.leaderboard FOR INSERT
  WITH CHECK (
    char_length(username) BETWEEN 1 AND 50
    AND score >= 0
    AND score <= 100000000
  );

CREATE POLICY "Admins can update leaderboard"
  ON public.leaderboard FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete leaderboard"
  ON public.leaderboard FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.leaderboard REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;
