import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, Pencil, Plus, X, ImageIcon } from "lucide-react";
import { listHotsQuestions, upsertHotsQuestion, deleteHotsQuestion } from "@/lib/hots.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { haptics } from "@/lib/haptics";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/hots")({
  component: AdminHotsPage,
});

type HotsQuestion = {
  id: string;
  title: string;
  problem: string | null;
  solution: string | null;
  image_url: string | null;
  solution_image_url: string | null;
  level: string | null;
  week_start_date: string;
};

function mondayOf(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function AdminHotsPage() {
  const fetchAll = useServerFn(listHotsQuestions);
  const upsert = useServerFn(upsertHotsQuestion);
  const remove = useServerFn(deleteHotsQuestion);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["hots-questions", "admin"],
    queryFn: () => fetchAll(),
  });

  const monday = mondayOf();
  const empty = {
    id: "",
    title: "",
    problem: "",
    solution: "",
    image_url: "",
    solution_image_url: "",
    level: "HOTS",
    week_start_date: monday,
  };
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    haptics.tap();
    setSaving(true);
    try {
      await upsert({
        data: {
          id: form.id || undefined,
          title: form.title,
          problem: form.problem,
          solution: form.solution,
          image_url: form.image_url,
          solution_image_url: form.solution_image_url,
          level: form.level,
          week_start_date: form.week_start_date,
        },
      });
      toast.success(form.id ? "Soal HOTS diperbarui" : "Soal HOTS ditambahkan");
      setForm({ ...empty, week_start_date: monday });
      qc.invalidateQueries({ queryKey: ["hots-questions"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const edit = (q: HotsQuestion) => {
    haptics.tap();
    setForm({
      id: q.id,
      title: q.title,
      problem: q.problem ?? "",
      solution: q.solution ?? "",
      image_url: q.image_url ?? "",
      solution_image_url: q.solution_image_url ?? "",
      level: q.level ?? "HOTS",
      week_start_date: q.week_start_date,
    });
  };

  const del = async (id: string) => {
    if (!confirm("Hapus soal HOTS ini?")) return;
    haptics.tap();
    try {
      await remove({ data: { id } });
      toast.success("Soal HOTS dihapus");
      qc.invalidateQueries({ queryKey: ["hots-questions"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">
              {form.id ? "Edit Soal HOTS" : "Tambah Soal HOTS"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Bisa isi soal dengan teks, gambar, atau keduanya. Untuk gambar, tempel URL gambar yang sudah diunggah.
            </p>
          </div>
          {form.id ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...empty, week_start_date: monday })}>
              <X className="h-4 w-4" /> Batal
            </Button>
          ) : null}
        </div>
        <form onSubmit={save} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul soal</Label>
            <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="level">Level / Label</Label>
              <Input id="level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="HOTS, Level 1, Olimpiade, dll" />
            </div>
            <div>
              <Label htmlFor="week">Mulai minggu (Senin)</Label>
              <Input id="week" type="date" required value={form.week_start_date} onChange={(e) => setForm({ ...form, week_start_date: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="image_url">URL gambar soal</Label>
            <Input id="image_url" type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            {form.image_url ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-border bg-muted/30">
                <img src={form.image_url} alt="Preview gambar soal" className="max-h-64 w-full object-contain" />
              </div>
            ) : null}
          </div>
          <div>
            <Label htmlFor="problem">Teks soal / instruksi tambahan</Label>
            <Textarea id="problem" rows={5} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="solution_image_url">URL gambar pembahasan / jawaban</Label>
            <Input id="solution_image_url" type="url" value={form.solution_image_url} onChange={(e) => setForm({ ...form, solution_image_url: e.target.value })} placeholder="https://..." />
            {form.solution_image_url ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-border bg-muted/30">
                <img src={form.solution_image_url} alt="Preview gambar pembahasan" className="max-h-64 w-full object-contain" />
              </div>
            ) : null}
          </div>
          <div>
            <Label htmlFor="solution">Teks pembahasan / jawaban</Label>
            <Textarea id="solution" rows={5} value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} />
          </div>
          <Button type="submit" disabled={saving}>
            <Plus className="h-4 w-4" /> {saving ? "Menyimpan..." : form.id ? "Update" : "Simpan"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">Daftar Soal HOTS</h2>
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-lg bg-muted/40" />
        ) : (data?.hotsQuestions ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada soal HOTS.</p>
        ) : (
          <div className="space-y-2">
            {(data?.hotsQuestions ?? []).map((q: HotsQuestion) => (
              <Card key={q.id} className="flex items-start justify-between gap-3 p-4">
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {q.image_url ? <img src={q.image_url} alt="Thumbnail soal" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{q.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{q.level ?? "HOTS"} · Minggu {q.week_start_date}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => edit(q)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => del(q.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
