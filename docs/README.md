# 🎙️ ResMeet

### Ubah rekaman rapat menjadi catatan yang siap dibaca dan dibagikan.

**ResMeet** adalah aplikasi web untuk mengelola rekaman rapat dan mengubah percakapan menjadi transkrip. Unggah file, biarkan proses transkripsi berjalan, lalu baca, salin, atau unduh hasilnya dalam format yang praktis.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-149eca?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Whisper-Speech_to_Text-7b61ff" alt="Whisper speech-to-text" />
</p>

## ✨ Apa yang bisa dilakukan?

- 📤 **Unggah rekaman dengan mudah** — pilih atau seret file MP3, WAV, M4A, dan MP4.
- 🤖 **Transkripsi otomatis** — proses rekaman menjadi teks menggunakan `faster-whisper`.
- 🗂️ **Kelola rekaman rapat** — lihat daftar rekaman, detail, metadata, dan status pemrosesannya.
- 📝 **Baca dan salin transkrip** — tinjau hasil transkripsi langsung dari halaman detail.
- 📥 **Ekspor untuk dibagikan** — unduh transkrip sebagai TXT, PDF, atau DOCX.

## 🧭 Alur singkat

**Unggah rekaman** → **Transkripsi diproses** → **Tinjau transkrip** → **Ekspor dan bagikan**

## 🛠️ Teknologi

| Bagian         | Teknologi                                |
| -------------- | ---------------------------------------- |
| 🖥️ Antarmuka | Next.js, React, TypeScript, Tailwind CSS |
| ⚙️ API       | Python, FastAPI                          |
| 🧠 Transkripsi | `faster-whisper`                       |
| 🗃️ Data      | SQLAlchemy, PostgreSQL, Alembic          |

## 💡 Tentang ResMeet

ResMeet dirancang untuk membantu tim menghemat waktu setelah rapat: rekaman tersimpan rapi, percakapan lebih mudah ditelusuri dalam bentuk teks, dan hasilnya siap dibagikan kepada anggota tim.
