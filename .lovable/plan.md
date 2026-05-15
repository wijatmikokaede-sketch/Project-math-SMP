
# Tambah Halaman Quotes & Weekly Conundrum

Halaman home (`/`) **tidak diubah sama sekali**. Semua fitur baru di route terpisah.

## Struktur halaman baru

```
/quotes              → Quote of the Day (publik)
/conundrum           → Weekly Conundrum (publik, tampilkan soal + jawaban)
/admin               → Login admin (sudah ada infra auth)
/admin/quotes        → CRUD quotes (admin only)
/admin/conundrums    → CRUD conundrums (admin only)
```

Header navigasi baru: **Home · Quotes · Conundrum** (di-render di `__root.tsx`, di-hide di route home agar tampilan home tetap utuh — atau ditampilkan tipis, akan saya tunjukkan saat implement).

## Database — sudah siap ✅

Tabel `quotes`, `conundrums`, `user_roles` sudah ada dengan RLS yang benar:
- Publik bisa baca, hanya admin (cek via `has_role`) yang bisa CRUD.
- Trigger `handle_new_user_role`: user pertama otomatis jadi admin.

**Tidak perlu migration baru.** Cukup pakai yang sudah ada.

## Fitur per halaman

### `/quotes` — Quote of the Day
- Ambil quote dengan `published_date` hari ini (fallback: quote terbaru).
- Tampilkan: text besar, author, source link kalau ada.
- Tombol "Quote sebelumnya" untuk arsip (paginated).
- Background tipis: gradient halus + grain/noise SVG overlay (opacity ~5%).

### `/conundrum` — Weekly Conundrum
- Ambil conundrum dengan `week_start_date` di minggu ini.
- Tampilkan: title, problem (rendered, support paragraf).
- Tombol "Tampilkan jawaban" (toggle reveal — jawaban disembunyikan default).
- Arsip minggu sebelumnya di bagian bawah.

### `/admin/quotes` & `/admin/conundrums`
- Form input + list + edit/delete.
- Pakai `requireSupabaseAuth` di server function untuk semua mutasi.
- Redirect ke `/admin` (login) kalau belum auth.

## Visual & interaksi

- **Background tipis**: subtle radial gradient + SVG noise/dots pattern, beda accent untuk Quotes (warm) vs Conundrum (cool). Konsisten dengan token di `src/styles.css`.
- **Web haptics**: util `triggerHaptic(pattern)` pakai `navigator.vibrate()`. Dipanggil di setiap klik button/icon (back, reveal answer, save, copy, dll). Silently no-op di iOS/desktop.
- **Animasi**: framer-motion untuk fade-in saat masuk halaman & saat reveal jawaban.

## Technical notes

- Server functions baru di `src/lib/quotes.functions.ts` & `src/lib/conundrums.functions.ts` (read publik via `supabaseAdmin`, write via `requireSupabaseAuth` + cek `has_role`).
- Public read pakai `createServerFn` + `supabaseAdmin` dengan WHERE eksplisit (sesuai pedoman: hindari policy `TO anon` lebar).
- Auth login form sederhana di `/admin` (email/password — tidak ada Google OAuth karena belum dikonfigurasi).
- Util haptic di `src/lib/haptics.ts`.

## Yang TIDAK dilakukan

- ❌ Tidak menyentuh `src/routes/index.tsx` atau komponen home lainnya.
- ❌ Tidak buat integrasi Instagram (sesuai pilihan kamu: manual input).
- ❌ Tidak buat sistem submit jawaban user untuk conundrum.
