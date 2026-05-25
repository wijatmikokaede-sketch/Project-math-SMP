import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listLeaderboardEntries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("leaderboard")
      .select("id, username, score, created_at")
      .order("score", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { leaderboard: data ?? [] };
  });

export const resetLeaderboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase.from("leaderboard").delete().not("id", "is", null);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
