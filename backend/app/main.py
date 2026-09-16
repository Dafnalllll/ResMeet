from fastapi import FastAPI
from sqlalchemy import text

from app.core.database import engine

app = FastAPI(
    title="ResMeet API",
    version="1.0.0",
)

@app.get("/")
def root():
    return {"message": "Welcome to ResMeet API!"}

@app.get("/health")
def health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
        
        return {"status": "healthy", "database": "connected"}