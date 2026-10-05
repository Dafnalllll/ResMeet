from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class RecordingCreate(BaseModel):
    title: str
    filename: str
    file_path: str
    duration: int | None = None
    file_size: int | None = None
    mime_type: str | None = None
    processing_status: str | None = "UPLOADED"
    transcription_status: str | None = "PENDING"


class RecordingResponse(BaseModel):
    id: UUID
    title: str
    filename: str
    file_path: str
    duration: int | None = None
    file_size: int | None = None
    mime_type: str | None = None
    status: str = "uploaded"
    processing_status: str | None = "UPLOADED"
    transcription_status: str | None = "PENDING"
    created_at: datetime

    class Config:
        from_attributes = True
