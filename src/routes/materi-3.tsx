import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MateriPage } from "@/components/MateriPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, Shuffle } from "lucide-react";
import { haptics } from "@/lib/haptics";

export const Route = createFileRoute("/materi-3")({
  head: () => ({
    meta: [
      { title: "Statistika — Art Of Math" },
      { name: "description", content: "Materi Statistika: bangun datasetmu, lihat rata-rata, median, modus secara langsung." },
    ],
  }),
  component: StatPage,
});

const theme = {
  bgGradient:
    "radial-gradient(ellipse at top left, oklch(0.95 0.08 60 / 0.7), transparent 60%), linear-gradient(180deg, oklch(0.99 0.02 60), oklch(0.99 0 0))",
  accent: "oklch(0.62 0.18 50)",
  accentSoft: "oklch(0.62 0.18 50 / 0.25)",
  badge: "oklch(0.62 0.18 50 / 0.08)",
};

function StatPage() {
  const [data, setData] = useState<number[]>([3, 5, 5, 7, 9, 12, 4, 8]);
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    if (data.length === 0) return { mean: 0, median: 0, mode: [] as number[], min: 0, max: 0 };
    const sorted = [...data].sort((a, b) => a - b);
    const sum = sorted.reduce((s, n) => s + n, 0);
    const mean = sum / sorted.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const freq = new Map<number, number>();
    sorted.forEach((n) => freq.set(n, (freq.get(n) || 0) + 1));
    const maxF = Math.max(...freq.values());
    const mode = [...freq.entries()].filter(([, f]) => f === maxF && f > 1).map(([n]) => n);
    return { mean, median, mode, min: sorted[0], max: sorted.at(-1)! };
  }, [data]);

  const add = () => {
    const n = Number(input);
    if (Number.isFinite(n) && data.length < 24) {
      setData((d) => [...d, n]);
      setInput("");
      haptics.tap();
    }
  };
  const removeAt = (i: number) => {
    setData((d) => d.filter((_, j) => j !== i));
    haptics.soft();
  };
  const shuffle = () => {
    setData(Array.from({ length: 8 }, () => Math.floor(Math.random() * 18) + 1));
    haptics.tap();
  };

  const maxVal = Math.max(...data, 1);

  return (
    <MateriPage
      eyebrow="Materi 03"
      tagline="Statistika"
      title="Angka mempunyai cerita."
      description="Tambahkan data, hapus, atau acak. Lihat bagaimana rata-rata, median, dan modus bergerak mengikuti tiap perubahan kecil."
      images={["/Images/6.svg", "/Images/7.svg"]}
      theme={theme}
    >
      <Card className="p-8 md:p-10 border-2" style={{ borderColor: theme.accentSoft }}>
        {/* chart */}
        <div className="h-56 flex items-end gap-2 border-b pb-2" style={{ borderColor: theme.accentSoft }}>
          {data.map((v, i) => (
            <div key={i} className="flex-1 group relative flex flex-col items-center justify-end">
              <div
                className="w-full rounded-t-md transition-all duration-300 cursor-pointer relative"
                style={{
                  height: `${(v / maxVal) * 100}%`,
                  background: `linear-gradient(180deg, ${theme.accent}, oklch(0.62 0.18 50 / 0.5))`,
                }}
                onClick={() => removeAt(i)}
                title="Klik untuk hapus"
              >
                <X className="opacity-0 group-hover:opacity-100 absolute inset-0 m-auto h-4 w-4 text-white transition" />
              </div>
              <span className="mt-1 text-[10px] font-mono text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>

        {/* input */}
        <div className="mt-6 flex gap-2 flex-wrap">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Tambah angka"
            className="px-3 py-2 rounded-md border bg-background flex-1 min-w-[160px] font-mono"
          />
          <Button onClick={add} style={{ background: theme.accent }} className="text-white">
            <Plus className="h-4 w-4 mr-1" /> Tambah
          </Button>
          <Button variant="outline" onClick={shuffle}>
            <Shuffle className="h-4 w-4 mr-1" /> Acak
          </Button>
        </div>

        {/* stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
          <Stat label="Rata-rata" v={stats.mean.toFixed(2)} a={theme.accent} />
          <Stat label="Median" v={stats.median.toFixed(1)} a={theme.accent} />
          <Stat label="Modus" v={stats.mode.length ? stats.mode.join(", ") : "—"} a={theme.accent} />
          <Stat label="Min" v={String(stats.min)} a={theme.accent} />
          <Stat label="Max" v={String(stats.max)} a={theme.accent} />
        </div>
      </Card>
    </MateriPage>
  );
}

function Stat({ label, v, a }: { label: string; v: string; a: string }) {
  return (
    <div className="rounded-lg border p-3 bg-background/50">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-bold tabular-nums" style={{ color: a }}>{v}</div>
    </div>
  );
}
