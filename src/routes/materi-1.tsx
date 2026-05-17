import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MateriPage } from "@/components/MateriPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, RefreshCw } from "lucide-react";
import { haptics } from "@/lib/haptics";

export const Route = createFileRoute("/materi-1")({
  head: () => ({
    meta: [
      { title: "Aljabar — Art Of Math" },
      { name: "description", content: "Materi Aljabar dengan timbangan persamaan interaktif." },
    ],
  }),
  component: AljabarPage,
});

// theme: violet/indigo — abstract symbolic
const theme = {
  bgGradient:
    "radial-gradient(ellipse at top, oklch(0.95 0.06 290 / 0.9), transparent 60%), linear-gradient(180deg, oklch(0.98 0.01 290), oklch(0.99 0 0))",
  accent: "oklch(0.55 0.22 290)",
  accentSoft: "oklch(0.55 0.22 290 / 0.25)",
  badge: "oklch(0.55 0.22 290 / 0.08)",
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function AljabarPage() {
  // Equation: a*x + b = c  →  x = (c - b) / a
  const [seed, setSeed] = useState(0);
  const { a, b, c, answer } = useMemo(() => {
    void seed;
    const x = rand(-6, 9);
    const a = rand(2, 7);
    const b = rand(-9, 9);
    const c = a * x + b;
    return { a, b, c, answer: x };
  }, [seed]);

  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "no">("idle");

  const check = () => {
    const n = Number(guess);
    if (Number.isFinite(n) && n === answer) {
      setStatus("ok");
      haptics.success();
    } else {
      setStatus("no");
      haptics.error();
    }
  };
  const reroll = () => {
    setSeed((s) => s + 1);
    setGuess("");
    setStatus("idle");
    haptics.tap();
  };

  // visual balance: left pan weight = a*x + b (signed), right = c
  const tilt = status === "ok" ? 0 : Math.max(-12, Math.min(12, (Number(guess || 0) * a + b - c) / 4));

  return (
    <MateriPage
      eyebrow="Materi 01"
      tagline="Aljabar"
      title="Seimbangkan persamaan."
      description="Aljabar adalah seni menjaga keseimbangan. Apa yang kamu lakukan di satu sisi, harus kamu lakukan di sisi yang lain. Coba tebak nilai x untuk menyeimbangkan timbangan."
      images={["/Images/8.svg", "/Images/9.svg"]}
      theme={theme}
    >
      <Card className="p-8 md:p-10 border-2" style={{ borderColor: theme.accentSoft }}>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* balance scale */}
          <div className="relative h-64 flex flex-col items-center">
            <div
              className="relative w-full transition-transform duration-500"
              style={{ transform: `rotate(${tilt}deg)`, transformOrigin: "center bottom" }}
            >
              <div className="h-1 w-full rounded-full" style={{ background: theme.accent }} />
              <div className="absolute left-0 -top-16 w-24 h-16 -translate-x-1/2 rounded-b-full border-2 flex items-center justify-center font-mono text-sm" style={{ borderColor: theme.accent, background: "white" }}>
                {a}x{b >= 0 ? `+${b}` : b}
              </div>
              <div className="absolute right-0 -top-16 w-24 h-16 translate-x-1/2 rounded-b-full border-2 flex items-center justify-center font-mono text-sm" style={{ borderColor: theme.accent, background: "white" }}>
                {c}
              </div>
            </div>
            <div className="mt-2 w-2 h-20" style={{ background: theme.accent }} />
            <div className="w-32 h-2 rounded" style={{ background: theme.accent }} />
          </div>

          {/* input */}
          <div>
            <div className="font-mono text-2xl md:text-3xl mb-4">
              {a}x {b >= 0 ? "+" : "−"} {Math.abs(b)} = {c}
            </div>
            <label className="text-sm text-muted-foreground">x = ?</label>
            <div className="mt-2 flex gap-2">
              <Input
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value);
                  setStatus("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && check()}
                placeholder="ketik jawabanmu"
                className="text-lg font-mono"
              />
              <Button onClick={check} style={{ background: theme.accent }} className="text-white">
                <Sparkles className="h-4 w-4 mr-1" /> Cek
              </Button>
              <Button onClick={reroll} variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 min-h-[24px] text-sm font-medium">
              {status === "ok" && <span className="text-emerald-600">Seimbang. x = {answer}</span>}
              {status === "no" && <span className="text-rose-600">Belum seimbang — coba lagi.</span>}
            </div>
          </div>
        </div>
      </Card>
    </MateriPage>
  );
}
