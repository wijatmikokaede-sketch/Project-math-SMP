import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listActiveBgm = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("bgm_tracks")
    .select("id, title, audio_url, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(50);
  if (error) throw new Error(error.message);
  return { tracks: data ?? [] };
});

export const listAllBgm = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bgm_tracks")
      .select("id, title, audio_url, sort_order, is_active")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { tracks: data ?? [] };
  });

const TrackInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  audio_url: z.string().url().max(1000),
  sort_order: z.number().int().min(0).max(9999).default(0),
  is_active: z.boolean().default(true),
});

export const upsertBgm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => TrackInput.parse(input))
  .handler(async ({ data, context }) => {
    const payload = {
      title: data.title,
      audio_url: data.audio_url,
      sort_order: data.sort_order,
      is_active: data.is_active,
    };
    if (data.id) {
      const { error } = await context.supabase.from("bgm_tracks").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("bgm_tracks").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteBgm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("bgm_tracks").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
