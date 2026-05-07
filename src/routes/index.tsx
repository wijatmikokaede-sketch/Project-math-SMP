import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sigma, Shapes, LineChart, Calculator, Brain, Target, Zap, Trophy, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Art Of Math" },
      { name: "description", content: "Landing page proyek matematika SMP: All War Is Deception -Sun Tzu Art Of War." },
    ],
  }),
  component: Index,
});

const topics = [
  { icon: Sigma, title: "Aljabar", desc: "Persamaan, variabel, dan logika simbolis." },
  { icon: Shapes, title: "Geometri", desc: "Bangun datar, ruang, dan transformasi." },
  { icon: LineChart, title: "Statistika", desc: "Data, diagram, rata-rata & peluang." },
  { icon: Calculator, title: "Aritmatika", desc: "Bilangan bulat, pecahan, dan operasi." },
  { icon: Brain, title: "Logika", desc: "Pola, deret, dan penalaran kritis." },
  { icon: Target, title: "Soal HOTS", desc: "Tantangan berpikir tingkat tinggi." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero text-primary-foreground">∑</span>
            <span>MathQuest <span className="text-muted-foreground font-normal">SMP</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#galeri" className="hover:text-foreground transition">Galeri</a>
            <a href="#reflex" className="hover:text-foreground transition">Math Reflex</a>
            <a href="#tentang" className="hover:text-foreground transition">Tentang</a>
          </nav>
          <Button size="sm" className="bg-gradient-hero hover:opacity-90">Mulai</Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/60 to-background" />
        <div className="absolute -top-20 -right-20 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-40 -left-20 -z-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
              <Zap className="h-3 w-3 text-orange" /> Sebuah Project Random
            </span>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              Belajar Matematika <br />
              <span className="text-gradient">jadi seru lagi.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Gamble Your Intelligence And Have Fun :D.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 shadow-card group" asChild>
                <a href="#galeri">
                  Jelajahi Proyek
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#reflex">Coba Math Reflex</a>
              </Button>
            </div>

            <div className="mt-12 flex gap-8">
              {[["6+", "Topik"], ["100%", "Interaktif"], ["∞", "Latihan"]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold font-display">{n}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative math card */}
          <div className="relative animate-float">
            <div className="aspect-square rounded-3xl bg-gradient-hero shadow-card p-1">
              <div className="h-full w-full rounded-3xl bg-card flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                <div className="text-center">
                  <div className="text-8xl md:text-9xl font-display font-bold text-gradient">π</div>
                  <div className="mt-4 font-mono text-sm text-muted-foreground">a² + b² = c²</div>
                </div>
                <div className="absolute top-6 left-6 h-12 w-12 rounded-xl bg-orange/20 flex items-center justify-center text-orange font-bold">∑</div>
                <div className="absolute bottom-6 right-6 h-12 w-12 rounded-xl bg-accent/30 flex items-center justify-center text-accent-foreground font-bold">√</div>
                <div className="absolute top-6 right-6 h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold">∞</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERI */}
      <section id="galeri" className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-sm font-medium text-primary uppercase tracking-wider">Galeri Eksplorasi</div>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold">Pilih topik, mulai petualangan.</h2>
          <p className="mt-4 text-muted-foreground">Setiap kartu adalah pintu masuk ke dunia konsep matematika SMP. Klik dan jelajahi.</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map(({ icon: Icon, title, desc }, i) => (
            <Card
              key={title}
              className="group relative overflow-hidden border-border bg-card p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-card cursor-pointer"
            >
              {/* Image shell */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary to-muted overflow-hidden">
                <div className="absolute inset-0 opacity-30 transition-opacity group-hover:opacity-60" style={{ backgroundImage: "linear-gradient(45deg, transparent 48%, currentColor 48%, currentColor 52%, transparent 52%)", backgroundSize: "20px 20px", color: "var(--primary)" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground">0{i + 1}</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="h-16 w-16 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" strokeWidth={1.5} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold flex items-center justify-between">
                  {title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-1" />
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* MATH REFLEX */}
      <section id="reflex" className="relative bg-gradient-arena text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, oklch(0.85 0.22 140 / 0.3), transparent 40%), radial-gradient(circle at 75% 75%, oklch(0.55 0.22 255 / 0.4), transparent 40%)" }} />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon/40 bg-neon/10 text-neon text-xs font-mono uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" /> Live Arena
            </span>
            <h2 className="mt-6 text-4xl md:text-6xl font-bold">
              Tantangan <span style={{ color: "var(--neon)" }}>Refleks</span> Matematika
            </h2>
            <p className="mt-4 text-white/70">
              Aimlabs untuk otak. Jawab secepat mungkin, kunci akurasimu, kalahkan rekormu sendiri.
            </p>
          </div>

          <div className="mt-14 grid lg:grid-cols-[1fr_280px] gap-6">
            {/* Game canvas placeholder */}
            <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden min-h-[420px] flex flex-col">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 text-xs font-mono text-white/60">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neon" /> reflex_arena.exe</span>
                <span>READY</span>
              </div>
              <div className="flex-1 relative flex items-center justify-center">
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                {/* Floating targets */}
                <div className="absolute top-12 left-16 h-14 w-14 rounded-full bg-neon/20 border-2 border-neon flex items-center justify-center font-bold animate-float" style={{ color: "var(--neon)" }}>7</div>
                <div className="absolute bottom-16 right-20 h-12 w-12 rounded-full bg-orange/20 border-2 border-orange flex items-center justify-center font-bold animate-float" style={{ color: "var(--orange)", animationDelay: "1s" }}>×</div>
                <div className="absolute top-1/2 left-1/3 h-10 w-10 rounded-full bg-primary/30 border-2 border-primary-glow flex items-center justify-center text-sm font-bold animate-float" style={{ animationDelay: "0.5s" }}>√</div>

                <div className="text-center z-10">
                  <div className="font-display text-3xl font-bold">12 + 8 × 3 = ?</div>
                  <div className="mt-2 text-xs font-mono text-white/40">// game canvas — siap di-embed</div>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs font-mono text-white/50">mode: classic · time: 60s</div>
                <Button size="sm" className="bg-neon text-dark-arena hover:bg-neon/90 font-bold animate-pulse-glow">
                  <Play className="h-3 w-3 mr-1 fill-current" /> Mulai Latihan
                </Button>
              </div>
            </div>

            {/* Score dashboard */}
            <div className="space-y-4">
              {[
                { icon: Target, label: "Akurasi", value: "—", unit: "%", color: "var(--neon)" },
                { icon: Zap, label: "Kecepatan", value: "—", unit: "ms", color: "var(--orange)" },
                { icon: Trophy, label: "Skor Tertinggi", value: "—", unit: "pts", color: "var(--primary-glow)" },
              ].map(({ icon: Icon, label, value, unit, color }) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:border-white/20 transition">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/60">
                    <span>{label}</span>
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold" style={{ color }}>{value}</span>
                    <span className="text-xs text-white/40 font-mono">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="tentang" className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-hero text-primary-foreground text-xs font-bold">∑</span>
            <span className="font-display font-semibold text-foreground">MathQuest SMP</span>
          </div>
          <div>Dibuat oleh <span className="text-foreground font-medium">Siswa Kelas SMP</span> · © {new Date().getFullYear()}</div>
        </div>
      </footer>
    </div>
  );
}
