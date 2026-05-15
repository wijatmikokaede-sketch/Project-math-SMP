import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listQuotes = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("quotes")
    .select("id, text, author, source_url, published_date")
    .order("published_date", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return { quotes: data ?? [] };
});

const QuoteInput = z.object({
  id: z.string().uuid().optional(),
  text: z.string().min(1).max(2000),
  author: z.string().max(255).optional().nullable(),
  source_url: z.string().url().max(500).optional().nullable(),
  published_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const upsertQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => QuoteInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const payload = {
      text: data.text,
      author: data.author || null,
      source_url: data.source_url || null,
      published_date: data.published_date,
    };
    if (data.id) {
      const { error } = await supabase.from("quotes").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("quotes").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("quotes").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });