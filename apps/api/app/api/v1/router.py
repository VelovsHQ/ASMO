from fastapi import APIRouter

from app.api.v1.endpoints import markets

api_router = APIRouter()

api_router.include_router(
    markets.router,
    prefix="/markets",
    tags=["Markets"],
)