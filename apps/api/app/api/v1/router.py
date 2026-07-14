from fastapi import APIRouter

from app.api.v1.pipeline import router as pipeline_router
from app.api.v1.articles import router as article_router

api_router = APIRouter()

api_router.include_router(pipeline_router)
api_router.include_router(article_router)