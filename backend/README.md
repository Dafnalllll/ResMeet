# ⚙️ ResMeet — Backend

### API untuk menyimpan rekaman rapat dan menyediakan transkripnya.

Backend **ResMeet** menangani data rekaman dan transkrip melalui REST API. Backend menerima unggahan audio/video, menyimpan berkas dan metadata, lalu memproses transkripsi di background agar statusnya dapat dipantau melalui API.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776ab?logo=python" alt="Python 3.10 or later" />
  <img src="https://img.shields.io/badge/FastAPI-REST_API-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/SQLAlchemy-ORM-d71f00?logo=sqlalchemy" alt="SQLAlchemy" />
  <img src="https://img.shields.io/badge/Alembic-Migrations-306998" alt="Alembic" />
</p>

## ✨ Tanggung jawab backend

- 📥 **Menerima unggahan rekaman** dalam format MP3, WAV, M4A, dan MP4.
- 💾 **Menyimpan berkas dan metadata** rekaman, termasuk nama, ukuran, tipe, durasi, dan status pemrosesan.
- 🎙️ **Menghasilkan transkrip** menggunakan `faster-whisper` melalui tugas background.
- 📊 **Menyediakan status rekaman** agar proses transkripsi dapat dipantau.
- 📄 **Menyediakan data dan unduhan** rekaman serta transkrip melalui REST API.
- 🗃️ **Mengelola skema database** menggunakan SQLAlchemy dan migrasi Alembic.

## 🔄 Alur pemrosesan

**Unggah berkas** → **Berkas dan metadata disimpan** → **Transkripsi diproses di background** → **Teks dan status tersimpan** → **Data tersedia melalui API**

Status pemrosesan rekaman meliputi `UPLOADED`, `PROCESSING`, `COMPLETED`, dan `FAILED`.

> **Catatan:** Jika proses `faster-whisper` mengalami kegagalan, implementasi saat ini menggunakan teks transkrip simulasi sebagai fallback.

## 🔌 Endpoint API

Dokumentasi interaktif tersedia di `/docs` setelah server berjalan.

### Rekaman — `/recordings`

| Metode     | Endpoint                                | Kegunaan                                   |
| ---------- | --------------------------------------- | ------------------------------------------ |
| `POST`   | `/recordings/upload`                  | Mengunggah rekaman dan memulai transkripsi |
| `POST`   | `/recordings`                         | Membuat data rekaman                       |
| `GET`    | `/recordings`                         | Mengambil daftar rekaman                   |
| `GET`    | `/recordings/{recording_id}`          | Mengambil detail rekaman                   |
| `GET`    | `/recordings/{recording_id}/download` | Mengunduh berkas rekaman                   |
| `DELETE` | `/recordings/{recording_id}`          | Menghapus rekaman                          |

### Transkrip — `/transcripts`

| Metode     | Endpoint                                  | Kegunaan                                   |
| ---------- | ----------------------------------------- | ------------------------------------------ |
| `POST`   | `/transcripts`                          | Membuat transkrip                          |
| `GET`    | `/transcripts`                          | Mengambil daftar transkrip                 |
| `GET`    | `/transcripts/{transcript_id}`          | Mengambil transkrip berdasarkan ID         |
| `GET`    | `/transcripts/recording/{recording_id}` | Mengambil transkrip berdasarkan ID rekaman |
| `GET`    | `/transcripts/{transcript_id}/download` | Mengunduh transkrip sebagai TXT            |
| `DELETE` | `/transcripts/{transcript_id}`          | Menghapus transkrip                        |

### Pemeriksaan layanan

| Metode  | Endpoint    | Kegunaan                     |
| ------- | ----------- | ---------------------------- |
| `GET` | `/`       | Memeriksa pesan sambutan API |
| `GET` | `/health` | Memeriksa koneksi database   |

## 🧱 Teknologi

| Teknologi                | Peran                                  |
| ------------------------ | -------------------------------------- |
| **FastAPI**        | REST API dan dokumentasi endpoint      |
| **SQLAlchemy**     | Pemetaan model dan akses database      |
| **PostgreSQL**     | Penyimpanan data rekaman dan transkrip |
| **Alembic**        | Migrasi skema database                 |
| **faster-whisper** | Transkripsi audio                      |
| **Uvicorn**        | Server ASGI untuk menjalankan API      |

## 📁 Struktur backend

```text
backend/
├── app/
│   ├── core/
│   │   ├── database.py
│   │   └── dependencies.py
│   ├── models/
│   │   ├── _init_.py
│   │   ├── recording.py
│   │   └── transcript.py
│   ├── routers/
│   │   ├── recording_router.py
│   │   └── transcript_router.py
│   ├── schemas/
│   │   ├── recording_schema.py
│   │   └── transcript_schema.py
│   ├── services/
│   │   ├── storage.py
│   │   └── whisper_service.py
│   └── main.py
├── alembic/
│   ├── versions/
│   │   ├── 17fa159d77c9_create_recordings_table.py
│   │   ├── f056e8abdc46_create_transcript_table.py
│   │   └── b68ddba4077d_add_recording_metadata_and_status_fields.py
│   ├── env.py
│   ├── README
│   └── script.py.mako
├── uploads/                 # Dibuat saat file rekaman diunggah
│   └── audio/<YYYYMMDD>/
├── .env                     # Konfigurasi lokal, dibuat oleh pengembang
├── alembic.ini
├── requirements.txt
├── README.md
└── REVIEW.md
```

### Folder `app/core/` — konfigurasi inti

| File | Kegunaan |
| --- | --- |
| `database.py` | Membaca `DATABASE_URL`, membuat koneksi SQLAlchemy, session database, dan Base model. |
| `dependencies.py` | Menyediakan session database untuk endpoint dan menutupnya setelah request selesai. |

### Folder `app/models/` — representasi tabel database

| File | Kegunaan |
| --- | --- |
| `_init_.py` | Mengimpor model `Recording` dan `Transcript` agar keduanya dapat dimuat bersama. |
| `recording.py` | Mendefinisikan tabel rekaman, metadata berkas, durasi, dan status pemrosesan. |
| `transcript.py` | Mendefinisikan tabel transkrip dan relasinya ke rekaman. |

### Folder `app/routers/` — endpoint REST API

| File | Kegunaan |
| --- | --- |
| `recording_router.py` | Endpoint untuk mengunggah, membuat, melihat, mengunduh, dan menghapus rekaman; unggahan juga memulai tugas transkripsi. |
| `transcript_router.py` | Endpoint untuk membuat, melihat, mengunduh sebagai TXT, dan menghapus transkrip. |

### Folder `app/schemas/` — bentuk data API

| File | Kegunaan |
| --- | --- |
| `recording_schema.py` | Skema Pydantic untuk data rekaman masuk dan respons API. |
| `transcript_schema.py` | Skema Pydantic untuk data transkrip masuk dan respons API. |

### Folder `app/services/` — logika layanan

| File | Kegunaan |
| --- | --- |
| `storage.py` | Memeriksa ekstensi file yang diizinkan dan menyimpan unggahan ke direktori bertanggal di `uploads/audio/`. |
| `whisper_service.py` | Menjalankan transkripsi background dengan `faster-whisper`, memperbarui status, dan menyimpan hasil transkrip. |

### File utama aplikasi

| File | Kegunaan |
| --- | --- |
| `app/main.py` | Membuat aplikasi FastAPI, mengatur CORS, mendaftarkan router, dan menyediakan endpoint pemeriksaan layanan. |
| `requirements.txt` | Daftar dependensi Python backend. |
| `.env` | Konfigurasi lokal seperti `DATABASE_URL` dan `WHISPER_MODEL_SIZE`; buat file ini sendiri dan jangan commit nilai rahasia. |
| `alembic.ini` | Konfigurasi Alembic, termasuk lokasi skrip migrasi. |
| `README.md` | Dokumentasi penggunaan backend ini. |
| `REVIEW.md` | Catatan review proyek backend. |

### Folder `alembic/` — migrasi database

| File/folder | Kegunaan |
| --- | --- |
| `env.py` | Menghubungkan metadata model dengan proses migrasi Alembic. |
| `script.py.mako` | Template untuk membuat file migrasi baru. |
| `README` | Catatan bawaan Alembic. |
| `versions/17fa159d77c9_create_recordings_table.py` | Migrasi awal untuk membuat tabel `recordings`. |
| `versions/f056e8abdc46_create_transcript_table.py` | Migrasi untuk membuat tabel `transcripts` dan relasinya ke rekaman. |
| `versions/b68ddba4077d_add_recording_metadata_and_status_fields.py` | Migrasi untuk menambahkan metadata file dan status pemrosesan ke tabel `recordings`. |

Folder `uploads/audio/` dibuat saat ada unggahan. File disimpan di subfolder tanggal dengan pola `uploads/audio/<YYYYMMDD>/`; folder ini berisi data runtime, bukan source code.

## 🚀 Menjalankan backend

### Prasyarat

- Python 3.10 atau lebih baru
- PostgreSQL

### Persiapan

Dari direktori `backend`, buat dan aktifkan virtual environment, lalu pasang dependensi:

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

macOS/Linux:

```bash
source .venv/bin/activate
pip install -r requirements.txt
```

Buat file `.env` di direktori `backend` dan atur koneksi database:

```env
DATABASE_URL=postgresql://<username>:<password>@localhost:<port>/resmeet
```

Pastikan database PostgreSQL `resmeet` sudah tersedia. Sebelum migrasi, pastikan nilai `sqlalchemy.url` di `alembic.ini` menunjuk ke database yang sama dengan `DATABASE_URL`. Kemudian jalankan migrasi dan server:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

API berjalan di [http://localhost:8000](http://localhost:8000), dengan dokumentasi interaktif di [http://localhost:8000/docs](http://localhost:8000/docs).

### Konfigurasi transkripsi

Transkripsi berjalan menggunakan CPU dengan presisi `int8`. Ukuran model dapat diatur melalui `WHISPER_MODEL_SIZE`; jika tidak diatur, backend menggunakan model `base`.

```env
WHISPER_MODEL_SIZE=base
```

---

🎧 **ResMeet Backend — dari unggahan rekaman hingga transkrip yang siap digunakan.**
