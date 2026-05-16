import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { haptics } from "@/lib/haptics";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Art Of Math" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const [session, setSession] = useState<{ email?: string } | null | "loading">("loading");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ? { email: data.session.user.email ?? undefined } : null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ? { email: s.user.email ?? undefined } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === "loading") {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="p-8 text-center text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <nav className="flex gap-2">
            <AdminTab to="/admin/quotes" label="Quotes" />
            <AdminTab to="/admin/conundrums" label="Conundrums" />
            <AdminTab to="/admin/bgm" label="BGM" />
          </nav>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{session.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                haptics.tap();
                await supabase.auth.signOut();
              }}
            >
              <LogOut className="h-4 w-4" /> Keluar
            </Button>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

function AdminTab({ to, label }: { to: "/admin/quotes" | "/admin/conundrums" | "/admin/bgm"; label: string }) {
  return (
    <Link
      to={to}
      onClick={haptics.tap}
      activeProps={{ className: "bg-primary text-primary-foreground" }}
      className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    >
      {label}
    </Link>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    haptics.tap();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Berhasil masuk");
        navigate({ to: "/admin/quotes" });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Akun dibuat. Silakan masuk.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="mb-1 font-display text-2xl font-bold">Admin</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {mode === "signin" ? "Masuk untuk mengelola konten." : "Buat akun admin pertama."}
      </p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Memproses..." : mode === "signin" ? "Masuk" : "Daftar"}
        </Button>
        <button
          type="button"
          onClick={() => {
            haptics.tap();
            setMode((m) => (m === "signin" ? "signup" : "signin"));
          }}
          className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
        </button>
      </form>
    </div>
  );
}