import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Eye, EyeOff } from "lucide-react";
import { listConundrums } from "@/lib/conundrums.functions";
import { SiteHeader } from "@/components/SiteHeader";
import { SubtleBackground } from "@/components/SubtleBackground";
import { haptics } from "@/lib/haptics";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/conundrum")({
  head: () => ({
    meta: [
      { title: "Weekly Conundrum — Art Of Math" },
      { name: "description", content: "Soal matematika elegan dan menantang setiap minggu." },
      { property: "og:title", content: "Weekly Conundrum — Art Of Math" },
      { property: "og:description", content: "Soal matematika elegan dan menantang setiap minggu." },
    ],
  }),
  component: ConundrumPage,
});

type Conundrum = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  week_start_date: string;
};

function ConundrumPage() {
  const fetchConundrums = useServerFn(listConundrums);
  const { data, isLoading } = useQuery({
    queryKey: ["conundrums", "public"],
    queryFn: () => fetchConundrums(),
  });

  const list: Conundrum[] = data?.conundrums ?? [];
  const current = list[0];
  const archive = list.slice(1);

  return (
    <div className="relative min-h-screen">
      <SubtleBackground variant="cool" />
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-12 md:py-20">
        <div className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Brain className="h-3.5 w-3.5" />
          Weekly Conundrum
        </div>

        {isLoading ? (
          <div className="h-64 animate-pulse rounded-xl bg-muted/40" />
        ) : !current ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Belum ada soal. Tambahkan dari halaman admin.
          </div>
        ) : (
          <ConundrumCard item={current} featured />
        )}

        {archive.length > 0 ? (
          <section className="mt-16">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Arsip
            </h2>
            <div className="space-y-4">
              {archive.map((item) => (
                <ConundrumCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function ConundrumCard({ item, featured }: { item: Conundrum; featured?: boolean }) {
  const [show, setShow] = useState(false);
  const toggle = () => {
    haptics.reveal();
    setShow((s) => !s);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl border border-border/50 bg-card/60 backdrop-blur ${
        featured ? "p-8 shadow-sm md:p-10" : "p-5"
      }`}
    >
      <div className="mb-2 text-xs text-muted-foreground">
        Minggu {formatDate(item.week_start_date)}
      </div>
      <h3 className={`font-display font-semibold text-foreground ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
        {item.title}
      </h3>
      <div className="mt-4 whitespace-pre-wrap text-foreground/90 leading-relaxed">
        {item.problem}
      </div>

      <div className="mt-6">
        <Button onClick={toggle} variant={show ? "ghost" : "default"} size="sm">
          {show ? (
            <>
              <EyeOff className="h-4 w-4" /> Sembunyikan jawaban
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" /> Tampilkan jawaban
            </>
          )}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {show ? (
          <motion.div
            key="solution"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-lg border border-border/40 bg-background/60 p-4 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Jawaban
              </div>
              {item.solution}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
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