## Tambahkan BGM (Background Music) ke Semua Halaman

### Yang dibangun

1. **Komponen `<BGMPlayer />`** global di `src/routes/__root.tsx` — selalu hidup, tidak reset saat pindah halaman karena di-mount di root layout.
2. **Sumber audio fleksibel**: mendukung URL eksternal (mis. file MP3 yang Anda host di mana saja) *atau* file yang Anda upload ke storage. Daftar track dikelola via admin panel.
3. **Auto-play setelah interaksi pertama** — listener global `pointerdown`/`keydown` di window menyalakan musik begitu user klik/tap di mana saja (mematuhi kebijakan autoplay browser).
4. **Kontrol mengambang** di pojok kanan bawah: tombol play/pause, slider volume kecil, dan tombol skip (kalau ada >1 track). Pakai haptics yang sudah ada.
5. **Persistensi preferensi** via `localStorage`: volume terakhir, status mute, dan track index — jadi posisi tidak hilang antar halaman/refresh.
6. **Loop & shuffle**: kalau cuma 1 track → loop. Kalau banyak → auto-next + opsi shuffle.

### Halaman cakupan

Semua halaman (homepage, /quotes, /conundrum, /admin). BGM tetap menyala mulus antar navigasi karena player di-mount di root, bukan per-route.

### Admin panel: kelola track

Halaman baru `/admin/bgm`:
- Form tambah track: judul + URL (paste link MP3) **atau** upload file
- List track dengan tombol hapus & reorder
- Toggle "BGM aktif" global (kalau dimatikan, player tidak muncul sama sekali)

### Database

Tabel baru `bgm_tracks`:
- `title` (text)
- `audio_url` (text) — bisa URL eksternal atau URL Supabase storage
- `sort_order` (int)
- `is_active` (bool)

Plus bucket storage `bgm` (public read) untuk file MP3 yang di-upload.

RLS:
- Public SELECT untuk track yang `is_active = true`
- INSERT/UPDATE/DELETE hanya admin (`has_role(auth.uid(), 'admin')`)

### Technical notes

- Pakai `<audio>` HTML5 native (ringan, tidak perlu library)
- `preload="metadata"` supaya tidak boros bandwidth
- Volume default 30% (cukup pelan untuk BGM)
- Fade-in 1 detik saat mulai play untuk mencegah kejutan
- Komponen player dibuat *client-only* (guard dengan `useEffect`) supaya tidak crash SSR

### File yang akan dibuat/diubah

- **Baru**: `src/components/BGMPlayer.tsx`, `src/lib/bgm.functions.ts`, `src/routes/admin.bgm.tsx`
- **Edit**: `src/routes/__root.tsx` (mount player), `src/routes/admin.index.tsx` (link ke admin BGM baru)
- **Migrasi DB**: tabel `bgm_tracks` + RLS + bucket storage `bgm`

### Yang TIDAK dilakukan

- Tidak generate musik AI (Anda akan supply track sendiri)
- Tidak ada playlist per-halaman (musik sama di semua halaman, simpel dulu)
- Tidak ada visualizer/equalizer
