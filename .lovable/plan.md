
# Pivot Homepage: Quotes & Weekly Conundrum

Game / math content akan dihentikan untuk fokus baru ini. Halaman utama (`/`) akan jadi satu halaman scroll dengan dua section: **Quotes of the Day** dan **Weekly Conundrum**.

---

## 1. Backend (Lovable Cloud)

Aktifkan Lovable Cloud (Supabase di balik layar) untuk menyimpan data secara persisten dan menangani autentikasi admin.

### Tabel database

- **`quotes`** — `id`, `text`, `author`, `source_url` (opsional, link IG), `published_date`, `created_at`
- **`conundrums`** — `id`, `title`, `problem` (rich text), `solution` (rich text, hidden), `week_start_date`, `created_at`
- **`conundrum_submissions`** — `id`, `conundrum_id`, `user_name`, `user_email` (opsional), `answer`, `submitted_at`
- **`user_roles`** — pola standar `app_role` enum + fungsi `has_role()` untuk membedakan admin vs user biasa

### RLS Policies

- `quotes` & `conundrums`: SELECT public (semua orang bisa baca), INSERT/UPDATE/DELETE hanya admin
- `conundrum_submissions`: INSERT public dengan rate-limit, SELECT hanya admin
- Auth: email/password sederhana untuk akun admin (kamu sendiri)

---

## 2. Halaman & Routing

```
/                  → landing (Quote hari ini + Conundrum minggu ini, satu scroll)
/admin/login       → login admin
/admin             → dashboard admin (kelola quotes & conundrum + lihat submissions)
```

### Section Quotes of the Day (atas)
- Tampilkan quote dengan `published_date = hari ini` (fallback: quote terbaru)
- Layout: kartu besar di tengah dengan teks quote, nama author, dan link kecil ke IG (jika ada `source_url`)
- Tombol "Quote sebelumnya" → arsip dengan scroll/carousel

### Section Weekly Conundrum (bawah)
- Tampilkan conundrum dengan `week_start_date` terbaru (≤ hari ini)
- Form sederhana: nama + jawaban → submit ke `conundrum_submissions`
- Setelah submit: tampilkan toast sukses + opsi reveal solusi
- Link kecil ke arsip conundrum minggu sebelumnya

### Admin Dashboard (`/admin`)
- Tab **Quotes**: tabel quote + form add/edit (text, author, tanggal publish, link IG opsional)
- Tab **Conundrum**: tabel conundrum mingguan + form add/edit (title, problem, solution, week start)
- Tab **Submissions**: lihat jawaban user per conundrum

---

## 3. Visual & Interaksi

### Background tipis "Grid teknikal subtle"
- Komponen `TechGrid` sebagai fixed background di seluruh app
- Base `#0d0d0d` dengan grid garis `#2d2d2d` opacity rendah (CSS background-image dengan linear-gradient)
- Aksen: titik biru `#3b82f6` halus yang berpulsasi pelan di intersection (animasi CSS, tidak berat)
- Kontras teks tetap aman dengan overlay gelap pada area konten

### Web Haptics di setiap klik icon
- Helper `useHaptic()` berbasis `navigator.vibrate()` (Web Vibration API)
- Pola berbeda untuk feedback: `tap` (10ms), `success` (20-50-20ms), `error` (50-30-50ms)
- Auto-fallback diam-diam di browser yang tidak support (desktop)
- Wrap semua `<Button variant="icon">` & icon clickable supaya otomatis memanggil haptic + visual ripple ringan

### Design tokens
- Tambah ke `src/styles.css`: warna grid, glow biru, gradient overlay
- Font: tetap clean sans-serif untuk body, pertimbangkan Space Grotesk untuk heading (sesuai tema teknikal)

---

## 4. Migrasi konten lama

GitHub sync badge dari pekerjaan sebelumnya tetap dipertahankan (kecil, di pojok). Konten game/math di `index.tsx` diganti penuh dengan section quotes + conundrum.

---

## Detail teknikal (untuk referensi)

- **Server functions** (`createServerFn`) untuk semua CRUD admin + submit jawaban — bukan Edge Functions
- **Server fn publik** (admin-elevated, scoped WHERE) untuk fetch quote/conundrum hari ini agar loader public route tidak 401
- Loader di `_authenticated/admin` dengan `beforeLoad` redirect ke `/admin/login` kalau tidak login
- Validasi input pakai Zod (max length text, sanitize HTML jika rich text)
- Realtime tidak diperlukan — fetch on load + invalidate setelah mutation cukup
- Instagram API **tidak dipakai** sesuai pilihanmu (manual input)

---

## Yang TIDAK termasuk di plan ini

- Auto-fetch dari Instagram (tidak feasible tanpa Business account + Meta App approval)
- Notifikasi push untuk quote baru
- User account untuk visitor biasa (hanya admin yang login)
- Voting / leaderboard untuk conundrum submissions
