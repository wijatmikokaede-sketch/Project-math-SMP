import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, RefreshCw, Trash2, Trophy } from "lucide-react";
import { listLeaderboardEntries, resetLeaderboard } from "@/lib/leaderboard.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { haptics } from "@/lib/haptics";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leaderboard")({
  component: AdminLeaderboardPage,
});

type LeaderboardRow = {
  id: number;
  username: string;
  score: number;
  created_at: string;
};

function AdminLeaderboardPage() {
  const fetchRows = useServerFn(listLeaderboardEntries);
  const resetRows = useServerFn(resetLeaderboard);
  const qc = useQueryClient();
  const [resetting, setResetting] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", "admin"],
    queryFn: () => fetchRows(),
  });

  const rows: LeaderboardRow[] = data?.leaderboard ?? [];

  const reset = async () => {
    if (!confirm("Yakin reset semua skor leaderboard? Tindakan ini tidak bisa dibatalkan.")) return;
    haptics.tap();
    setResetting(true);
    try {
      await resetRows();
      toast.success("Leaderboard berhasil di-reset");
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal reset leaderboard");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Trophy className="h-4 w-4" /> Leaderboard
            </div>
            <h2 className="font-display text-xl font-semibold">Reset Leaderboard</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tombol ini menghapus semua skor dari tabel leaderboard. Gunakan setelah event selesai atau saat ingin mulai musim baru.
            </p>
          </div>
          <Button variant="destructive" onClick={reset} disabled={resetting || rows.length === 0}>
            <Trash2 className="h-4 w-4" /> {resetting ? "Mereset..." : "Reset semua skor"}
          </Button>
        </div>
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Data yang sudah dihapus tidak bisa dikembalikan dari panel ini.</p>
          </div>
        </div>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Skor Saat Ini</h2>
          <Button variant="ghost" size="sm" onClick={() => qc.invalidateQueries({ queryKey: ["leaderboard"] })}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-lg bg-muted/40" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Leaderboard masih kosong.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-[64px_1fr_100px] gap-3 border-b border-border bg-muted/40 px-4 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <span>Rank</span>
              <span>Player</span>
              <span className="text-right">Score</span>
            </div>
            {rows.map((row, index) => (
              <div key={row.id} className="grid grid-cols-[64px_1fr_100px] gap-3 border-b border-border/60 px-4 py-3 text-sm last:border-0">
                <span className="font-mono text-muted-foreground">#{index + 1}</span>
                <span className="truncate font-medium">{row.username}</span>
                <span className="text-right font-mono font-semibold">{row.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
