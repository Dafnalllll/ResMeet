import os
import uuid
from datetime import datetime
from fastapi import UploadFile, HTTPException

UPLOAD_BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "audio"))

ALLOWED_MIME_TYPES = {
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/m4a",
    "audio/x-m4a",
    "audio/mp4",
    "video/mp4",
}

ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".mp4"}


def save_upload_file(file: UploadFile) -> tuple[str, str, int, str]:
    """
    Menyimpan file yang diunggah ke struktur direktori: backend/uploads/audio/{YYYYMMDD}/{uuid}_{filename}.
    Mengembalikan (file_path, filename, file_size, mime_type).
    """
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Format file tidak didukung ({ext}). Gunakan MP3, WAV, M4A, atau MP4."
        )

    # Buat subdirektori berdasarkan tanggal (YYYYMMDD)
    date_str = datetime.now().strftime("%Y%m%d")
    target_dir = os.path.join(UPLOAD_BASE_DIR, date_str)
    os.makedirs(target_dir, exist_ok=True)

    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(target_dir, unique_filename)

    file_size = 0
    try:
        with open(file_path, "wb") as buffer:
            while True:
                chunk = file.file.read(1024 * 1024) # Baca per 1MB
                if not chunk:
                    break
                file_size += len(chunk)
                buffer.write(chunk)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal menyimpan file: {str(e)}"
        )
    finally:
        file.file.close()

    mime_type = file.content_type or "application/octet-stream"

    return file_path, file.filename or unique_filename, file_size, mime_type
