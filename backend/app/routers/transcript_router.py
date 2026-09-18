from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
import tempfile
import os

from app.core.dependencies import get_db
from app.models.recording import Recording
from app.models.transcript import Transcript

from app.schemas.transcript_schema import (
    TranscriptCreate,
    TranscriptResponse
)

router = APIRouter(
    prefix="/transcripts",
    tags=["Transcripts"]
)


@router.post(
    "",
    response_model=TranscriptResponse
)
def create_transcript(
    payload: TranscriptCreate,
    db: Session = Depends(get_db)
):
    recording = (
        db.query(Recording)
        .filter(Recording.id == payload.recording_id)
        .first()
    )

    if not recording:
        raise HTTPException(
            status_code=404,
            detail="Recording not found"
        )

    transcript = Transcript(
        recording_id=payload.recording_id,
        transcript_text=payload.transcript_text
    )

    db.add(transcript)
    db.commit()
    db.refresh(transcript)

    return transcript


@router.get(
    "",
    response_model=list[TranscriptResponse]
)
def get_transcripts(
    db: Session = Depends(get_db)
):
    return db.query(Transcript).all()


@router.get(
    "/{transcript_id}",
    response_model=TranscriptResponse
)
def get_transcript(
    transcript_id: UUID,
    db: Session = Depends(get_db)
):
    transcript = (
        db.query(Transcript)
        .filter(Transcript.id == transcript_id)
        .first()
    )

    if not transcript:
        raise HTTPException(
            status_code=404,
            detail="Transcript not found"
        )

    return transcript

@router.get("/{transcript_id}/download")
def download_transcript(
    transcript_id: UUID,
    db: Session = Depends(get_db)
):
    transcript = (
        db.query(Transcript)
        .filter(Transcript.id == transcript_id)
        .first()
    )

    if not transcript:
        raise HTTPException(
            status_code=404,
            detail="Transcript not found"
        )

    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".txt",
        mode="w",
        encoding="utf-8"
    )

    temp_file.write(transcript.transcript_text)
    temp_file.close()

    return FileResponse(
        path=temp_file.name,
        filename=f"transcript_{transcript_id}.txt",
        media_type="text/plain"
    )


@router.delete("/{transcript_id}")
def delete_transcript(
    transcript_id: UUID,
    db: Session = Depends(get_db)
):
    transcript = (
        db.query(Transcript)
        .filter(Transcript.id == transcript_id)
        .first()
    )

    if not transcript:
        raise HTTPException(
            status_code=404,
            detail="Transcript not found"
        )

    db.delete(transcript)
    db.commit()

    return {
        "message": "Transcript deleted"
    }