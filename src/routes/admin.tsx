import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/lib/use-admin";
import { TechGrid } from "@/components/TechGrid";
import { haptic } from "@/lib/haptics";
import { Loader2, LogOut, Plus, Trash2, Home } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin dashboard" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

type Quote = { id: string; text: string; author: string | null; source_url: string | null; published_date: string };
type Conundrum = { id: string; title: string; problem: string; solution: string; week_start_date: string };
type Submission = { id: string; conundrum_id: string; user_name: string; user_email: string | null; answer: string; submitted_at: string };

function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, session, loading } = useIsAdmin();
  const [tab, setTab] = useState<"quotes" | "conundrums" | "submissions">("quotes");

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/admin/login" });
  }, [loading, session, navigate]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center" style={{ color: "var(--ink)" }}>
        <TechGrid />
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (!session) return null;
  if (!isAdmin) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-6" style={{ color: "var(--ink)" }}>
        <TechGrid />
        <div className="text-center">
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>Akun ini bukan admin.</p>
          <button
            onClick={async () => { haptic("tap"); await supabase.auth.signOut(); }}
            className="mt-4 rounded-full border px-4 py-2 text-xs"
            style={{ borderColor: "var(--hairline)" }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ color: "var(--ink)" }}>
      <TechGrid />
      <header className="relative border-b px-6 py-4" style={{ borderColor: "var(--hairline)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "var(--ink-muted)" }}>
            admin.console
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" onClick={() => haptic("tap")} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs"
                  style={{ borderColor: "var(--hairline)" }}>
              <Home className="h-3 w-3" /> Home
            </Link>
            <button
              onClick={async () => { haptic("tap"); await supabase.auth.signOut(); navigate({ to: "/admin/login" }); }}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs"
              style={{ borderColor: "var(--hairline)" }}
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex gap-2">
          {(["quotes", "conundrums", "submissions"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { haptic("tap"); setTab(t); }}
              className="rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition"
              style={{
                borderColor: tab === t ? "var(--accent)" : "var(--hairline)",
                background: tab === t ? "rgba(59,130,246,0.1)" : "transparent",
                color: tab === t ? "var(--accent)" : "var(--ink-muted)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "quotes" && <QuotesAdmin />}
        {tab === "conundrums" && <ConundrumsAdmin />}
        {tab === "submissions" && <SubmissionsAdmin />}
      </div>
    </div>
  );
}

function panelStyle(): React.CSSProperties {
  return {
    background: "var(--bg-panel)",
    borderColor: "var(--hairline)",
    backdropFilter: "blur(20px)",
  };
}

function inputClass() {
  return "w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]";
}
function inputStyle(): React.CSSProperties {
  return { borderColor: "var(--hairline)", color: "var(--ink)" };
}

function QuotesAdmin() {
  const [items, setItems] = useState<Quote[]>([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("quotes").select("*").order("published_date", { ascending: false });
    setItems((data ?? []) as Quote[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("quotes").insert({
      text: text.trim(),
      author: author.trim() || null,
      source_url: sourceUrl.trim() || null,
      published_date: date,
    });
    setBusy(false);
    if (!error) {
      haptic("success");
      setText(""); setAuthor(""); setSourceUrl("");
      load();
    } else haptic("error");
  };

  const remove = async (id: string) => {
    haptic("tap");
    await supabase.from("quotes").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="rounded-2xl border p-6 space-y-3" style={panelStyle()}>
        <textarea required maxLength={1000} placeholder="Quote text..." value={text} onChange={(e) => setText(e.target.value)}
                  rows={3} className={inputClass()} style={inputStyle()} />
        <div className="grid gap-3 sm:grid-cols-3">
          <input maxLength={120} placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass()} style={inputStyle()} />
          <input maxLength={500} placeholder="IG / source URL (opsional)" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className={inputClass()} style={inputStyle()} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass()} style={inputStyle()} />
        </div>
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm" style={{ background: "var(--accent)", color: "white" }}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Tambah
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((q) => (
          <li key={q.id} className="flex items-start justify-between gap-4 rounded-xl border p-4" style={panelStyle()}>
            <div className="min-w-0 flex-1">
              <div className="text-xs" style={{ color: "var(--ink-faint)" }}>{q.published_date} · {q.author ?? "—"}</div>
              <div className="mt-1 text-sm">{q.text}</div>
            </div>
            <button onClick={() => remove(q.id)} className="text-xs opacity-60 hover:opacity-100" aria-label="Hapus">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {items.length === 0 && <p className="text-center text-sm" style={{ color: "var(--ink-faint)" }}>Belum ada quote.</p>}
      </ul>
    </div>
  );
}

function ConundrumsAdmin() {
  const [items, setItems] = useState<Conundrum[]>([]);
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("conundrums").select("*").order("week_start_date", { ascending: false });
    setItems((data ?? []) as Conundrum[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("conundrums").insert({
      title: title.trim(),
      problem: problem.trim(),
      solution: solution.trim(),
      week_start_date: date,
    });
    setBusy(false);
    if (!error) {
      haptic("success");
      setTitle(""); setProblem(""); setSolution("");
      load();
    } else haptic("error");
  };

  const remove = async (id: string) => {
    haptic("tap");
    await supabase.from("conundrums").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="rounded-2xl border p-6 space-y-3" style={panelStyle()}>
        <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
          <input required maxLength={200} placeholder="Judul soal" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass()} style={inputStyle()} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass()} style={inputStyle()} />
        </div>
        <textarea required maxLength={4000} placeholder="Problem (soal)..." value={problem} onChange={(e) => setProblem(e.target.value)} rows={5} className={inputClass()} style={inputStyle()} />
        <textarea required maxLength={4000} placeholder="Solution (jawaban + penjelasan)..." value={solution} onChange={(e) => setSolution(e.target.value)} rows={5} className={inputClass()} style={inputStyle()} />
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm" style={{ background: "var(--accent)", color: "white" }}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Tambah
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((c) => (
          <li key={c.id} className="flex items-start justify-between gap-4 rounded-xl border p-4" style={panelStyle()}>
            <div className="min-w-0 flex-1">
              <div className="text-xs" style={{ color: "var(--ink-faint)" }}>Week of {c.week_start_date}</div>
              <div className="mt-1 text-sm font-medium">{c.title}</div>
              <div className="mt-1 text-xs line-clamp-2" style={{ color: "var(--ink-muted)" }}>{c.problem}</div>
            </div>
            <button onClick={() => remove(c.id)} className="text-xs opacity-60 hover:opacity-100" aria-label="Hapus">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {items.length === 0 && <p className="text-center text-sm" style={{ color: "var(--ink-faint)" }}>Belum ada conundrum.</p>}
      </ul>
    </div>
  );
}

function SubmissionsAdmin() {
  const [items, setItems] = useState<(Submission & { conundrum?: { title: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("conundrum_submissions")
      .select("*, conundrum:conundrums(title)")
      .order("submitted_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setItems((data ?? []) as never);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader2 className="mx-auto h-5 w-5 animate-spin" />;

  return (
    <ul className="space-y-2">
      {items.map((s) => (
        <li key={s.id} className="rounded-xl border p-4" style={panelStyle()}>
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--ink-faint)" }}>
            <span>{s.user_name} {s.user_email && <>· {s.user_email}</>}</span>
            <span>{new Date(s.submitted_at).toLocaleString("id-ID")}</span>
          </div>
          <div className="mt-1 text-xs" style={{ color: "var(--ink-muted)" }}>
            on: {s.conundrum?.title ?? "—"}
          </div>
          <div className="mt-2 whitespace-pre-wrap text-sm">{s.answer}</div>
        </li>
      ))}
      {items.length === 0 && <p className="text-center text-sm" style={{ color: "var(--ink-faint)" }}>Belum ada submission.</p>}
    </ul>
  );
}