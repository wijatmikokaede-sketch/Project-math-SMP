import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MateriPage } from "@/components/MateriPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, RefreshCw, Eye } from "lucide-react";
import { haptics } from "@/lib/haptics";

export const Route = createFileRoute("/materi-5")({
  head: () => ({
    meta: [
      { title: "Logika — Art Of Math" },
      { name: "description", content: "Materi Logika: tebak angka berikutnya dari pola tersembunyi." },
    ],
  }),
  component: LogikaPage,
});

const theme = {
  bgGradient:
    "radial-gradient(ellipse at top, oklch(0.93 0.06 15 / 0.65), transparent 60%), linear-gradient(180deg, oklch(0.98 0.02 15), oklch(0.99 0 0))",
  accent: "oklch(0.55 0.22 15)",
  accentSoft: "oklch(0.55 0.22 15 / 0.25)",
  badge: "oklch(0.55 0.22 15 / 0.08)",
};

type Puzzle = { seq: number[]; next: number; hint: string };

function makePuzzle(): Puzzle {
  const kind = Math.floor(Math.random() * 5);
  switch (kind) {
    case 0: {
      // arithmetic
      const a = Math.floor(Math.random() * 9) + 1;
      const d = Math.floor(Math.random() * 6) + 2;
      const seq = Array.from({ length: 5 }, (_, i) => a + i * d);
      return { seq, next: a + 5 * d, hint: `Beda tetap +${d}` };
    }
    case 1: {
      // geometric
      const a = Math.floor(Math.random() * 4) + 1;
      const r = Math.floor(Math.random() * 2) + 2;
      const seq = Array.from({ length: 5 }, (_, i) => a * r ** i);
      return { seq, next: a * r ** 5, hint: `Rasio ×${r}` };
    }
    case 2: {
      // squares
      const s = Math.floor(Math.random() * 3) + 1;
      const seq = Array.from({ length: 5 }, (_, i) => (i + s) ** 2);
      return { seq, next: (5 + s) ** 2, hint: `Pangkat dua dari bilangan berurutan` };
    }
    case 3: {
      // fibonacci-like
      const a = Math.floor(Math.random() * 3) + 1;
      const b = Math.floor(Math.random() * 4) + 2;
      const seq = [a, b];
      while (seq.length < 5) seq.push(seq.at(-1)! + seq.at(-2)!);
      return { seq, next: seq.at(-1)! + seq.at(-2)!, hint: `Suku = jumlah dua suku sebelumnya` };
    }
    default: {
      // alternating add/subtract
      const a = Math.floor(Math.random() * 10) + 5;
      const d = Math.floor(Math.random() * 5) + 2;
      const seq = [a];
      for (let i = 1; i < 5; i++) seq.push(seq[i - 1] + (i % 2 === 1 ? d : -1));
      return { seq, next: seq.at(-1)! + (5 % 2 === 1 ? d : -1), hint: `Bergantian +${d} dan −1` };
    }
  }
}

function LogikaPage() {
  const [seed, setSeed] = useState(0);
  const puzzle = useMemo<Puzzle>(() => { void seed; return makePuzzle(); }, [seed]);
  const [val, setVal] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "no">("idle");
  const [revealed, setRevealed] = useState(false);

  const check = () => {
    if (Number(val) === puzzle.next) {
      setStatus("ok");
      haptics.success();
    } else {
      setStatus("no");
      haptics.error();
    }
  };
  const reroll = () => {
    setSeed((s) => s + 1);
    setVal("");
    setStatus("idle");
    setRevealed(false);
    haptics.tap();
  };

  return (
    <MateriPage
      eyebrow="Materi 05"
      tagline="Logika"
      title="Pola adalah bahasa rahasia."
      description="Setiap deret menyembunyikan satu aturan. Temukan aturan itu, dan kamu menemukan jawabannya."
      images={["/Images/15.svg", "/Images/16.svg", "/Images/17.svg"]}
      theme={theme}
    >
      <Card className="p-8 md:p-10 border-2" style={{ borderColor: theme.accentSoft }}>
        <div className="text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
            Tebak suku berikutnya
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            {puzzle.seq.map((n, i) => (
              <div
                key={i}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 flex items-center justify-center font-display text-2xl md:text-3xl font-bold bg-background"
                style={{ borderColor: theme.accentSoft, color: theme.accent }}
              >
                {n}
              </div>
            ))}
            <div className="font-display text-3xl text-muted-foreground">→</div>
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-dashed flex items-center justify-center font-display text-2xl md:text-3xl font-bold"
              style={{
                borderColor: status === "ok" ? "oklch(0.65 0.2 145)" : status === "no" ? "oklch(0.65 0.22 25)" : theme.accent,
                background:
                  status === "ok"
                    ? "oklch(0.95 0.1 145 / 0.4)"
                    : status === "no"
                    ? "oklch(0.95 0.1 25 / 0.4)"
                    : "transparent",
                color: theme.accent,
              }}
            >
              {status === "ok" || revealed ? puzzle.next : "?"}
            </div>
          </div>

          <div className="mt-8 flex gap-2 justify-center flex-wrap">
            <input
              type="number"
              value={val}
              onChange={(e) => {
                setVal(e.target.value);
                setStatus("idle");
              }}
              onKeyDown={(e) => e.key === "Enter" && check()}
              placeholder="jawabanmu"
              className="px-4 py-3 rounded-lg border bg-background font-mono text-xl w-44 text-center"
            />
            <Button onClick={check} style={{ background: theme.accent }} className="text-white">
              <Brain className="h-4 w-4 mr-1" /> Cek
            </Button>
            <Button variant="outline" onClick={() => { setRevealed(true); haptics.reveal(); }}>
              <Eye className="h-4 w-4 mr-1" /> Petunjuk
            </Button>
            <Button variant="outline" onClick={reroll}>
              <RefreshCw className="h-4 w-4 mr-1" /> Pola baru
            </Button>
          </div>

          <div className="mt-4 min-h-[24px] text-sm">
            {status === "ok" && <span className="text-emerald-600 font-medium">Tepat. Kamu menemukan pola.</span>}
            {status === "no" && <span className="text-rose-600 font-medium">Belum benar — perhatikan lagi.</span>}
            {revealed && status !== "ok" && (
              <span className="text-muted-foreground italic">Petunjuk: {puzzle.hint}</span>
            )}
          </div>
        </div>
      </Card>
    </MateriPage>
  );
}
