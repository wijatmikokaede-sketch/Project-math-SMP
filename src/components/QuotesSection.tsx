import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { haptic } from "@/lib/haptics";
import { Instagram, ChevronLeft, ChevronRight, Quote as QuoteIcon } from "lucide-react";

type Quote = {
  id: string;
  text: string;
  author: string | null;
  source_url: string | null;
  published_date: string;
};

export function QuotesSection() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("quotes")
      .select("*")
      .order("published_date", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setQuotes((data ?? []) as Quote[]);
        setLoading(false);
      });
  }, []);

  const current = quotes[index];
  const today = new Date().toISOString().slice(0, 10);
  const isToday = current?.published_date === today;

  const go = (dir: -1 | 1) => {
    haptic("tap");
    setIndex((i) => Math.max(0, Math.min(quotes.length - 1, i + dir)));
  };

  return (
    <section className="relative px-6 pb-20 pt-24 sm:pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em]"
             style={{ color: "var(--ink-faint)" }}>
          <span className="h-px w-8" style={{ background: "var(--accent)" }} />
          <span>Quote of the Day</span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: "var(--ink)" }}>
          {isToday ? "Hari ini" : "Terbaru"}
          {current && (
            <span className="ml-2 text-sm font-normal" style={{ color: "var(--ink-faint)" }}>
              · {new Date(current.published_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
        </h1>

        <div
          className="relative mt-10 overflow-hidden rounded-2xl border p-8 sm:p-12"
          style={{
            background: "var(--bg-panel)",
            borderColor: "var(--hairline)",
            backdropFilter: "blur(20px)",
          }}
        >
          <QuoteIcon
            className="absolute right-6 top-6 h-12 w-12 opacity-10"
            style={{ color: "var(--accent)" }}
            strokeWidth={1.2}
          />

          {loading ? (
            <div className="space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded" style={{ background: "var(--hairline)" }} />
              <div className="h-6 w-1/2 animate-pulse rounded" style={{ background: "var(--hairline)" }} />
            </div>
          ) : !current ? (
            <p className="text-center text-sm" style={{ color: "var(--ink-muted)" }}>
              Belum ada quote. Tambahkan dari halaman admin.
            </p>
          ) : (
            <>
              <blockquote
                className="text-balance text-2xl font-medium leading-snug sm:text-3xl"
                style={{ color: "var(--ink)" }}
              >
                &ldquo;{current.text}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm" style={{ color: "var(--ink-muted)" }}>
                  {current.author ? <>— {current.author}</> : <>— Anonim</>}
                </div>
                {current.source_url && (
                  <a
                    href={current.source_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => haptic("tap")}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition hover:opacity-80"
                    style={{ borderColor: "var(--hairline)", color: "var(--ink-muted)" }}
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    Sumber
                  </a>
                )}
              </div>
            </>
          )}
        </div>

        {quotes.length > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => go(-1)}
              disabled={index === 0}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition disabled:opacity-30"
              style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
              aria-label="Quote sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xs tabular-nums" style={{ color: "var(--ink-faint)" }}>
              {index + 1} / {quotes.length}
            </span>
            <button
              onClick={() => go(1)}
              disabled={index === quotes.length - 1}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition disabled:opacity-30"
              style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
              aria-label="Quote berikutnya"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}