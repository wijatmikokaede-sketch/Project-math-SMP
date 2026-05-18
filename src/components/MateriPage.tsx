import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { haptics } from "@/lib/haptics";

export type MateriTheme = {
  bgGradient: string;
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
      className="min-h-screen text-foreground animate-page-in"
      style={{ background: theme.bgGradient }}
    >
      {/* decorative blurred orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div
          className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-40 animate-float"
          style={{ background: theme.accent }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-30 animate-float"
          style={{ background: theme.accent, animationDelay: "1.2s" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {/* top bar */}
        <div className="flex items-center justify-between animate-slide-soft">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" onClick={haptics.tap}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Beranda
            </Link>
          </Button>
          <span
            className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur"
            style={{
              color: theme.accent,
              borderColor: theme.accentSoft,
              background: theme.badge,
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* compact title */}
        <div className="mt-8 text-center animate-slide-soft" style={{ animationDelay: "0.1s" }}>
          <p
            className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase"
            style={{ color: theme.accent }}
          >
            {tagline}
          </p>
          <h1 className="mt-3 text-4xl md:text-6xl font-display font-bold leading-[1.05] tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* HERO IMAGE — main focus */}
        <div className="mt-10 animate-hero-reveal">
          <div className="relative mx-auto max-w-4xl">
            <div
              className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-white animate-shimmer-ring"
              style={{
                boxShadow: `0 40px 100px -30px ${theme.accent}66, 0 0 0 1px ${theme.accentSoft}`,
              }}
            >
              {images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${title} ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-contain p-4 md:p-8 transition-all duration-700"
                  style={{
                    opacity: i === idx ? 1 : 0,
                    transform: i === idx ? "scale(1)" : "scale(1.04)",
                  }}
                />
              ))}

              {/* corner accent */}
              <div
                className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest backdrop-blur"
                style={{ background: "rgba(255,255,255,0.7)", color: theme.accent }}
              >
                <Sparkles className="h-3 w-3" /> Materi visual
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Sebelumnya"
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    style={{ color: theme.accent }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Berikutnya"
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    style={{ color: theme.accent }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          haptics.tap();
                          setIdx(i);
                        }}
                        aria-label={`Halaman ${i + 1}`}
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: i === idx ? 28 : 8,
                          background: i === idx ? theme.accent : "rgba(0,0,0,0.2)",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <p className="mt-4 text-center text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Slide {idx + 1} dari {images.length}
            </p>
          </div>
        </div>

        {/* interactive section — below the image */}
        <div className="mt-20 animate-slide-soft" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ background: theme.accentSoft }} />
            <span
              className="text-xs font-mono uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border"
              style={{
                color: theme.accent,
                borderColor: theme.accentSoft,
                background: theme.badge,
              }}
            >
              ✦ Coba interaktif ✦
            </span>
            <div className="h-px flex-1" style={{ background: theme.accentSoft }} />
          </div>
          {children}
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}
