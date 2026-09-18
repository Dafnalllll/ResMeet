from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.routers.recording_router import router as recording_router
from app.routers.transcript_router import router as transcript_router

from app.core.database import engine

app = FastAPI(
    title="ResMeet API",
    version="1.0.0",
)

# Cors Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://resmeet.vercel.app", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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