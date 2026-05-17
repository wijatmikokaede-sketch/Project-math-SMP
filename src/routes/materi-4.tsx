import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MateriPage } from "@/components/MateriPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Zap } from "lucide-react";
import { haptics } from "@/lib/haptics";

export const Route = createFileRoute("/materi-4")({
  head: () => ({
    meta: [
      { title: "Aritmatika — Art Of Math" },
      { name: "description", content: "Materi Aritmatika: sprint 30 detik. Berapa soal bisa kamu jawab?" },
    ],
  }),
  component: AritPage,
});

const theme = {
  bgGradient:
    "radial-gradient(ellipse at bottom, oklch(0.93 0.1 140 / 0.65), transparent 60%), linear-gradient(180deg, oklch(0.98 0.02 140), oklch(0.99 0 0))",
  accent: "oklch(0.55 0.18 145)",
  accentSoft: "oklch(0.55 0.18 145 / 0.25)",
  badge: "oklch(0.55 0.18 145 / 0.08)",
};

type Q = { text: string; answer: number };

function makeQ(): Q {
  const ops = ["+", "−", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  if (op === "×") {
    const a = Math.floor(Math.random() * 11) + 2;
    const b = Math.floor(Math.random() * 11) + 2;
    return { text: `${a} × ${b}`, answer: a * b };
  }
  const a = Math.floor(Math.random() * 80) + 10;
  const b = Math.floor(Math.random() * 40) + 5;
  if (op === "+") return { text: `${a} + ${b}`, answer: a + b };
  return { text: `${a} − ${b}`, answer: a - b };
}

function AritPage() {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState<Q>(() => makeQ());
  const [val, setVal] = useState("");
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      haptics.success();
      return;
    }
    const id = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [running, time]);

  const start = () => {
    setRunning(true);
    setTime(30);
    setScore(0);
    setQ(makeQ());
    setVal("");
    haptics.tap();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const submit = () => {
    if (!running) return;
    const n = Number(val);
    if (n === q.answer) {
      setScore((s) => s + 1);
      setFlash("ok");
      haptics.tap();
    } else {
      setFlash("no");
      haptics.error();
    }
    setQ(makeQ());
    setVal("");
    setTimeout(() => setFlash(null), 200);
  };

  return (
    <MateriPage
      eyebrow="Materi 04"
      tagline="Aritmatika"
      title="Tiga puluh detik, satu pikiran."
      description="Aritmatika adalah otot. Latih dengan sprint singkat — jawab sebanyak mungkin sebelum waktu habis."
      images={["/Images/10.svg", "/Images/11.svg", "/Images/12.svg", "/Images/13.svg", "/Images/14.svg"]}
      theme={theme}
    >
      <Card
        className="p-8 md:p-10 border-2 transition-colors"
        style={{
          borderColor:
            flash === "ok" ? "oklch(0.65 0.2 145)" : flash === "no" ? "oklch(0.65 0.22 25)" : theme.accentSoft,
        }}
      >
        <div className="grid md:grid-cols-[1fr_240px] gap-8 items-center">
          <div className="text-center md:text-left">
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Soal</div>
            <div className="mt-2 font-display font-bold text-6xl md:text-7xl tabular-nums">
              {q.text} = ?
            </div>
            <div className="mt-6 flex gap-2 justify-center md:justify-start">
              <input
                ref={inputRef}
                type="number"
                value={val}
                disabled={!running}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder={running ? "jawaban" : "tekan Mulai"}
                className="px-4 py-3 rounded-lg border bg-background font-mono text-2xl w-48 disabled:opacity-50"
              />
              <Button
                onClick={running ? submit : start}
                style={{ background: theme.accent }}
                className="text-white text-base h-auto px-5"
              >
                {running ? "Jawab" : <><Zap className="h-4 w-4 mr-1" /> Mulai</>}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border p-5 bg-background/50">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                <span>Waktu</span>
                <Timer className="h-4 w-4" />
              </div>
              <div className="mt-2 font-display text-4xl font-bold tabular-nums" style={{ color: theme.accent }}>
                {time}s
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full transition-all duration-1000"
                  style={{ width: `${(time / 30) * 100}%`, background: theme.accent }}
                />
              </div>
            </div>
            <div className="rounded-xl border p-5 bg-background/50">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Skor</div>
              <div className="mt-2 font-display text-4xl font-bold tabular-nums" style={{ color: theme.accent }}>
                {score}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </MateriPage>
  );
}
