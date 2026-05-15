import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Quote as QuoteIcon } from "lucide-react";
import { listQuotes } from "@/lib/quotes.functions";
import { SiteHeader } from "@/components/SiteHeader";
import { SubtleBackground } from "@/components/SubtleBackground";
import { haptics } from "@/lib/haptics";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/quotes")({
  head: () => ({
    meta: [
      { title: "Quote of the Day — Art Of Math" },
      { name: "description", content: "Kutipan harian terkurasi untuk inspirasi dan refleksi." },
      { property: "og:title", content: "Quote of the Day — Art Of Math" },
      { property: "og:description", content: "Kutipan harian terkurasi untuk inspirasi dan refleksi." },
    ],
  }),
  component: QuotesPage,
});

function QuotesPage() {
  const fetchQuotes = useServerFn(listQuotes);
  const { data, isLoading } = useQuery({
    queryKey: ["quotes", "public"],
    queryFn: () => fetchQuotes(),
  });

  const quotes = data?.quotes ?? [];
  const [index, setIndex] = useState(0);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const ordered = useMemo(() => {
    const todayIdx = quotes.findIndex((q: { published_date: string }) => q.published_date === today);
    if (todayIdx > 0) {
      return [quotes[todayIdx], ...quotes.slice(0, todayIdx), ...quotes.slice(todayIdx + 1)];
    }
    return quotes;
  }, [quotes, today]);

  const current = ordered[index];

  const next = () => {
    haptics.tap();
    setIndex((i) => Math.min(i + 1, ordered.length - 1));
  };
  const prev = () => {
    haptics.tap();
    setIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <div className="relative min-h-screen">
      <SubtleBackground variant="warm" />
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-12 md:py-20">
        <div className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <QuoteIcon className="h-3.5 w-3.5" />
          Quote of the Day
        </div>

        {isLoading ? (
          <div className="h-48 animate-pulse rounded-xl bg-muted/40" />
        ) : !current ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Belum ada kutipan. Tambahkan dari halaman admin.
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.article
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-2xl border border-border/50 bg-card/60 p-8 shadow-sm backdrop-blur md:p-12"
            >
              <p className="font-display text-2xl leading-snug text-foreground md:text-3xl">
                “{current.text}”
              </p>
              <div className="mt-6 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-foreground">
                    {current.author || "Anonim"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(current.published_date)}
                  </div>
                </div>
                {current.source_url ? (
                  <a
                    href={current.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={haptics.tap}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Sumber <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </div>
            </motion.article>
          </AnimatePresence>
        )}

        {ordered.length > 1 ? (
          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={prev} disabled={index === 0}>
              <ChevronLeft className="h-4 w-4" /> Sebelumnya
            </Button>
            <span className="text-xs text-muted-foreground">
              {index + 1} / {ordered.length}
            </span>
            <Button variant="ghost" size="sm" onClick={next} disabled={index >= ordered.length - 1}>
              Berikutnya <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}