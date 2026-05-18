import { Gamepad2, ExternalLink, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const GAME_URL = "https://kadede.itch.io/gamemathnyasusabgt2";

export function GameSection() {
  return (
    <section id="game" className="relative py-24 overflow-hidden bg-background">
      <div className="absolute top-10 -left-20 -z-10 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/10 text-accent-foreground text-xs font-mono uppercase tracking-widest">
            <Gamepad2 className="h-3.5 w-3.5" /> Play Now
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-bold">
            Main <span className="text-gradient">Math Game</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Mainkan langsung di browser — skormu otomatis muncul di Leaderboard di bawah.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-card">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border text-xs font-mono text-muted-foreground bg-secondary/40">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              math_game.exe
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" asChild className="h-7 px-2 text-xs">
                <a href={GAME_URL} target="_blank" rel="noopener noreferrer">
                  <Maximize2 className="h-3 w-3 mr-1" /> Fullscreen
                </a>
              </Button>
              <Button size="sm" variant="ghost" asChild className="h-7 px-2 text-xs">
                <a href={GAME_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" /> Itch.io
                </a>
              </Button>
            </div>
          </div>

          <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              src={GAME_URL}
              title="Math Game by kadede"
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; fullscreen; gamepad *;"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-mono text-muted-foreground">
          Jika game tidak muncul, klik <span className="text-foreground">Fullscreen</span> untuk buka di tab baru.
        </p>
      </div>
    </section>
  );
}
