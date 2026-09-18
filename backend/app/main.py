from fastapi import FastAPI
from sqlalchemy import text
from app.routers.recording_router import router as recording_router
from app.routers.transcript_router import router as transcript_router

from app.core.database import engine

app = FastAPI(
    title="ResMeet API",
    version="1.0.0",
)

app.include_router(recording_router)
app.include_router(transcript_router)


@app.get("/")
def root():
    return {"message": "Welcome to ResMeet API!"}

@app.get("/health")
def health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
        
        return {"status": "healthy", "database": "connected"}