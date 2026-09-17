from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class RecordingCreate(BaseModel):
    title: str
    filename: str
    file_path: str
    duration: int | None = None


class RecordingResponse(BaseModel):
    id: UUID
    title: str
    filename: str
    file_path: str
    duration: int | None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True