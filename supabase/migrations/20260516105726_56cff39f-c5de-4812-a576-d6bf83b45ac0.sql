
CREATE TABLE public.bgm_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bgm_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active bgm tracks"
  ON public.bgm_tracks FOR SELECT
  USING (is_active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert bgm tracks"
  ON public.bgm_tracks FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bgm tracks"
  ON public.bgm_tracks FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bgm tracks"
  ON public.bgm_tracks FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

INSERT INTO storage.buckets (id, name, public) VALUES ('bgm', 'bgm', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read bgm files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bgm');

CREATE POLICY "Admins can upload bgm files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'bgm' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bgm files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'bgm' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bgm files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'bgm' AND has_role(auth.uid(), 'admin'));
