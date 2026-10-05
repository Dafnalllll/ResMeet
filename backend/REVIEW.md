
# Review & Audit Backend FastAPI

Dokumen ini merangkum *code smell*, bug, celah keamanan (*security vulnerabilities*), dan peluang optimasi yang ditemukan pada backend FastAPI ResMeet (`backend/app`).

---

## 1. Bug & Kerentanan Keamanan

### 🚨 Risiko Keamanan Kritis: Arbitrary File Read / Path Traversal (`recording_router.py`)

- **Lokasi:** `backend/app/routers/recording_router.py` (endpoint `download_recording`)
- **Masalah:** Skema `RecordingCreate` menerima nilai `file_path` secara langsung dari payload JSON yang dikirim klien. Endpoint download hanya memvalidasi dengan `os.path.exists(recording.file_path)` lalu mengirim file menggunakan `FileResponse`.
- **Dampak:** Klien yang berniat jahat dapat mengirim path file sensitif milik sistem (misalnya `/etc/passwd`, file konfigurasi, atau file rahasia lainnya) saat mendaftarkan recording, sehingga memungkinkan pengunduhan file tanpa otorisasi.
- **Rekomendasi:** Tangani proses upload file di sisi server menggunakan `UploadFile` (*multipart/form-data*), kemudian simpan dan layani file hanya dari direktori upload yang telah ditentukan dan dikontrol secara ketat.

---

### ⚠️ Kebocoran Ruang Penyimpanan: Penumpukan File Sementara (`transcript_router.py`)

- **Lokasi:** `backend/app/routers/transcript_router.py` (endpoint `download_transcript`)
- **Masalah:** Penggunaan `tempfile.NamedTemporaryFile(delete=False, suffix=".txt", mode="w", encoding="utf-8")` membuat file sementara yang tidak pernah dihapus karena parameter `delete=False`.
- **Dampak:** File sementara akan terus menumpuk di direktori temporary sistem dan pada akhirnya dapat menghabiskan kapasitas penyimpanan server.
- **Rekomendasi:** Gunakan `BackgroundTasks` dari FastAPI untuk menghapus file setelah proses download selesai, atau lakukan streaming file langsung dari memori tanpa membuat file sementara.

---

### ⚠️ Definisi Route Duplikat (`transcript_router.py`)

- **Lokasi:** `backend/app/routers/transcript_router.py`
- **Masalah:** Fungsi `get_transcript` untuk endpoint `/{transcript_id}` didefinisikan dua kali secara berurutan.
- **Dampak:** Definisi kedua akan menimpa definisi pertama. Meskipun aplikasi tetap berjalan, terdapat kode yang tidak pernah digunakan (*dead code*) dan berpotensi membingungkan saat pemeliharaan.
- **Rekomendasi:** Hapus salah satu definisi route yang duplikat.

---

### 🔒 Kebocoran Informasi Rahasia pada Log (`database.py`)

- **Lokasi:** `backend/app/core/database.py`
- **Masalah:** Baris `print("DATABASE_URL =", DATABASE_URL)` menampilkan seluruh connection string database (termasuk username dan password jika ada) ke log saat aplikasi dijalankan.
- **Dampak:** Kredensial database dapat terekspos melalui log server.
- **Rekomendasi:** Hapus statement tersebut atau lakukan masking/sanitasi terhadap informasi sensitif sebelum ditampilkan.

---

## 2. Code Smell & Permasalahan Arsitektur

### Tidak Ada Endpoint Upload File Multipart

- **Masalah:** Router recording saat ini hanya menerima metadata JSON melalui `RecordingCreate` yang sudah berisi `file_path`. Tidak ada endpoint yang benar-benar menangani upload file audio.
- **Rekomendasi:** Tambahkan endpoint yang menerima file menggunakan `UploadFile` dan `File(...)` agar proses upload dilakukan secara aman di server.

---

### Transaksi Database Tidak Ditangani dengan Baik

- **Masalah:** Pemanggilan `db.commit()` dilakukan langsung di endpoint tanpa blok `try...except` dan tanpa `db.rollback()`.
- **Dampak:** Jika terjadi error saat transaksi berlangsung, sesi database dapat berada dalam kondisi yang tidak konsisten.
- **Rekomendasi:** Bungkus operasi database dengan `try...except`, lakukan `db.rollback()` saat terjadi exception, dan kembalikan pesan error yang sesuai.

Contoh:

```python
try:
    db.add(recording)
    db.commit()
    db.refresh(recording)
except Exception:
    db.rollback()
    raise
```

---

### Menggunakan Konfigurasi Pydantic V1 pada Proyek Pydantic V2

- **Lokasi:** `recording_schema.py` dan `transcript_schema.py`
- **Masalah:** Masih menggunakan:

```python
class Config:
    from_attributes = True
```

Padahal pada Pydantic V2 direkomendasikan menggunakan:

```python
model_config = {
    "from_attributes": True
}
```

- **Rekomendasi:** Migrasikan konfigurasi schema ke format Pydantic V2 agar konsisten dengan versi yang digunakan.

---

## 3. Peluang Optimasi

### Pagination pada Endpoint List

- **Masalah:** Endpoint `GET /recordings` dan `GET /transcripts` mengambil seluruh data menggunakan:

```python
db.query(...).all()
```

tanpa pagination (`limit` dan `offset`).

- **Dampak:** Seiring bertambahnya data, performa akan menurun dan penggunaan memori meningkat.
- **Rekomendasi:** Tambahkan parameter query seperti:

```python
GET /recordings?limit=20&offset=0
```

Contoh implementasi:

```python
recordings = (
    db.query(Recording)
    .offset(offset)
    .limit(limit)
    .all()
)
```

---

### Driver Database Masih Sinkron (`psycopg2`)

- **Masalah:** FastAPI mendukung pemrosesan asynchronous, namun saat ini SQLAlchemy masih menggunakan driver sinkron `psycopg2-binary`.
- **Dampak:** Pada beban tinggi dan jumlah request yang besar, throughput aplikasi menjadi kurang optimal.
- **Rekomendasi:** Untuk kebutuhan skalabilitas yang lebih tinggi, pertimbangkan migrasi ke SQLAlchemy Async dengan `create_async_engine` dan driver `asyncpg`.

Contoh:

```python
postgresql+asyncpg://user:password@localhost/resmeet
```

---

# Prioritas Perbaikan

### 🔴 Prioritas Tinggi (Wajib Segera)

1. Menutup celah **Path Traversal / Arbitrary File Read**.
2. Menghapus kebocoran **DATABASE_URL** pada log.
3. Menangani **rollback transaksi database**.
4. Menghapus **route duplikat**.

### 🟡 Prioritas Menengah

5. Menambahkan endpoint upload file menggunakan `UploadFile`.
6. Membersihkan file temporary transcript setelah download.
7. Migrasi konfigurasi schema ke Pydantic V2.

### 🟢 Prioritas Rendah / Optimasi

8. Menambahkan pagination pada endpoint list.
9. Migrasi ke SQLAlchemy Async (`asyncpg`) jika aplikasi mulai melayani banyak pengguna secara bersamaan.

### Penilaian Keseluruhan

Untuk proyek ResMeet yang masih berada pada tahap pengembangan awal atau tugas kampus, struktur backend sudah cukup baik dan fungsional. Namun terdapat **1 celah keamanan kritis (Path Traversal)** yang perlu diperbaiki sebelum aplikasi di-deploy ke VPS atau digunakan oleh pengguna publik. Setelah itu, fokus berikutnya adalah stabilitas transaksi database dan manajemen file upload agar backend lebih aman serta siap dikembangkan lebih lanjut.
