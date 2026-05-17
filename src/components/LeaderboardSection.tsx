import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Crown } from "lucide-react";

type Row = { id: number; username: string; score: number; created_at: string };

export function LeaderboardSection() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from("leaderboard" as never)
      .select("id, username, score, created_at")
      .order("score", { ascending: false })
      .limit(10);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("leaderboard-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leaderboard" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="leaderboard" className="relative py-24 overflow-hidden bg-background">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 -z-10 h-96 w-[40rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live · Realtime
          </span>
          <h2 className="mt-6 text-4xl md:text-6xl font-bold">
            Global <span className="text-gradient">Leaderboard</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Top 10 pemain terbaik dari Godot Game. Update otomatis tanpa refresh.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-card">
          <div className="grid grid-cols-[60px_1fr_120px] md:grid-cols-[80px_1fr_160px] px-6 py-3 border-b border-border text-xs font-mono uppercase tracking-wider text-muted-foreground bg-secondary/40">
            <span>Rank</span>
            <span>Player</span>
            <span className="text-right">Score</span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-muted-foreground font-mono text-sm">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <Trophy className="h-10 w-10 mx-auto mb-3 opacity-40" />
              Belum ada skor. Jadilah yang pertama!
            </div>
          ) : (
            <ul>
              {rows.map((r, i) => {
                const rank = i + 1;
                const isTop3 = rank <= 3;
                const RankIcon = rank === 1 ? Crown : rank === 2 ? Trophy : rank === 3 ? Medal : null;
                const rankColor =
                  rank === 1
                    ? "text-yellow-400"
                    : rank === 2
                    ? "text-zinc-300"
                    : rank === 3
                    ? "text-amber-600"
                    : "text-muted-foreground";
                return (
                  <li
                    key={r.id}
                    className={`grid grid-cols-[60px_1fr_120px] md:grid-cols-[80px_1fr_160px] items-center px-6 py-4 border-b border-border/60 last:border-0 transition hover:bg-secondary/40 ${
                      isTop3 ? "bg-gradient-to-r from-primary/5 to-transparent" : ""
                    }`}
                  >
                    <div className={`flex items-center gap-2 font-display font-bold ${rankColor}`}>
                      {RankIcon ? <RankIcon className="h-5 w-5" /> : null}
                      <span className="text-lg">#{rank}</span>
                    </div>
                    <div className="font-medium truncate">{r.username}</div>
                    <div className="text-right font-mono font-bold text-lg tabular-nums">
                      {r.score.toLocaleString()}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="mt-6 text-center text-xs font-mono text-muted-foreground">
          Skor baru dari game akan muncul di sini secara otomatis.
        </p>
      </div>
    </section>
  );
}
