from fastapi import APIRouter
from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.market import Market

router = APIRouter()


@router.get("/")
def get_markets():
    db = SessionLocal()

    markets = db.scalars(
        select(Market)
    ).all()

    return markets