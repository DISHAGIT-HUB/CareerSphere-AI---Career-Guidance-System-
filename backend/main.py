from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from database import engine
from models import Base
from routes import router

app = FastAPI(title="Career Sphere API")

# Create database tables
Base.metadata.create_all(bind=engine)

# Include API routes
app.include_router(router)

# Serve frontend files
app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")