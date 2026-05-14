import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-admin";
import { TechGrid } from "@/components/TechGrid";
import { haptic } from "@/lib/haptics";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin login" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (session) navigate({ to: "/admin" });
  }, [session, navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        haptic("error");
        setMsg(error.message);
      } else {
        haptic("success");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) {
        haptic("error");
        setMsg(error.message);
      } else {
        haptic("success");
        setMsg("Akun dibuat. Cek email untuk verifikasi, lalu sign in.");
        setMode("signin");
      }
    }
    setBusy(false);
  };

  return (
    <div className="relative min-h-screen" style={{ color: "var(--ink)" }}>
      <TechGrid />
      <div className="relative mx-auto flex min-h-screen max-w-md items-center px-6">
        <form
          onSubmit={handle}
          className="w-full rounded-2xl border p-8"
          style={{ background: "var(--bg-panel)", borderColor: "var(--hairline)", backdropFilter: "blur(20px)" }}
        >
          <h1 className="text-2xl font-semibold">Admin {mode === "signin" ? "Sign in" : "Sign up"}</h1>
          <p className="mt-1 text-xs" style={{ color: "var(--ink-faint)" }}>
            User pertama otomatis jadi admin.
          </p>
          <div className="mt-6 space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
              style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent)]"
              style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
            />
          </div>
          {msg && <p className="mt-3 text-xs" style={{ color: "#f87171" }}>{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            onClick={() => haptic("tap")}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-50"
            style={{ background: "var(--accent)", color: "white" }}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Buat akun"}
          </button>
          <button
            type="button"
            onClick={() => {
              haptic("tap");
              setMode((m) => (m === "signin" ? "signup" : "signin"));
              setMsg(null);
            }}
            className="mt-3 w-full text-xs"
            style={{ color: "var(--ink-muted)" }}
          >
            {mode === "signin" ? "Belum punya akun? Sign up" : "Sudah punya? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}