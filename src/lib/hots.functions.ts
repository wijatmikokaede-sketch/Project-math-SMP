import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listHotsQuestions = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("hots_questions")
    .select("id, title, problem, solution, image_url, solution_image_url, level, week_start_date")
    .order("week_start_date", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return { hotsQuestions: data ?? [] };
});

const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((value) => (value && value.length > 0 ? value : null));

const HotsQuestionInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  problem: z.string().max(10000).optional().default(""),
  solution: z.string().max(10000).optional().default(""),
  image_url: optionalUrl,
  solution_image_url: optionalUrl,
  level: z.string().min(1).max(80).default("HOTS"),
  week_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const upsertHotsQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => HotsQuestionInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload = {
      title: data.title,
      problem: data.problem,
      solution: data.solution,
      image_url: data.image_url,
      solution_image_url: data.solution_image_url,
      level: data.level,
      week_start_date: data.week_start_date,
    };
    if (data.id) {
      const { error } = await supabase.from("hots_questions").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("hots_questions").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteHotsQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("hots_questions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
