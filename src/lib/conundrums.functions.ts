import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listConundrums = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("conundrums")
    .select("id, title, problem, solution, week_start_date")
    .order("week_start_date", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return { conundrums: data ?? [] };
});

const ConundrumInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  problem: z.string().min(1).max(10000),
  solution: z.string().min(1).max(10000),
  week_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const upsertConundrum = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => ConundrumInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload = {
      title: data.title,
      problem: data.problem,
      solution: data.solution,
      week_start_date: data.week_start_date,
    };
    if (data.id) {
      const { error } = await supabase.from("conundrums").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("conundrums").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteConundrum = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("conundrums").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });