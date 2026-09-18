from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class TranscriptCreate(BaseModel):
    recording_id: UUID
    transcript_text: str
    
    
class TranscriptResponse(BaseModel):
    id: UUID
    recording_id: UUID
    transcript_text: str
    created_at: datetime

    class Config:
        from_attributes = True