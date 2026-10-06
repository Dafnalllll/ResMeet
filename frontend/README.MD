# 🎙️ ResMeet — Frontend

### Antarmuka untuk mengelola rekaman rapat dan membaca transkrip dengan lebih nyaman.

Frontend **ResMeet** adalah aplikasi web tempat pengguna menjelajahi arsip rekaman, melihat detail rapat, membaca transkrip, dan mengunduh catatan. Tampilannya dirancang dengan hierarki visual yang jelas, komponen interaktif, dan tata letak responsif.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-149eca?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss" alt="Tailwind CSS 4" />
</p>

## ✨ Bagian utama aplikasi

- 🏠 **Beranda** — halaman pengantar dengan akses ke arsip rekaman.
- 🗂️ **Arsip rekaman** — daftar rekaman dengan pencarian, status, tampilan pemuatan, dan kondisi kosong.
- 📤 **Form unggah** — modal untuk memilih atau menyeret file rekaman serta mengisi judul.
- 🔎 **Detail rekaman** — informasi berkas, status, transkrip, dan aksi untuk mengelola rekaman.
- 📝 **Halaman transkrip** — tampilan transkrip lengkap dengan pencarian teks dan sorotan hasil.
- 📋 **Aksi transkrip** — salin teks serta ekspor ke TXT, PDF, atau DOCX.

## 🧭 Alur penggunaan

**Buka arsip** → **Cari atau unggah rekaman** → **Buka detail** → **Baca, cari, salin, atau ekspor transkrip**

## 🧱 Teknologi frontend

| Teknologi | Peran |
| --- | --- |
| **Next.js 16** | Routing halaman dan kerangka aplikasi web |
| **React 19** | Komponen antarmuka dan interaksi pengguna |
| **TypeScript** | Tipe untuk komponen dan data aplikasi |
| **Tailwind CSS 4** | Styling dan tata letak responsif |
| **Axios** | Komunikasi data dari antarmuka |
| **jsPDF** dan **docx** | Pembuatan berkas ekspor transkrip |

## 📁 Struktur folder dan file

Berikut gambaran susunan source code dan konfigurasi utama frontend:

```text
frontend/
├── public/                         # Aset statis
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                        # Halaman dan routing Next.js
│   │   ├── recordings/
│   │   │   ├── [id]/page.tsx       # Detail rekaman
│   │   │   └── page.tsx            # Daftar rekaman
│   │   ├── transcript/
│   │   │   ├── [recordingId]/page.tsx # Transkrip per rekaman
│   │   │   └── page.tsx            # Indeks/petunjuk transkrip
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Beranda
│   ├── components/                 # Komponen UI
│   │   ├── button/
│   │   ├── icons/
│   │   ├── layout/
│   │   ├── recording/
│   │   │   ├── detail/
│   │   │   └── list/
│   │   └── transcript/
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utilitas dan konfigurasi API
│   ├── services/                   # Pemanggilan endpoint backend
│   └── types/                      # Tipe data TypeScript
├── .env.local                      # Konfigurasi lokal (contoh: URL API)
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.MD
└── tsconfig.json
```

### Folder `src/app/` — halaman dan routing

Next.js menggunakan struktur folder ini untuk menentukan alamat halaman.

| File | Kegunaan |
| --- | --- |
| `page.tsx` | Halaman beranda dan pintasan menuju daftar rekaman. |
| `layout.tsx` | Kerangka bersama halaman, termasuk metadata dan elemen global. |
| `globals.css` | Style global, tema, dan aturan tampilan aplikasi. |
| `favicon.ico` | Ikon yang ditampilkan pada tab browser. |
| `recordings/page.tsx` | Rute `/recordings` untuk menampilkan daftar rekaman. |
| `recordings/[id]/page.tsx` | Rute detail rekaman berdasarkan ID. |
| `transcript/page.tsx` | Halaman indeks yang mengarahkan pengguna memilih rekaman. |
| `transcript/[recordingId]/page.tsx` | Rute transkrip untuk rekaman berdasarkan ID. |

### Folder `src/components/` — komponen antarmuka

Komponen dikelompokkan berdasarkan fungsi agar bagian UI dapat digunakan dan dirawat secara terpisah.

| Folder/file | Kegunaan |
| --- | --- |
| `button/Button.tsx` | Tampilan tombol yang digunakan di aplikasi. |
| `button/ButtonLogic.ts` | Logika pendukung perilaku tombol. |
| `button/ButtonTypes.ts` | Tipe properti tombol. |
| `button/index.ts` | Ekspor komponen dan tipe tombol. |
| `icons/ActionIcons.tsx` | Ikon untuk tindakan seperti aksi pada rekaman atau transkrip. |
| `icons/ArrowIcons.tsx` | Ikon navigasi dan arah. |
| `icons/IconTypes.ts` | Tipe bersama untuk ikon. |
| `icons/MetaIcons.tsx` | Ikon untuk informasi atau metadata. |
| `layout/Loading.tsx` | Tampilan indikator pemuatan. |
| `layout/PageShell.tsx` | Kerangka tata letak halaman. |
| `recording/Card.tsx` | Pengelola tampilan daftar rekaman, termasuk pemuatan, pencarian, dan unggah. |
| `recording/Detail.tsx` | Pengelola tampilan detail rekaman dan data terkait. |
| `recording/detail/DeleteConfirmationModal.tsx` | Dialog konfirmasi sebelum menghapus rekaman. |
| `recording/detail/DetailHeader.tsx` | Bagian judul dan aksi pada detail rekaman. |
| `recording/detail/DetailSkeleton.tsx` | Placeholder ketika detail rekaman sedang dimuat. |
| `recording/detail/DetailToast.tsx` | Notifikasi singkat untuk hasil tindakan pada detail. |
| `recording/detail/MetadataPanel.tsx` | Panel metadata rekaman. |
| `recording/detail/MetadataRow.tsx` | Baris informasi di dalam panel metadata. |
| `recording/detail/NotFoundState.tsx` | Tampilan saat rekaman tidak ditemukan. |
| `recording/detail/StatusPill.tsx` | Label visual status rekaman. |
| `recording/detail/WaveformStrip.tsx` | Visualisasi dekoratif gelombang audio. |
| `recording/list/ListHeader.tsx` | Judul dan kontrol pada daftar rekaman. |
| `recording/list/RecordingListItem.tsx` | Satu item rekaman pada daftar. |
| `recording/list/RecordingListSkeleton.tsx` | Placeholder item saat daftar dimuat. |
| `recording/list/RecordingsEmptyState.tsx` | Tampilan ketika belum ada rekaman. |
| `recording/list/UploadModal.tsx` | Modal pemilihan dan pengunggahan file rekaman. |
| `transcript/DownloadBar.tsx` | Kumpulan aksi salin dan unduh transkrip. |
| `transcript/ExportButton.tsx` | Tombol untuk format ekspor transkrip. |
| `transcript/Transcript.tsx` | Pengelola halaman transkrip. |
| `transcript/TranscriptEmptyState.tsx` | Tampilan ketika transkrip belum tersedia. |
| `transcript/TranscriptPanel.tsx` | Panel untuk membaca dan mencari isi transkrip. |

### Folder pendukung di `src/`

| Folder/file | Kegunaan |
| --- | --- |
| `hooks/useClipboard.ts` | Hook untuk menyalin teks ke clipboard dan memberi umpan balik. |
| `lib/api.ts` | Konfigurasi instance Axios dan alamat backend. |
| `lib/apiError.ts` | Pemeriksaan dan penanganan jenis error API. |
| `lib/format.ts` | Fungsi pemformatan data yang digunakan UI. |
| `lib/transcript.ts` | Utilitas untuk mengolah teks transkrip. |
| `lib/transcriptExport.ts` | Pembuatan unduhan transkrip dalam format TXT, PDF, dan DOCX. |
| `services/recording.ts` | Permintaan API untuk mengambil, mengunggah, dan menghapus rekaman. |
| `services/transcript.ts` | Permintaan API untuk mengambil dan menghapus transkrip. |
| `types/recording.ts` | Definisi tipe data rekaman. |
| `types/transcript.ts` | Definisi tipe data transkrip. |

### Folder dan file di root `frontend/`

| Folder/file | Kegunaan |
| --- | --- |
| `public/` | Aset statis yang dapat diakses langsung; berisi ikon SVG bawaan. |
| `package.json` | Dependensi dan perintah npm seperti `dev`, `build`, dan `lint`. |
| `package-lock.json` | Versi dependensi yang terkunci agar instalasi konsisten. |
| `next.config.ts` | Konfigurasi Next.js. |
| `tsconfig.json` | Konfigurasi TypeScript dan alias impor proyek. |
| `eslint.config.mjs` | Aturan pemeriksaan kode ESLint. |
| `postcss.config.mjs` | Konfigurasi PostCSS untuk pemrosesan CSS dan Tailwind. |
| `.gitignore` | Daftar file dan folder yang tidak dilacak Git. |
| `.env.local` | Konfigurasi lokal, termasuk `NEXT_PUBLIC_API_URL`; jangan masukkan nilai rahasia ke Git. |

Folder hasil instalasi atau build seperti `node_modules/` dan `.next/` dibuat otomatis dan bukan bagian dari source code utama.

## 🚀 Menjalankan aplikasi

Pastikan Node.js dan npm tersedia, lalu dari direktori `frontend` jalankan:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

Alamat layanan data diatur melalui variabel `NEXT_PUBLIC_API_URL` pada `.env.local`.

## 🧰 Perintah yang tersedia

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan aplikasi dalam mode pengembangan |
| `npm run build` | Membuat build untuk produksi |
| `npm run start` | Menjalankan build produksi |
| `npm run lint` | Memeriksa kode frontend dengan ESLint |

---

🎧 **ResMeet — antarmuka yang membantu percakapan rapat tetap mudah ditemukan dan dibagikan.**
