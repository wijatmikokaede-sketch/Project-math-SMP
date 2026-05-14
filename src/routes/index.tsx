import { createFileRoute, Link } from "@tanstack/react-router";
import { TechGrid } from "@/components/TechGrid";
import { QuotesSection } from "@/components/QuotesSection";
import { ConundrumSection } from "@/components/ConundrumSection";
import { haptic } from "@/lib/haptics";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daily Quotes & Weekly Conundrum" },
      {
        name: "description",
        content: "Quote harian dan teka-teki mingguan yang elegan. Inspirasi setiap hari, tantangan setiap minggu.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen" style={{ color: "var(--ink)" }}>
      <TechGrid />

      <header className="relative px-6 pt-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em]"
               style={{ color: "var(--ink-muted)" }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            daily.notes
          </div>
          <Link
            to="/admin"
            onClick={() => haptic("tap")}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition hover:opacity-80"
            style={{ borderColor: "var(--hairline)", color: "var(--ink-muted)" }}
          >
            <Lock className="h-3 w-3" />
            Admin
          </Link>
        </div>
      </header>

      <main>
        <QuotesSection />
        <ConundrumSection />
      </main>

      <footer className="border-t px-6 py-8" style={{ borderColor: "var(--hairline)" }}>
        <div className="mx-auto max-w-3xl text-center text-xs"
             style={{ color: "var(--ink-faint)" }}>
          © {new Date().getFullYear()} · made with care
        </div>
      </footer>
    </div>
  );
}
