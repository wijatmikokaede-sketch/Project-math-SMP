import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MateriPage } from "@/components/MateriPage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, CheckCircle2, Flame, Lightbulb, RefreshCw, Target, Trophy } from "lucide-react";
import { haptics } from "@/lib/haptics";

export const Route = createFileRoute("/materi-6")({
  head: () => ({
    meta: [
      { title: "Portal HOTS — Art Of Math" },
      { name: "description", content: "Portal soal HOTS matematika SMP: analisis, strategi, dan tantangan berpikir tingkat tinggi." },
    ],
  }),
  component: HotsPortalPage,
});

const theme = {
  bgGradient:
    "radial-gradient(ellipse at top, oklch(0.93 0.07 65 / 0.75), transparent 58%), radial-gradient(ellipse at bottom right, oklch(0.88 0.09 255 / 0.45), transparent 55%), linear-gradient(180deg, oklch(0.985 0.015 75), oklch(0.99 0 0))",
  accent: "oklch(0.62 0.2 65)",
  accentSoft: "oklch(0.62 0.2 65 / 0.24)",
  badge: "oklch(0.62 0.2 65 / 0.1)",
};

type Mission = {
  title: string;
  level: "Starter" | "Strategist" | "Boss Fight";
  prompt: string;
  choices: string[];
  answer: number;
  reasoning: string;
};

const missions: Mission[] = [
  {
    title: "Diskon Berlapis",
    level: "Starter",
    prompt:
      "Sebuah jaket harga Rp200.000 mendapat diskon 20%, lalu mendapat diskon tambahan 10% dari harga setelah diskon pertama. Berapa harga akhirnya?",
    choices: ["Rp140.000", "Rp144.000", "Rp150.000", "Rp160.000"],
    answer: 1,
    reasoning:
      "Diskon kedua tidak dihitung dari harga awal. Setelah diskon 20%, harga menjadi Rp160.000. Lalu diskon 10% dari Rp160.000 adalah Rp16.000, sehingga harga akhir Rp144.000.",
  },
  {
    title: "Pola Bertingkat",
    level: "Strategist",
    prompt:
      "Barisan 3, 7, 13, 21, 31, ... memiliki selisih 4, 6, 8, 10, ... Berapa suku berikutnya?",
    choices: ["39", "41", "43", "45"],
    answer: 2,
    reasoning:
      "Selisihnya naik 2 setiap langkah. Setelah +10, selisih berikutnya +12. Jadi 31 + 12 = 43.",
  },
  {
    title: "Luas Tersisa",
    level: "Boss Fight",
    prompt:
      "Sebuah persegi panjang 18 cm × 12 cm dipotong persegi 6 cm × 6 cm di salah satu sudutnya. Berapa luas bangun yang tersisa?",
    choices: ["144 cm²", "162 cm²", "180 cm²", "216 cm²"],
    answer: 2,
    reasoning:
      "Luas awal 18 × 12 = 216 cm². Luas yang dipotong 6 × 6 = 36 cm². Luas tersisa 216 − 36 = 180 cm².",
  },
];

const strategyCards = [
  { icon: Target, title: "Pahami konteks", text: "Ubah cerita menjadi data penting: apa yang diketahui, apa yang ditanya, dan informasi mana yang jebakan." },
  { icon: Lightbulb, title: "Buat model", text: "Gunakan tabel, gambar, persamaan, atau pola. HOTS bukan hafalan rumus, tapi cara menyusun strategi." },
  { icon: Trophy, title: "Cek balik", text: "Setelah mendapat jawaban, uji apakah masuk akal dengan satuan, estimasi, dan kondisi soal." },
];

function HotsPortalPage() {
  const [seed, setSeed] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);

  const mission = useMemo(() => missions[seed % missions.length], [seed]);
  const isCorrect = selected === mission.answer;

  const choose = (idx: number) => {
    setSelected(idx);
    setShowReasoning(true);
    if (idx === mission.answer) haptics.success();
    else haptics.error();
  };

  const nextMission = () => {
    setSeed((s) => s + 1);
    setSelected(null);
    setShowReasoning(false);
    haptics.tap();
  };

  return (
    <MateriPage
      eyebrow="Portal HOTS"
      tagline="Higher Order Thinking Skills"
      title="Naik level: dari menghitung ke menaklukkan strategi."
      description="Portal HOTS adalah arena latihan untuk soal yang butuh analisis, evaluasi, dan kreativitas. Bukan sekadar cepat menjawab, tapi tajam membaca pola dan jebakan."
      images={["/Images/8.svg", "/Images/9.svg"]}
      theme={theme}
    >
      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
        <Card className="p-6 md:p-8 border-2 overflow-hidden relative" style={{ borderColor: theme.accentSoft }}>
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-40" style={{ background: theme.accent }} />
          <div className="relative">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border" style={{ color: theme.accent, borderColor: theme.accentSoft, background: theme.badge }}>
              <Flame className="h-3.5 w-3.5" /> HOTS Map
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl font-display font-bold">3 mode berpikir</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Gunakan urutan ini saat menghadapi soal cerita, pola, perbandingan, geometri, dan data.
            </p>

            <div className="mt-7 space-y-4">
              {strategyCards.map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="flex gap-4 rounded-2xl bg-white/70 border p-4 backdrop-blur" style={{ borderColor: theme.accentSoft }}>
                  <div className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center font-bold" style={{ background: theme.badge, color: theme.accent }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">STEP 0{i + 1}</div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 md:p-8 border-2" style={{ borderColor: theme.accentSoft }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest" style={{ color: theme.accent }}>
                <BrainCircuit className="h-4 w-4" /> Mission: {mission.level}
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-display font-bold">{mission.title}</h2>
            </div>
            <Button onClick={nextMission} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" /> Ganti
            </Button>
          </div>

          <div className="mt-6 rounded-2xl p-5 text-base md:text-lg font-medium leading-relaxed" style={{ background: theme.badge }}>
            {mission.prompt}
          </div>

          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            {mission.choices.map((choice, idx) => {
              const answered = selected !== null;
              const correctChoice = idx === mission.answer;
              const activeWrong = selected === idx && !correctChoice;
              return (
                <button
                  key={choice}
                  onClick={() => choose(idx)}
                  className="text-left rounded-xl border p-4 transition-all hover:-translate-y-1 hover:shadow-md disabled:cursor-default"
                  style={{
                    borderColor: answered && correctChoice ? "oklch(0.65 0.18 145)" : activeWrong ? "oklch(0.58 0.22 25)" : theme.accentSoft,
                    background: answered && correctChoice ? "oklch(0.96 0.06 145)" : activeWrong ? "oklch(0.96 0.05 25)" : "white",
                  }}
                >
                  <div className="text-xs font-mono text-muted-foreground">Pilihan {String.fromCharCode(65 + idx)}</div>
                  <div className="mt-1 font-bold">{choice}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 min-h-[96px]">
            {showReasoning && (
              <div className="rounded-2xl border p-4" style={{ borderColor: theme.accentSoft, background: "rgba(255,255,255,0.72)" }}>
                <div className="flex items-center gap-2 font-bold" style={{ color: isCorrect ? "oklch(0.55 0.18 145)" : "oklch(0.58 0.22 25)" }}>
                  <CheckCircle2 className="h-4 w-4" /> {isCorrect ? "Critical hit!" : "Belum tepat, tapi strateginya bisa diperbaiki."}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{mission.reasoning}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </MateriPage>
  );
}
