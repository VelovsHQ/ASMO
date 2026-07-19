from fastapi import FastAPI
from app.api.v1.router import api_router
from contextlib import asynccontextmanager
from app.util.init_db import create_tables

@asynccontextmanager
async def lifespan(app : FastAPI):
    print("created db ini")
    create_tables()
    yield  # this is for the table generation


app = FastAPI(
    title="ASMO API",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(
    api_router,
    prefix="/api/v1",
)


@app.get("/")
def root():
    return {
        "message": "ASMO API Running",
    }

@app.get("/health")
def health_check():
    return {"status" : "Running SMOOTH"}