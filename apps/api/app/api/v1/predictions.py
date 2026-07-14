from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services.prediction_query_service import PredictionQueryService

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_predictions(
    db: Session = Depends(get_db),
):

    predictions = PredictionQueryService.get_all(db)

    return {
        "count": len(predictions),
        "data": predictions,
    }


@router.get("/latest")
def latest_predictions(
    limit: int = 10,
    db: Session = Depends(get_db),
):

    predictions = PredictionQueryService.get_latest(
        db,
        limit,
    )

    return {
        "count": len(predictions),
        "data": predictions,
    }


@router.get("/{article_id}")
def article_predictions(
    article_id: int,
    db: Session = Depends(get_db),
):

    predictions = PredictionQueryService.get_by_article(
        db,
        article_id,
    )

    return {
        "count": len(predictions),
        "data": predictions,
    }