import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import { listConundrums, upsertConundrum, deleteConundrum } from "@/lib/conundrums.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { haptics } from "@/lib/haptics";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/conundrums")({
  component: AdminConundrumsPage,
});

type Conundrum = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  week_start_date: string;
};

function mondayOf(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function AdminConundrumsPage() {
  const fetchAll = useServerFn(listConundrums);
  const upsert = useServerFn(upsertConundrum);
  const remove = useServerFn(deleteConundrum);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["conundrums", "admin"],
    queryFn: () => fetchAll(),
  });

  const monday = mondayOf();
  const empty = { id: "", title: "", problem: "", solution: "", week_start_date: monday };
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
          week_start_date: form.week_start_date,
        },
      });
      toast.success(form.id ? "Conundrum diperbarui" : "Conundrum ditambahkan");
      setForm({ ...empty, week_start_date: monday });
      qc.invalidateQueries({ queryKey: ["conundrums"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const edit = (c: Conundrum) => {
    haptics.tap();
    setForm({
      id: c.id,
      title: c.title,
      problem: c.problem,
      solution: c.solution,
      week_start_date: c.week_start_date,
    });
  };

  const del = async (id: string) => {
    if (!confirm("Hapus conundrum ini?")) return;
    haptics.tap();
    try {
      await remove({ data: { id } });
      toast.success("Conundrum dihapus");
      qc.invalidateQueries({ queryKey: ["conundrums"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {form.id ? "Edit Conundrum" : "Tambah Conundrum Mingguan"}
          </h2>
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
          <div>
            <Label htmlFor="problem">Soal</Label>
            <Textarea id="problem" required rows={5} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="solution">Jawaban / Solusi</Label>
            <Textarea id="solution" required rows={5} value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="week">Mulai minggu (Senin)</Label>
            <Input id="week" type="date" required value={form.week_start_date} onChange={(e) => setForm({ ...form, week_start_date: e.target.value })} />
          </div>
          <Button type="submit" disabled={saving}>
            <Plus className="h-4 w-4" /> {saving ? "Menyimpan..." : form.id ? "Update" : "Simpan"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">Daftar Conundrums</h2>
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-lg bg-muted/40" />
        ) : (data?.conundrums ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada conundrum.</p>
        ) : (
          <div className="space-y-2">
            {(data?.conundrums ?? []).map((c: Conundrum) => (
              <Card key={c.id} className="flex items-start justify-between gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Minggu {c.week_start_date}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => edit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => del(c.id)}>
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