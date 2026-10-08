from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import os
import mimetypes

from app.core.dependencies import get_db
from app.models.recording import Recording
from app.schemas.recording_schema import (
    RecordingCreate,
    RecordingResponse
)
from app.services.storage import save_upload_file
from app.services.whisper_service import transcribe_audio_task

router = APIRouter(
    prefix="/recordings",
    tags=["Recordings"]
)

@router.post(
    "/upload",
    response_model=RecordingResponse
)
def upload_recording(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str | None = Form(None),
    db: Session = Depends(get_db)
):
    file_path, filename, file_size, mime_type = save_upload_file(file)

    recording_title = title if title and title.strip() else os.path.splitext(filename)[0]

    recording = Recording(
        title=recording_title,
        filename=filename,
        file_path=file_path,
        file_size=file_size,
        mime_type=mime_type,
        status="uploaded",
        processing_status="UPLOADED",
        transcription_status="PENDING",
        duration=None
    )

    db.add(recording)
    db.commit()
    db.refresh(recording)

    background_tasks.add_task(transcribe_audio_task, str(recording.id), file_path)

    return recording

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

@router.get("/{recording_id}/stream")
def stream_recording(
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
            detail="Media file not found"
        )

    media_type = recording.mime_type
    if not media_type:
        media_type, _ = mimetypes.guess_type(recording.file_path)
    if not media_type:
        media_type = "application/octet-stream"

    return FileResponse(
        path=recording.file_path,
        filename=recording.filename,
        media_type=media_type
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

    if recording.file_path and os.path.exists(recording.file_path):
        try:
            os.remove(recording.file_path)
        except Exception:
            pass

    db.delete(recording)
    db.commit()

    return {
        "message": "Recording deleted"
    }