import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MateriPage } from "@/components/MateriPage";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/materi-2")({
  head: () => ({
    meta: [
      { title: "Geometri — Art Of Math" },
      { name: "description", content: "Materi Geometri dengan polygon yang bisa kamu putar dan ubah." },
    ],
  }),
  component: GeometriPage,
});

const theme = {
  bgGradient:
    "radial-gradient(ellipse at top right, oklch(0.93 0.1 180 / 0.7), transparent 60%), linear-gradient(180deg, oklch(0.98 0.02 200), oklch(0.99 0 0))",
  accent: "oklch(0.55 0.18 200)",
  accentSoft: "oklch(0.55 0.18 200 / 0.25)",
  badge: "oklch(0.55 0.18 200 / 0.08)",
};

function GeometriPage() {
  const [sides, setSides] = useState(6);
  const [radius, setRadius] = useState(110);
  const [rotation, setRotation] = useState(0);

  const { points, area, perimeter, sideLen } = useMemo(() => {
    const pts: [number, number][] = [];
    const cx = 160;
    const cy = 160;
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2 - Math.PI / 2 + (rotation * Math.PI) / 180;
      pts.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius]);
    }
    const s = 2 * radius * Math.sin(Math.PI / sides);
    const a = 0.5 * sides * radius * radius * Math.sin((2 * Math.PI) / sides);
    return { points: pts, area: a, perimeter: s * sides, sideLen: s };
  }, [sides, radius, rotation]);

  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z";

  return (
    <MateriPage
      eyebrow="Materi 02"
      tagline="Geometri"
      title="Bentuk lahir dari aturan."
      description="Sebuah polygon hanyalah angka yang menari di sekitar pusat. Geser sliders dan lihat bagaimana satu rumus melahirkan banyak bentuk."
      images={["/Images/3.svg", "/Images/4.svg", "/Images/5.svg"]}
      theme={theme}
    >
      <Card className="p-8 md:p-10 border-2" style={{ borderColor: theme.accentSoft }}>
        <div className="grid md:grid-cols-[320px_1fr] gap-10 items-center">
          <svg viewBox="0 0 320 320" className="w-full max-w-[320px] mx-auto">
            <defs>
              <radialGradient id="poly-fill">
                <stop offset="0%" stopColor={theme.accent} stopOpacity="0.5" />
                <stop offset="100%" stopColor={theme.accent} stopOpacity="0.05" />
              </radialGradient>
            </defs>
            {/* grid */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`gv${i}`} x1={i * 40} y1="0" x2={i * 40} y2="320" stroke="currentColor" strokeOpacity="0.05" />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`gh${i}`} x1="0" y1={i * 40} x2="320" y2={i * 40} stroke="currentColor" strokeOpacity="0.05" />
            ))}
            <path d={d} fill="url(#poly-fill)" stroke={theme.accent} strokeWidth="2.5" strokeLinejoin="round" />
            {points.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill={theme.accent} />
            ))}
            <circle cx="160" cy="160" r="3" fill={theme.accent} />
          </svg>

          <div className="space-y-6">
            <Control label="Jumlah sisi" value={sides} suffix="" onChange={(v) => setSides(v)} min={3} max={20} />
            <Control label="Jari-jari" value={radius} suffix="px" onChange={(v) => setRadius(v)} min={40} max={150} />
            <Control label="Rotasi" value={rotation} suffix="°" onChange={(v) => setRotation(v)} min={0} max={360} />

            <div className="grid grid-cols-3 gap-3 pt-2">
              <Stat label="Keliling" value={perimeter.toFixed(1)} unit="px" accent={theme.accent} />
              <Stat label="Luas" value={area.toFixed(0)} unit="px²" accent={theme.accent} />
              <Stat label="Sisi" value={sideLen.toFixed(1)} unit="px" accent={theme.accent} />
            </div>
          </div>
        </div>
      </Card>
    </MateriPage>
  );
}

function Control({
  label, value, suffix, onChange, min, max,
}: { label: string; value: number; suffix: string; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-semibold">{value}{suffix}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={1} onValueChange={(v) => onChange(v[0])} />
    </div>
  );
}

function Stat({ label, value, unit, accent }: { label: string; value: string; unit: string; accent: string }) {
  return (
    <div className="rounded-lg border p-3 bg-background/50">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-xl font-bold" style={{ color: accent }}>
        {value}<span className="text-xs text-muted-foreground ml-1 font-mono">{unit}</span>
      </div>
    </div>
  );
}
