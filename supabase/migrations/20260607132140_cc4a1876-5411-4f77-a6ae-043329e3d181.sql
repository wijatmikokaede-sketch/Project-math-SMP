CREATE TABLE public.hots_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  problem text NOT NULL DEFAULT '',
  solution text NOT NULL DEFAULT '',
  image_url text,
  solution_image_url text,
  level text NOT NULL DEFAULT 'HOTS',
  week_start_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hots_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hots_questions TO authenticated;
GRANT ALL ON public.hots_questions TO service_role;

ALTER TABLE public.hots_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hots questions"
  ON public.hots_questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert hots questions"
  ON public.hots_questions FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update hots questions"
  ON public.hots_questions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hots questions"
  ON public.hots_questions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_hots_questions_updated_at
  BEFORE UPDATE ON public.hots_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();