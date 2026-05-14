import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { haptic } from "@/lib/haptics";
import { z } from "zod";
import { Brain, Send, Eye, EyeOff, Loader2 } from "lucide-react";

type Conundrum = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  week_start_date: string;
};

const submissionSchema = z.object({
  user_name: z.string().trim().min(1, "Nama wajib diisi").max(80, "Maksimal 80 karakter"),
  user_email: z
    .string()
    .trim()
    .max(200)
    .email("Email tidak valid")
    .optional()
    .or(z.literal("")),
  answer: z.string().trim().min(1, "Jawaban tidak boleh kosong").max(2000, "Maksimal 2000 karakter"),
});

export function ConundrumSection() {
  const [conundrum, setConundrum] = useState<Conundrum | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from("conundrums")
      .select("*")
      .lte("week_start_date", today)
      .order("week_start_date", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setConundrum(data as Conundrum | null);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conundrum) return;
    setError(null);
    const parsed = submissionSchema.safeParse({ user_name: name, user_email: email, answer });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Input tidak valid");
      haptic("error");
      return;
    }
    setSubmitting(true);
    const { error: insertError } = await supabase.from("conundrum_submissions").insert({
      conundrum_id: conundrum.id,
      user_name: parsed.data.user_name,
      user_email: parsed.data.user_email || null,
      answer: parsed.data.answer,
    });
    setSubmitting(false);
    if (insertError) {
      setError("Gagal mengirim. Coba lagi.");
      haptic("error");
      return;
    }
    haptic("success");
    setSubmitted(true);
  };

  return (
    <section className="relative px-6 pb-32 pt-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em]"
             style={{ color: "var(--ink-faint)" }}>
          <span className="h-px w-8" style={{ background: "var(--accent)" }} />
          <span>Weekly Conundrum</span>
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            style={{ color: "var(--ink)" }}>
          Soal minggu ini
        </h2>

        <div
          className="relative mt-10 overflow-hidden rounded-2xl border"
          style={{
            background: "var(--bg-panel)",
            borderColor: "var(--hairline)",
            backdropFilter: "blur(20px)",
          }}
        >
          {loading ? (
            <div className="p-8 sm:p-10">
              <div className="h-6 w-1/2 animate-pulse rounded" style={{ background: "var(--hairline)" }} />
              <div className="mt-4 h-20 w-full animate-pulse rounded" style={{ background: "var(--hairline)" }} />
            </div>
          ) : !conundrum ? (
            <div className="p-10 text-center">
              <Brain className="mx-auto h-10 w-10 opacity-30" style={{ color: "var(--accent)" }} />
              <p className="mt-4 text-sm" style={{ color: "var(--ink-muted)" }}>
                Belum ada soal aktif. Tambahkan dari halaman admin.
              </p>
            </div>
          ) : (
            <div className="p-8 sm:p-10">
              <div className="text-xs font-mono uppercase tracking-wider"
                   style={{ color: "var(--accent)" }}>
                Week of {new Date(conundrum.week_start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              </div>
              <h3 className="mt-2 text-2xl font-semibold" style={{ color: "var(--ink)" }}>
                {conundrum.title}
              </h3>
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed"
                 style={{ color: "var(--ink-muted)" }}>
                {conundrum.problem}
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Nama"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={80}
                      required
                      className="rounded-lg border bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-[color:var(--accent)]"
                      style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
                    />
                    <input
                      type="email"
                      placeholder="Email (opsional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={200}
                      className="rounded-lg border bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-[color:var(--accent)]"
                      style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
                    />
                  </div>
                  <textarea
                    placeholder="Tulis jawabanmu di sini..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    maxLength={2000}
                    required
                    rows={5}
                    className="w-full resize-none rounded-lg border bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[color:var(--accent)]"
                    style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
                  />
                  {error && (
                    <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    onClick={() => haptic("tap")}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
                    style={{ background: "var(--accent)", color: "white" }}
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Kirim jawaban
                  </button>
                </form>
              ) : (
                <div className="mt-8 rounded-xl border p-5"
                     style={{ borderColor: "var(--hairline)", background: "rgba(59,130,246,0.06)" }}>
                  <div className="flex items-center gap-2 text-sm font-medium"
                       style={{ color: "var(--accent)" }}>
                    ✓ Jawabanmu terkirim
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "var(--ink-muted)" }}>
                    Terima kasih sudah berpartisipasi. Mau lihat solusinya?
                  </p>
                  <button
                    onClick={() => {
                      haptic("tap");
                      setShowSolution((s) => !s);
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition hover:opacity-80"
                    style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
                  >
                    {showSolution ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showSolution ? "Sembunyikan" : "Lihat"} solusi
                  </button>
                  {showSolution && (
                    <div className="mt-4 rounded-lg border p-4 text-sm leading-relaxed"
                         style={{ borderColor: "var(--hairline)", color: "var(--ink-muted)", background: "rgba(0,0,0,0.3)" }}>
                      <div className="mb-2 text-xs uppercase tracking-wider"
                           style={{ color: "var(--ink-faint)" }}>Solusi</div>
                      <div className="whitespace-pre-wrap" style={{ color: "var(--ink)" }}>
                        {conundrum.solution}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}