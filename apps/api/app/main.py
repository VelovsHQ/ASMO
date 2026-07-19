from fastapi import FastAPI , Depends
from app.api.v1.router import api_router
from contextlib import asynccontextmanager
from app.util.init_db import create_tables
from app.routers.auth import authRouter
from app.util.protectRoute import get_current_user
from app.db.schema.user import UserOutput


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
app.include_router(router=authRouter , tags=["auth"] , prefix="/auth")
# i gave this beacuse /auth/login

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

@app.get("/protected")
def read_protected(user : UserOutput = Depends(get_current_user)):
    return {"data" : user}