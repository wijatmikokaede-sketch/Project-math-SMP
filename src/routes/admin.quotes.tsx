import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import { listQuotes, upsertQuote, deleteQuote } from "@/lib/quotes.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { haptics } from "@/lib/haptics";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/quotes")({
  component: AdminQuotesPage,
});

type Quote = {
  id: string;
  text: string;
  author: string | null;
  source_url: string | null;
  published_date: string;
};

function AdminQuotesPage() {
  const fetchQuotes = useServerFn(listQuotes);
  const upsert = useServerFn(upsertQuote);
  const remove = useServerFn(deleteQuote);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["quotes", "admin"],
    queryFn: () => fetchQuotes(),
  });

  const today = new Date().toISOString().slice(0, 10);
  const empty = { id: "", text: "", author: "", source_url: "", published_date: today };
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
          text: form.text,
          author: form.author || null,
          source_url: form.source_url || null,
          published_date: form.published_date,
        },
      });
      toast.success(form.id ? "Quote diperbarui" : "Quote ditambahkan");
      setForm({ ...empty, published_date: today });
      qc.invalidateQueries({ queryKey: ["quotes"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const edit = (q: Quote) => {
    haptics.tap();
    setForm({
      id: q.id,
      text: q.text,
      author: q.author ?? "",
      source_url: q.source_url ?? "",
      published_date: q.published_date,
    });
  };

  const del = async (id: string) => {
    if (!confirm("Hapus quote ini?")) return;
    haptics.tap();
    try {
      await remove({ data: { id } });
      toast.success("Quote dihapus");
      qc.invalidateQueries({ queryKey: ["quotes"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {form.id ? "Edit Quote" : "Tambah Quote"}
          </h2>
          {form.id ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...empty, published_date: today })}>
              <X className="h-4 w-4" /> Batal
            </Button>
          ) : null}
        </div>
        <form onSubmit={save} className="space-y-4">
          <div>
            <Label htmlFor="text">Teks quote</Label>
            <Textarea id="text" required value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="author">Author</Label>
              <Input id="author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="date">Tanggal publish</Label>
              <Input id="date" type="date" required value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="src">Sumber URL (opsional)</Label>
            <Input id="src" type="url" placeholder="https://instagram.com/p/..." value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} />
          </div>
          <Button type="submit" disabled={saving}>
            <Plus className="h-4 w-4" /> {saving ? "Menyimpan..." : form.id ? "Update" : "Simpan"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">Daftar Quotes</h2>
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-lg bg-muted/40" />
        ) : (data?.quotes ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada quote.</p>
        ) : (
          <div className="space-y-2">
            {(data?.quotes ?? []).map((q: Quote) => (
              <Card key={q.id} className="flex items-start justify-between gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{q.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {q.author || "Anonim"} · {q.published_date}
                  </p>
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