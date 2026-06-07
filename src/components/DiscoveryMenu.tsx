import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Compass,
  Sigma,
  Shapes,
  LineChart,
  Calculator,
  Brain,
  Target,
  Quote,
  Puzzle,
  Zap,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { haptics } from "@/lib/haptics";

const topics = [
  {
    icon: Sigma,
    title: "Aljabar",
    desc: "Persamaan & variabel",
    route: "/materi-1",
    color: "oklch(0.55 0.22 290)",
    bg: "oklch(0.55 0.22 290 / 0.08)",
  },
  {
    icon: Shapes,
    title: "Geometri",
    desc: "Bangun datar & ruang",
    route: "/materi-2",
    color: "oklch(0.55 0.18 200)",
    bg: "oklch(0.55 0.18 200 / 0.08)",
  },
  {
    icon: LineChart,
    title: "Statistika",
    desc: "Data & peluang",
    route: "/materi-3",
    color: "oklch(0.62 0.18 50)",
    bg: "oklch(0.62 0.18 50 / 0.08)",
  },
  {
    icon: Calculator,
    title: "Aritmatika",
    desc: "Bilangan & operasi",
    route: "/materi-4",
    color: "oklch(0.55 0.2 150)",
    bg: "oklch(0.55 0.2 150 / 0.08)",
  },
  {
    icon: Brain,
    title: "Logika",
    desc: "Pola & penalaran",
    route: "/materi-5",
    color: "oklch(0.5 0.18 260)",
    bg: "oklch(0.5 0.18 260 / 0.08)",
  },
  {
    icon: Target,
    title: "Soal HOTS",
    desc: "Tantangan berpikir tinggi",
    route: "/materi-6",
    color: "oklch(0.55 0.22 30)",
    bg: "oklch(0.55 0.22 30 / 0.08)",
  },
];

const quickLinks = [
  { icon: Quote, label: "Quotes", route: "/quotes" },
  { icon: Puzzle, label: "Conundrum", route: "/conundrum" },
];

export function DiscoveryMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          onClick={haptics.tap}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground shadow-lg transition-transform active:scale-95"
          aria-label="Menu discovery"
        >
          <Compass className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 overflow-hidden bg-background">
        <div className="h-full flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 text-left">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Compass className="h-5 w-5 text-primary" />
              Jelajahi
            </SheetTitle>
            <p className="text-sm text-muted-foreground">Pilih materi atau halaman lainnya</p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {/* Topic cards grid */}
            <div className="grid grid-cols-2 gap-3">
              {topics.map(({ icon: Icon, title, desc, route, color, bg }) => (
                <Link
                  key={route}
                  to={route}
                  onClick={() => {
                    haptics.tap();
                    setOpen(false);
                  }}
                  className="group relative rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-card active:scale-95"
                >
                  <div
                    className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: bg, color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold leading-tight">{title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
                  <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>

            {/* Quick links */}
            <div className="mt-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Lainnya
              </div>
              <div className="space-y-2">
                {quickLinks.map(({ icon: Icon, label, route }) => (
                  <Link
                    key={route}
                    to={route}
                    onClick={() => {
                      haptics.tap();
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {label}
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Home anchors (only useful if on home, but kept for discovery feel) */}
            <div className="mt-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Section
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Galeri", href: "/#galeri", icon: Zap },
                  { label: "Reflex", href: "/#reflex", icon: Target },
                  { label: "Leaderboard", href: "/#leaderboard", icon: Trophy },
                ].map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => {
                      haptics.tap();
                      setOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="h-3 w-3" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
