from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import os

from app.core.dependencies import get_db
from app.models.recording import Recording
from app.schemas.recording_schema import (
    RecordingCreate,
    RecordingResponse
)

router = APIRouter(
    prefix="/recordings",
    tags=["Recordings"]
)

@router.post(
    "",
    response_model=RecordingResponse
)
def create_recording(
    payload: RecordingCreate,
    db: Session = Depends(get_db)
):
    recording = Recording(
        title=payload.title,
        filename=payload.filename,
        file_path=payload.file_path,
        duration=payload.duration
    )

    db.add(recording)
    db.commit()
    db.refresh(recording)

    return recording

@router.get(
    "",
    response_model=list[RecordingResponse]
)
def get_recordings(
    db: Session = Depends(get_db)
):
    return db.query(Recording).all()

@router.get(
    "/{recording_id}",
    response_model=RecordingResponse
)
def get_recording(
    recording_id: UUID,
    db: Session = Depends(get_db)
):
    recording = (
        db.query(Recording)
        .filter(Recording.id == recording_id)
        .first()
    )

    if not recording:
        raise HTTPException(
            status_code=404,
            detail="Recording not found"
        )

    return recording

@router.get("/{recording_id}/download")
def download_recording(
    recording_id: UUID,
    db: Session = Depends(get_db)
):
    recording = (
        db.query(Recording)
        .filter(Recording.id == recording_id)
        .first()
    )

    if not recording:
        raise HTTPException(
            status_code=404,
            detail="Recording not found"
        )

    if not os.path.exists(recording.file_path):
        raise HTTPException(
            status_code=404,
            detail="Audio file not found"
        )

    return FileResponse(
        path=recording.file_path,
        filename=recording.filename,
        media_type="audio/mpeg"
    )

@router.delete("/{recording_id}")
def delete_recording(
    recording_id: UUID,
    db: Session = Depends(get_db)
):
    recording = (
        db.query(Recording)
        .filter(Recording.id == recording_id)
        .first()
    )

    if not recording:
        raise HTTPException(
            status_code=404,
            detail="Recording not found"
        )

    db.delete(recording)
    db.commit()

    return {
        "message": "Recording deleted"
    }