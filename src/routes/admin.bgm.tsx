import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Trash2, Pencil, Plus, X, Upload } from "lucide-react";
import { listAllBgm, upsertBgm, deleteBgm } from "@/lib/bgm.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { haptics } from "@/lib/haptics";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bgm")({
  component: AdminBgmPage,
});

type Track = {
  id: string;
  title: string;
  audio_url: string;
  sort_order: number;
  is_active: boolean;
};

function AdminBgmPage() {
  const fetchAll = useServerFn(listAllBgm);
  const upsert = useServerFn(upsertBgm);
  const remove = useServerFn(deleteBgm);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["bgm", "admin"],
    queryFn: () => fetchAll(),
  });

  const empty = { id: "", title: "", audio_url: "", sort_order: 0, is_active: true };
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    haptics.tap();
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "mp3";
      const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("bgm").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "audio/mpeg",
      });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("bgm").getPublicUrl(path);
      setForm((f) => ({ ...f, audio_url: pub.publicUrl, title: f.title || file.name.replace(/\.[^.]+$/, "") }));
      toast.success("File terupload");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal upload");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    haptics.tap();
    setSaving(true);
    try {
      await upsert({
        data: {
          id: form.id || undefined,
          title: form.title,
          audio_url: form.audio_url,
          sort_order: Number(form.sort_order) || 0,
          is_active: form.is_active,
        },
      });
      toast.success(form.id ? "Track diperbarui" : "Track ditambahkan");
      setForm(empty);
      qc.invalidateQueries({ queryKey: ["bgm"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const edit = (t: Track) => {
    haptics.tap();
    setForm({ id: t.id, title: t.title, audio_url: t.audio_url, sort_order: t.sort_order, is_active: t.is_active });
  };

  const del = async (id: string) => {
    if (!confirm("Hapus track ini?")) return;
    haptics.tap();
    try {
      await remove({ data: { id } });
      toast.success("Track dihapus");
      qc.invalidateQueries({ queryKey: ["bgm"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {form.id ? "Edit Track" : "Tambah Track BGM"}
          </h2>
          {form.id ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => setForm(empty)}>
              <X className="h-4 w-4" /> Batal
            </Button>
          ) : null}
        </div>
        <form onSubmit={save} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="url">URL Audio (paste URL MP3) atau upload file</Label>
            <Input
              id="url"
              type="url"
              required
              placeholder="https://... .mp3"
              value={form.audio_url}
              onChange={(e) => setForm({ ...form, audio_url: e.target.value })}
            />
            <div className="mt-2 flex items-center gap-2">
              <input ref={fileInput} type="file" accept="audio/*" onChange={onUpload} className="hidden" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInput.current?.click()}
              >
                <Upload className="h-4 w-4" /> {uploading ? "Mengupload..." : "Upload file"}
              </Button>
              {form.audio_url ? (
                <audio src={form.audio_url} controls className="h-8" />
              ) : null}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="order">Urutan</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-end gap-2">
              <Switch
                id="active"
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label htmlFor="active">Aktif (diputar di web)</Label>
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            <Plus className="h-4 w-4" /> {saving ? "Menyimpan..." : form.id ? "Update" : "Simpan"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">Daftar Tracks</h2>
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-lg bg-muted/40" />
        ) : (data?.tracks ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada track BGM.</p>
        ) : (
          <div className="space-y-2">
            {(data?.tracks ?? []).map((t: Track) => (
              <Card key={t.id} className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{t.title} {!t.is_active && <span className="text-xs text-muted-foreground">(nonaktif)</span>}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{t.audio_url}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => edit(t)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => del(t.id)}>
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
