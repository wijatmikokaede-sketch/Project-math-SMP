import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { haptics } from "@/lib/haptics";

export type MateriTheme = {
  /** background gradient css */
  bgGradient: string;
  /** accent color (CSS color string) */
  accent: string;
  accentSoft: string;
  badge: string;
};

interface MateriPageProps {
  eyebrow: string;
  title: string;
  tagline: string;
  description: string;
  images: string[];
  theme: MateriTheme;
  children: React.ReactNode;
}

export function MateriPage({
  eyebrow,
  title,
  tagline,
  description,
  images,
  theme,
  children,
}: MateriPageProps) {
  const [idx, setIdx] = useState(0);
  const next = () => {
    haptics.tap();
    setIdx((i) => (i + 1) % images.length);
  };
  const prev = () => {
    haptics.tap();
    setIdx((i) => (i - 1 + images.length) % images.length);
  };

  return (
    <div
      className="min-h-screen text-foreground"
      style={{ background: theme.bgGradient }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" onClick={haptics.tap}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Beranda
            </Link>
          </Button>
          <span
            className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border"
            style={{
              color: theme.accent,
              borderColor: theme.accentSoft,
              background: theme.badge,
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* hero */}
        <div className="mt-10 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div className="animate-fade-up">
            <p
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: theme.accent }}
            >
              {tagline}
            </p>
            <h1 className="mt-3 text-5xl md:text-6xl font-display font-bold leading-[1.05] tracking-tight">
              {title}
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg">
              {description}
            </p>
          </div>

          {/* image carousel */}
          <div className="relative">
            <div
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border"
              style={{ borderColor: theme.accentSoft, background: "white" }}
            >
              {images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${title} ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
                  style={{ opacity: i === idx ? 1 : 0 }}
                />
              ))}
              <button
                onClick={prev}
                aria-label="Sebelumnya"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow hover:scale-105 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Berikutnya"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow hover:scale-105 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      haptics.tap();
                      setIdx(i);
                    }}
                    aria-label={`Halaman ${i + 1}`}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === idx ? 24 : 8,
                      background: i === idx ? theme.accent : "rgba(0,0,0,0.2)",
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-xs font-mono text-muted-foreground">
              Slide {idx + 1} / {images.length}
            </p>
          </div>
        </div>

        {/* interactive section */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-px flex-1"
              style={{ background: theme.accentSoft }}
            />
            <span
              className="text-xs font-mono uppercase tracking-widest"
              style={{ color: theme.accent }}
            >
              Coba sendiri
            </span>
            <div
              className="h-px flex-1"
              style={{ background: theme.accentSoft }}
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
