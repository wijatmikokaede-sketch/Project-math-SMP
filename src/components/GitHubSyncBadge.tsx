import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock, HelpCircle, RefreshCw } from "lucide-react";
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } from "@/lib/github-config";
import { cn } from "@/lib/utils";

const BUILD_COMMIT: string =
  (import.meta.env.VITE_BUILD_COMMIT as string | undefined) ?? "dev";

type Status = "loading" | "synced" | "behind" | "unknown";

export function GitHubSyncBadge() {
  const [remoteSha, setRemoteSha] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  const configured = Boolean(GITHUB_OWNER && GITHUB_REPO);

  const check = useCallback(async () => {
    if (!configured) {
      setStatus("unknown");
      return;
    }
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/${GITHUB_BRANCH}`,
        { headers: { Accept: "application/vnd.github+json" } },
      );
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { sha: string };
      const short = data.sha.slice(0, 7);
      setRemoteSha(short);
      setLastChecked(new Date());
      setStatus(short === BUILD_COMMIT ? "synced" : "behind");
    } catch {
      setStatus("unknown");
      setLastChecked(new Date());
    }
  }, [configured]);

  useEffect(() => {
    check();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") check();
    }, 60_000);
    const onVis = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [check]);

  const meta = {
    loading: { label: "Memeriksa…", icon: RefreshCw, cls: "bg-muted text-muted-foreground", spin: true },
    synced: { label: "Tersinkron", icon: CheckCircle2, cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", spin: false },
    behind: { label: "Menunggu sync", icon: Clock, cls: "bg-amber-500/15 text-amber-600 border-amber-500/30", spin: false },
    unknown: { label: "Tidak diketahui", icon: HelpCircle, cls: "bg-muted text-muted-foreground", spin: false },
  }[status];

  const Icon = meta.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition",
          meta.cls,
        )}
        aria-label="Status sinkronisasi GitHub"
      >
        <Icon className={cn("h-3.5 w-3.5", meta.spin && "animate-spin")} />
        <span className="hidden sm:inline">{meta.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg z-50">
          <div className="font-semibold text-sm mb-2">Sinkronisasi GitHub</div>
          {!configured && (
            <p className="text-muted-foreground">
              Repo belum diset. Edit <code className="font-mono">src/lib/github-config.ts</code> dan isi
              <code className="font-mono"> GITHUB_OWNER</code> &amp; <code className="font-mono">GITHUB_REPO</code>.
            </p>
          )}
          {configured && (
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build aktif:</span>
                <code className="font-mono">{BUILD_COMMIT}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GitHub ({GITHUB_BRANCH}):</span>
                <code className="font-mono">{remoteSha ?? "—"}</code>
              </div>
              {lastChecked && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cek terakhir:</span>
                  <span>{lastChecked.toLocaleTimeString()}</span>
                </div>
              )}
              {status === "behind" && (
                <p className="mt-2 text-amber-600">
                  Ada commit baru di GitHub yang belum ter-build di preview.
                </p>
              )}
              {status === "synced" && (
                <p className="mt-2 text-emerald-600">
                  Preview sudah memakai commit terbaru.
                </p>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => check()}
            className="mt-3 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-accent"
          >
            <RefreshCw className="h-3 w-3" /> Cek ulang
          </button>
        </div>
      )}
    </div>
  );
}