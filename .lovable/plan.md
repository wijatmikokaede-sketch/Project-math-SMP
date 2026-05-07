## Tujuan

Menampilkan indikator kecil di halaman project (`/`) yang memberi tahu kamu apakah versi yang sedang berjalan di Lovable **sudah sama** dengan commit terbaru di GitHub, atau **masih ketinggalan** (artinya sync belum selesai / build belum jalan).

## Cara kerja (penjelasan singkat)

```text
[ Build Lovable ]                 [ GitHub repo ]
  commit SHA di-embed              commit terbaru
  saat build (build-time)          diambil via API publik
        │                                 │
        └──────────► dibandingkan ◄──────┘
                          │
                ┌─────────┴─────────┐
              sama?               beda?
                │                   │
          🟢 Tersinkron       🟡 Menunggu sync
```

- Saat build, SHA commit aktif disimpan ke `import.meta.env.VITE_BUILD_COMMIT` (via `vite.config.ts` menggunakan `git rev-parse HEAD`).
- Di browser, sebuah hook memanggil `https://api.github.com/repos/<owner>/<repo>/commits/main` (endpoint publik, tanpa token, polling tiap 30 detik).
- Bandingkan 2 SHA → tampilkan badge.

## Yang akan dibuat / diubah

1. **`vite.config.ts`** — inject `VITE_BUILD_COMMIT` (7 karakter pertama dari `git rev-parse HEAD`) ke `define`. Fallback `"dev"` kalau git tidak tersedia.
2. **`src/components/GitHubSyncBadge.tsx`** (baru) — komponen badge dengan 3 state:
   - 🟢 **Tersinkron** — SHA build = SHA GitHub
   - 🟡 **Menunggu sync…** — SHA berbeda (commit baru belum ke-build)
   - ⚪ **Tidak diketahui** — repo belum di-set / fetch gagal
   - Tooltip menampilkan SHA build vs SHA GitHub + waktu cek terakhir + tombol "Cek ulang".
3. **`src/lib/github-config.ts`** (baru) — konstanta `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH` (default `"main"`). Kamu cukup edit 1 file ini sekali untuk memasukkan nama repo GitHub-mu.
4. **`src/routes/index.tsx`** — pasang `<GitHubSyncBadge />` di header (di sebelah tombol "Mulai") supaya kelihatan di setiap kunjungan halaman utama.

## Detail teknis

- **Polling**: `setInterval` 30 detik + refetch saat tab kembali fokus (`visibilitychange`). Tidak pakai TanStack Query agar tidak menambah dependensi state — cukup `useEffect`.
- **Rate limit GitHub**: API publik = 60 req/jam/IP. Polling 30 detik = 120 req/jam → terlalu sering. Akan dipakai **60 detik** + jeda saat tab tidak aktif. Aman untuk pemakaian pribadi.
- **Tanpa token**: hanya repo publik. Kalau repo-mu privat, badge akan menampilkan "Tidak diketahui" — solusinya pakai token GitHub via Lovable Cloud secret (bisa ditambahkan nanti kalau perlu).
- **SSR aman**: fetch hanya di `useEffect` (client-side), jadi tidak memicu request saat prerender.

## Yang perlu kamu siapkan

Setelah plan ini di-approve, beri tahu aku **owner & nama repo GitHub-mu** (contoh: `username/art-of-math`) supaya aku isi `github-config.ts`. Atau kamu bisa edit sendiri file itu setelah dibuat.

## Batasan jujur

Indikator ini membandingkan **commit GitHub vs commit yang di-build Lovable**. Jadi:
- 🟢 hijau = build Lovable sudah pakai commit terbaru GitHub.
- 🟡 kuning = ada commit baru di GitHub yang **belum ter-build** di preview Lovable (sync belum selesai, atau build error).

Ini bukan API resmi Lovable — tidak bisa membaca status internal sync engine Lovable, tapi efeknya sama untuk tujuanmu: tahu kapan perubahan GitHub sudah masuk ke preview.