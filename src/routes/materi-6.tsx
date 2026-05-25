import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Eye, EyeOff, ImageIcon } from "lucide-react";
import { listHotsQuestions } from "@/lib/hots.functions";
import { SiteHeader } from "@/components/SiteHeader";
import { SubtleBackground } from "@/components/SubtleBackground";
import { Button } from "@/components/ui/button";
import { haptics } from "@/lib/haptics";

export const Route = createFileRoute("/materi-6")({
  head: () => ({
    meta: [
      { title: "Portal HOTS — Art Of Math" },
      { name: "description", content: "Portal soal HOTS matematika SMP yang dikelola dari panel admin." },
      { property: "og:title", content: "Portal HOTS — Art Of Math" },
      { property: "og:description", content: "Portal soal HOTS matematika SMP yang dikelola dari panel admin." },
    ],
  }),
  component: HotsPortalPage,
});

type HotsQuestion = {
  id: string;
  title: string;
  problem: string | null;
  solution: string | null;
  image_url: string | null;
  solution_image_url: string | null;
  level: string | null;
  week_start_date: string;
};

function HotsPortalPage() {
  const fetchHotsQuestions = useServerFn(listHotsQuestions);
  const { data, isLoading } = useQuery({
    queryKey: ["hots-questions", "public"],
    queryFn: () => fetchHotsQuestions(),
  });

  const list: HotsQuestion[] = data?.hotsQuestions ?? [];
  const current = list[0];
  const archive = list.slice(1);

  return (
    <div className="relative min-h-screen">
      <SubtleBackground variant="warm" />
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <div className="mb-8 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <BrainCircuit className="h-3.5 w-3.5" />
          Portal HOTS
        </div>

        {isLoading ? (
          <div className="h-64 animate-pulse rounded-xl bg-muted/40" />
        ) : !current ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            Belum ada soal HOTS. Tambahkan dari halaman admin.
          </div>
        ) : (
          <HotsQuestionCard item={current} featured />
        )}

        {archive.length > 0 ? (
          <section className="mt-16">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Arsip HOTS
            </h2>
            <div className="space-y-4">
              {archive.map((item) => (
                <HotsQuestionCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function HotsQuestionCard({ item, featured }: { item: HotsQuestion; featured?: boolean }) {
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
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Minggu {formatDate(item.week_start_date)}</span>
        {item.level ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{item.level}</span> : null}
      </div>
      <h3 className={`font-display font-semibold text-foreground ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
        {item.title}
      </h3>

      {item.image_url ? (
        <div className="mt-5 overflow-hidden rounded-xl border border-border/40 bg-background/60">
          <img src={item.image_url} alt={`Gambar soal ${item.title}`} className="h-auto w-full object-contain" loading={featured ? "eager" : "lazy"} />
        </div>
      ) : null}

      {item.problem ? (
        <div className="mt-4 whitespace-pre-wrap text-foreground/90 leading-relaxed">
          {item.problem}
        </div>
      ) : !item.image_url ? (
        <div className="mt-5 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          <ImageIcon className="mx-auto mb-2 h-5 w-5" />
          Soal belum diisi.
        </div>
      ) : null}

      {(item.solution || item.solution_image_url) ? (
        <div className="mt-6">
          <Button onClick={toggle} variant={show ? "ghost" : "default"} size="sm">
            {show ? (
              <>
                <EyeOff className="h-4 w-4" /> Sembunyikan pembahasan
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Tampilkan pembahasan
              </>
            )}
          </Button>
        </div>
      ) : null}

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
            <div className="mt-4 rounded-lg border border-border/40 bg-background/60 p-4 text-sm leading-relaxed text-foreground/90">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Pembahasan
              </div>
              {item.solution_image_url ? (
                <img src={item.solution_image_url} alt={`Gambar pembahasan ${item.title}`} className="mb-4 h-auto w-full rounded-lg object-contain" loading="lazy" />
              ) : null}
              {item.solution ? <div className="whitespace-pre-wrap">{item.solution}</div> : null}
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
